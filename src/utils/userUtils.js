import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Checks for a user document in Firestore and creates one if it doesn't exist.
 * @param {object} user - The user object from Firebase Authentication.
 */
export const createUserDocument = async (user) => {
    // Exit if no user object is provided
    if (!user) return;

    // Create a reference to the document
    const userDocRef = doc(db, "user", user.uid);

    // Check if it exists
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
        try {
            await setDoc(userDocRef, {
                id: user.uid,
                exercises: [],
                sessions: [],
            });
            console.log("New user document created via utility function.");
        } catch (error) {
            console.error("Error creating user document:", error);
        }
    }
};