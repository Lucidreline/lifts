// src/utils/sessionUtils.js
import {
    collection, addDoc, serverTimestamp, query,
    where,
    onSnapshot,
    orderBy,
    doc,
    updateDoc,
    arrayUnion,
    Timestamp
} from "firebase/firestore";
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

/**
 * Fetches sessions for a specific user in real-time, sorted by date.
 * @param {string} userId - The ID of the user.
 * @param {function} callback - The function to call with the sessions array.
 * @returns {function} - The unsubscribe function for the listener.
 */
export const getUserSessions = (userId, callback) => {
    if (!userId) return () => { };

    const sessionsColRef = collection(db, "sessions");
    // Create a query to get sessions for the user, ordered by startDate descending
    const q = query(sessionsColRef, where("user", "==", userId), orderBy("startDate", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sessions = [];
        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
        });
        callback(sessions);
    });

    return unsubscribe;
};

/**
 * Fetches a single session document in real-time.
 * @param {string} sessionId - The ID of the session document.
 * @param {function} callback - The function to call with the session data.
 * @returns {function} - The unsubscribe function for the listener.
 */
export const getSession = (sessionId, callback) => {
    const sessionDocRef = doc(db, "sessions", sessionId);

    const unsubscribe = onSnapshot(sessionDocRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() });
        } else {
            // Handle the case where the document doesn't exist
            console.error("Session not found!");
            callback(null);
        }
    });

    return unsubscribe;
};

export const updateSession = async (sessionId, dataToUpdate) => {
    try {
        const sessionDocRef = doc(db, "sessions", sessionId);
        await updateDoc(sessionDocRef, dataToUpdate);
        console.log("Session updated successfully.");
        return { success: true };
    } catch (error) {
        console.error("Error updating session:", error);
        return { success: false, error };
    }
};