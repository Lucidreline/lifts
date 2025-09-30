import {
    Timestamp,
    updateDoc,
    addDoc,
    serverTimestamp,
    query,
    where,
    onSnapshot,
    doc,
    deleteDoc,
    arrayUnion,
    getDoc,
    getDocs,
    limit,
    collection,
    orderBy,
} from "firebase/firestore"; // Add new imports
import { auth } from '../firebase';

import { db } from "../firebase";

export const addExerciseToFirestore = async (exerciseData, userId) => {
    try {
        // 1. Filter out any empty secondary muscle groups
        const validSecondaryGroups = exerciseData.secondaryMuscleGroups.filter(
            (group) => group.simple
        );

        // 2. Format the muscle groups data
        const muscleGroupsForDb = {
            primary: {
                simple: exerciseData.primaryMuscleGroup.simple,
                // If 'specific' is empty, save it as null
                specific: exerciseData.primaryMuscleGroup.specific || null,
            },
            secondary: validSecondaryGroups.map(group => ({
                simple: group.simple,
                // If 'specific' is empty, save it as null
                specific: group.specific || null,
            })),
        };

        // 3. Construct the final document to be saved
        const exerciseDoc = {
            user: userId,
            name: exerciseData.name,
            variation: exerciseData.variation,
            repRange: exerciseData.repRange,
            categories: exerciseData.categories,
            muscleGroups: muscleGroupsForDb,
            pr: {
                currentPr: null,
                pastPrs: [],
            },
            createdDate: serverTimestamp(),
        };

        // 4. Add the document to the 'exercises' collection
        const docRef = await addDoc(collection(db, "exercises"), exerciseDoc);
        console.log("Exercise document written with ID: ", docRef.id);
        return { success: true };

    } catch (error) {
        console.error("Error adding exercise document: ", error);
        return { success: false, error };
    }
};

/**
 * Fetches exercises for a specific user in real-time.
 * @param {string} userId - The ID of the user.
 * @param {function} callback - The function to call with the exercises array.
 * @returns {function} - The unsubscribe function for the listener.
 */
export const getUserExercises = (userId, callback) => {
    if (!userId) return;

    const exercisesColRef = collection(db, "exercises");
    const q = query(exercisesColRef, where("user", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const exercises = [];
        querySnapshot.forEach((doc) => {
            exercises.push({ id: doc.id, ...doc.data() });
        });
        callback(exercises);
    });

    return unsubscribe; // Return the function to stop listening
};

/**
 * Deletes an exercise document from Firestore.
 * @param {string} exerciseId - The ID of the document to delete.
 */
export const deleteExercise = async (exerciseId) => {
    try {
        const exerciseDocRef = doc(db, "exercises", exerciseId);
        await deleteDoc(exerciseDocRef);
        console.log("Exercise deleted successfully.");
        return { success: true };
    } catch (error) {
        console.error("Error deleting exercise:", error);
        return { success: false, error };
    }
};

/**
 * Updates an existing exercise document in Firestore.
 * @param {string} exerciseId - The ID of the document to update.
 * @param {object} exerciseData - The updated form data.
 */
export const updateExercise = async (exerciseId, exerciseData) => {
    try {
        // This data formatting logic is the same as in the 'add' function
        const validSecondaryGroups = exerciseData.secondaryMuscleGroups.filter(
            (group) => group.simple
        );

        const muscleGroupsForDb = {
            primary: {
                simple: exerciseData.primaryMuscleGroup.simple,
                specific: exerciseData.primaryMuscleGroup.specific || null,
            },
            secondary: validSecondaryGroups.map(group => ({
                simple: group.simple,
                specific: group.specific || null,
            })),
        };

        // Construct the object with the fields to update
        const updatedExerciseDoc = {
            name: exerciseData.name,
            variation: exerciseData.variation,
            repRange: exerciseData.repRange,
            categories: exerciseData.categories,
            muscleGroups: muscleGroupsForDb,
        };

        const exerciseDocRef = doc(db, "exercises", exerciseId);
        await updateDoc(exerciseDocRef, updatedExerciseDoc);

        console.log("Exercise document updated successfully.");
        return { success: true };

    } catch (error) {
        console.error("Error updating exercise document: ", error);
        return { success: false, error };
    }
};


