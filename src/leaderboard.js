import { db } from './firebase.js';
import { collection, addDoc, deleteDoc, doc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'leaderboard';
const MAX_ENTRIES = 25;

// Cached threshold to avoid unnecessary Firestore reads
let cachedLowestXp = null;
let cachedEntryCount = null;

/**
 * Submit a score to the leaderboard only if it cracks the top 25.
 * Uses a cached threshold to skip Firestore reads when score clearly won't qualify.
 */
export async function submitScore({ name, xp, accuracy, battlesWon, battlesTotal }) {
  try {
    // Quick reject using cached threshold
    if (cachedEntryCount !== null && cachedEntryCount >= MAX_ENTRIES && cachedLowestXp !== null && xp <= cachedLowestXp) {
      return;
    }

    const q = query(
      collection(db, COLLECTION),
      orderBy('xp', 'desc'),
      limit(MAX_ENTRIES)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs;

    // Update cache
    cachedEntryCount = entries.length;
    cachedLowestXp = entries.length > 0 ? entries[entries.length - 1].data().xp : null;

    // Check if score qualifies
    if (entries.length >= MAX_ENTRIES) {
      if (xp <= cachedLowestXp) return;

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

    // Update cache after successful write
    cachedEntryCount = Math.min(entries.length + 1, MAX_ENTRIES);
    cachedLowestXp = Math.min(xp, cachedLowestXp ?? xp);
  } catch (err) {
    console.error('Failed to submit score:', err);
  }
}

/**
 * Fetch the top 25 scores, ordered by XP descending.
 * Also updates the cached threshold.
 */
export async function fetchLeaderboard() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('xp', 'desc'),
      limit(MAX_ENTRIES)
    );
    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map((doc, i) => ({
      rank: i + 1,
      ...doc.data()
    }));

    // Update cache from fetch
    cachedEntryCount = entries.length;
    cachedLowestXp = entries.length > 0 ? entries[entries.length - 1].xp : null;

    return entries;
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
}
