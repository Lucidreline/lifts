import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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