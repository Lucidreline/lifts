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

/**
 * Creates a new set document and adds its ID to the session's 'sets' array.
 * @param {object} setData - The data for the new set from the form.
 * @param {string} sessionId - The ID of the current session.
 * @param {string} userId - The ID of the current user.
 */
export const addSetToSession = async (setData, sessionId, userId) => {
    try {
        // 1. Construct the new set document
        const setDocData = {
            ...setData,
            repCount: Number(setData.reps) || 0,
            weight: Number(setData.weight) || 0,
            intensity: Number(setData.intensity) || 0,
            score: (Number(setData.reps) || 0) * (Number(setData.weight) || 0),
            isPr: false, // We'll handle PR logic later
            session: sessionId,
            createdBy: userId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
        // Remove the form-specific 'reps' key
        delete setDocData.reps;

        // 2. Add the new document to the 'sets' collection
        const setDocRef = await addDoc(collection(db, "sets"), setDocData);
        console.log("Set created with ID:", setDocRef.id);

        // 3. Update the session document to include the new set's ID
        const sessionDocRef = doc(db, "sessions", sessionId);
        await updateDoc(sessionDocRef, {
            sets: arrayUnion(setDocRef.id)
        });
        await updateDoc(sessionDocRef, { sets: arrayUnion(setDocRef.id) });

        return { success: true, newSet: { id: setDocRef.id, ...setDocData } };
    } catch (error) {
        console.error("Error adding set to session:", error);
        return { success: false, error };
    }
};