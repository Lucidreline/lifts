import { collection, updateDoc, addDoc, serverTimestamp, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore"; // Add new imports

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
