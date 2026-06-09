import { db } from './config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'bookings';

/**
 * Subscribe to all bookings for a specific date.
 * Returns unsubscribe function.
 */
export function subscribeToDateBookings(dateKey, callback) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, COLLECTION),
    where('date', '==', dateKey),
    where('status', '==', 'booked')
  );
  return onSnapshot(q, (snapshot) => {
    const booked = snapshot.docs.map((d) => d.data().time);
    callback(booked);
  }, (err) => {
    console.error('Firestore snapshot error:', err);
    callback([]);
  });
}

export async function isSlotBooked(dateKey, time) {
  if (!db) return false;
  const docId = `${dateKey}_${time.replace(':', '-')}`;
  const ref = doc(db, COLLECTION, docId);
  const snap = await getDoc(ref);
  return snap.exists() && snap.data().status === 'booked';
}

/**
 * Create a new booking in Firestore.
 * Returns { success: true } or { success: false, error }
 */
export async function createBooking({ dateKey, time, name, email, phone, purpose }) {
  if (!db) {
    return { success: false, error: 'Firebase not configured' };
  }

  const docId = `${dateKey}_${time.replace(':', '-')}`;
  const ref = doc(db, COLLECTION, docId);

  try {
    // Check one more time before writing (race condition guard)
    const existing = await getDoc(ref);
    if (existing.exists() && existing.data().status === 'booked') {
      return { success: false, error: 'SLOT_TAKEN' };
    }

    await setDoc(ref, {
      date: dateKey,
      time,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      purpose,
      status: 'booked',
      bookedAt: serverTimestamp(),
    });

    return { success: true, docId };
  } catch (err) {
    console.error('createBooking error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to all bookings in real time.
 */
export function subscribeToAllBookings(callback) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'booked')
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    // Sort bookings by date descending, then time descending
    data.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
    callback(data);
  }, (err) => {
    console.error('Firestore subscribeToAllBookings error:', err);
    callback([]);
  });
}

/**
 * Delete / Cancel a booking.
 */
export async function deleteBooking(docId) {
  if (!db) return { success: false, error: 'Firebase not configured' };
  try {
    const ref = doc(db, COLLECTION, docId);
    await setDoc(ref, { status: 'cancelled' }, { merge: true });
    return { success: true };
  } catch (err) {
    console.error('deleteBooking error:', err);
    return { success: false, error: err.message };
  }
}

