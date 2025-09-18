import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates a new routine document in Firestore.
 * @param {string} routineName - The name of the routine.
 * @param {Array<string>} selectedExerciseIds - An array of exercise document IDs.
 * @param {string} userId - The ID of the current user.
 */
export const addRoutineToFirestore = async (routineName, selectedExerciseIds, userId) => {
    try {
        // Construct the document to be saved
        const routineDoc = {
            user: userId,
            name: routineName,
            exercises: selectedExerciseIds, // The array of exercise IDs
            createdDate: serverTimestamp(),
        };

        // Add the document to a new "routines" collection
        const docRef = await addDoc(collection(db, "routines"), routineDoc);
        console.log("Routine document written with ID: ", docRef.id);
        return { success: true };

    } catch (error) {
        console.error("Error adding routine document: ", error);
        return { success: false, error };
    }
};