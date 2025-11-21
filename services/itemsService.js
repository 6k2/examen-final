import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const STUDENT_ID = "A01282356";
const COLLECTION_NAME = "items";

function mapSnapshot(snapshot) {
  const rows = [];
  snapshot.forEach((docSnap) => {
    rows.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });
  return rows;
}

// Escuchar cambios en los items
export function listenToItems(callback, errorCallback) {
  const ref = collection(db, COLLECTION_NAME);
  const q = query(ref, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const items = mapSnapshot(snapshot);
      callback(items);
    },
    (error) => {
      console.error("Error escuchando items:", error);
      if (errorCallback) errorCallback(error);
    }
  );

  return unsubscribe;
}

// Crear un nuevo item
export async function createItem({ title, description = "" }) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error("El título es obligatorio.");
  }

  const ref = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(ref, {
    title: trimmedTitle,
    description: description || "",
    studentId: STUDENT_ID,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Actualizar un item existente
export async function updateItem(id, { title, description }) {
  if (!id) throw new Error("Falta el ID del item.");

  const updatePayload = {};
  if (typeof title === "string") {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error("El título no puede estar vacío.");
    }
    updatePayload.title = trimmedTitle;
  }
  if (typeof description === "string") {
    updatePayload.description = description;
  }

  updatePayload.updatedAt = serverTimestamp();

  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, updatePayload);
}

// Eliminar un item
export async function deleteItem(id) {
  if (!id) throw new Error("Falta el ID del item.");
  const ref = doc(db, COLLECTION_NAME, id);
  await deleteDoc(ref);
}