/**
 * Checks if a new set is a PR for an exercise and updates the exercise document accordingly.
 * @param {object} exercise - The full exercise object, including its PR data.
 * @param {object} newSet - The full new set object that was just created.
 */
export const checkAndUpdatePr = async (exercise, newSet) => {
    try {
        const currentPr = exercise.pr.currentPr;
        const newScore = newSet.score;

        if (!currentPr || newScore > currentPr.score) {
            console.log(`New PR achieved for ${exercise.name}! Score: ${newScore}`);

            const newPrObject = {
                setId: newSet.id,
                reps: newSet.repCount,
                weight: newSet.weight,
                score: newScore,
                session: newSet.session,
                timestamp: Timestamp.now(), // This line needs the import
            };

            const exerciseUpdateData = {
                "pr.currentPr": newPrObject
            };

            if (currentPr) {
                // Using arrayUnion is safer as it prevents duplicates if run multiple times
                exerciseUpdateData["pr.pastPrs"] = arrayUnion(currentPr);
            }

            const exerciseDocRef = doc(db, "exercises", exercise.id);
            await updateDoc(exerciseDocRef, exerciseUpdateData);

            const setDocRef = doc(db, "sets", newSet.id);
            await updateDoc(setDocRef, { isPr: true });
        }

        return { success: true };

    } catch (error) {
        console.error("Error checking/updating PR:", error);
        return { success: false, error };
    }
};

/**
 * Rolls back the PR for an exercise when the current PR set is deleted.
 * @param {string} exerciseId - The ID of the exercise to update.
 */
export const rollbackPr = async (exerciseId) => {
    try {
        const exerciseDocRef = doc(db, "exercises", exerciseId);
        const docSnap = await getDoc(exerciseDocRef);

        if (!docSnap.exists()) {
            throw new Error("Exercise document not found for PR rollback.");
        }

        const exerciseData = docSnap.data();
        let pastPrs = exerciseData.pr.pastPrs || [];
        let newCurrentPr = null;

        if (pastPrs.length > 0) {
            // Sort past PRs to find the most recent one
            pastPrs.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

            // The new current PR is the first one in the sorted list
            newCurrentPr = pastPrs[0];
            // The new pastPrs array is the rest of the list
            pastPrs = pastPrs.slice(1);
        }

        // Update the exercise document with the new PR state
        await updateDoc(exerciseDocRef, {
            "pr.currentPr": newCurrentPr,
            "pr.pastPrs": pastPrs
        });

        console.log(`PR rolled back successfully for exercise ${exerciseId}`);
        return { success: true };

    } catch (error) {
        console.error("Error rolling back PR:", error);
        return { success: false, error };
    }
};

/**
 * Fetches the last 3 completed sets for a specific exercise for the current user.
 * @param {string} exerciseId - The ID of the exercise.
 * @returns {Array} - An array of the last 3 set objects.
 */
export const getLastSetsForExercise = async (exerciseId) => {
    const userId = auth.currentUser?.uid;
    if (!userId || !exerciseId) return [];

    const setsColRef = collection(db, "sets");
    const q = query(
        setsColRef,
        where("createdBy", "==", userId),
        where("exercise", "==", exerciseId),
        where("complete", "==", true),
        orderBy("createdAt", "desc"),
        limit(3)
    );

    try {
        const querySnapshot = await getDocs(q);
        const sets = [];
        querySnapshot.forEach((doc) => {
            sets.push({ id: doc.id, ...doc.data() });
        });
        return sets;
    } catch (error) {
        console.error("Error fetching last sets for exercise:", error);
        return [];
    }
};