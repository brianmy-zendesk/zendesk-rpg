import { db } from './firebase.js';
import { collection, addDoc, deleteDoc, doc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'leaderboard';
const MAX_ENTRIES = 25;

/**
 * Submit a score to the leaderboard only if it cracks the top 25.
 * If the board is full, removes the lowest entry to make room.
 */
export async function submitScore({ name, xp, accuracy, battlesWon, battlesTotal }) {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('xp', 'desc'),
      limit(MAX_ENTRIES)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs;

    // Check if score qualifies
    if (entries.length >= MAX_ENTRIES) {
      const lowestXp = entries[entries.length - 1].data().xp;
      if (xp <= lowestXp) return; // Doesn't crack top 25

      // Remove the lowest entry to make room
      await deleteDoc(doc(db, COLLECTION, entries[entries.length - 1].id));
    }

    await addDoc(collection(db, COLLECTION), {
      name: name.substring(0, 10),
      xp,
      accuracy,
      battlesWon,
      battlesTotal,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.error('Failed to submit score:', err);
  }
}

/**
 * Fetch the top 25 scores, ordered by XP descending.
 */
export async function fetchLeaderboard() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('xp', 'desc'),
      limit(MAX_ENTRIES)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, i) => ({
      rank: i + 1,
      ...doc.data()
    }));
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
}
