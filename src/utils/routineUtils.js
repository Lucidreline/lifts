import { collection, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates a new routine document in Firestore.
 * @param {object} routineData - The data from the form.
 * @param {string} userId - The ID of the current user.
 */
export const addRoutineToFirestore = async (routineData, userId) => {
    try {
        // Create an array of objects, each with the exercise ID and its order (index)
        const exercisesWithOrder = routineData.selectedExercises.map((ex, index) => ({
            exerciseId: ex.id,
            order: index
        }));

        const routineDoc = {
            user: userId,
            name: routineData.routineName,
            categories: routineData.routineCategories,
            exercises: exercisesWithOrder, // Save the new array of objects
            createdDate: serverTimestamp(),
        };

        await addDoc(collection(db, "routines"), routineDoc);
        return { success: true };

    } catch (error) {
        console.error("Error adding routine document: ", error);
        return { success: false, error };
    }
};

/**
 * Fetches routines for a specific user in real-time.
 * @param {string} userId - The ID of the user.
 * @param {function} callback - The function to call with the routines array.
 * @returns {function} - The unsubscribe function for the listener.
 */
export const getUserRoutines = (userId, callback) => {
    if (!userId) return () => { };

    const routinesColRef = collection(db, "routines");
    const q = query(routinesColRef, where("user", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const routines = [];
        querySnapshot.forEach((doc) => {
            routines.push({ id: doc.id, ...doc.data() });
        });
        callback(routines);
    });

    return unsubscribe;
};

/**
 * Deletes a routine document from Firestore.
 * @param {string} routineId - The ID of the document to delete.
 */
export const deleteRoutine = async (routineId) => {
    try {
        const routineDocRef = doc(db, "routines", routineId);
        await deleteDoc(routineDocRef);
        console.log("Routine deleted successfully.");
        return { success: true };
    } catch (error) {
        console.error("Error deleting routine:", error);
        return { success: false, error };
    }
};

/**
 * Updates an existing routine document in Firestore.
 * @param {string} routineId - The ID of the document to update.
 * @param {object} routineData - The updated form data.
 */
export const updateRoutine = async (routineId, routineData) => {
    try {
        // Do the same transformation for the update function
        const exercisesWithOrder = routineData.selectedExercises.map((ex, index) => ({
            exerciseId: ex.id,
            order: index
        }));

        const updatedRoutineDoc = {
            name: routineData.routineName,
            categories: routineData.routineCategories,
            exercises: exercisesWithOrder,
        };

        const routineDocRef = doc(db, "routines", routineId);
        await updateDoc(routineDocRef, updatedRoutineDoc);
        return { success: true };

    } catch (error) {
        console.error("Error updating routine document: ", error);
        return { success: false, error };
    }
};