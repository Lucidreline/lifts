// src/utils/sessionUtils.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const createNewSession = async (userId) => {
    try {
        const sessionDoc = {
            user: userId,
            startDate: serverTimestamp(),
            status: 'active',
            // We'll add more metadata later
        };
        const docRef = await addDoc(collection(db, "sessions"), sessionDoc);
        return docRef.id; // Return the new document's ID
    } catch (error) {
        console.error("Error creating new session:", error);
        return null;
    }
};