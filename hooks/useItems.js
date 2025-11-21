import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchItems() {
      try {
        setLoading(true);

        console.log("[useItems] Empezando fetch de items...");

        const ref = collection(db, "items");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (cancelled) return;

        const rows = [];
        snapshot.forEach((docSnap) => {
          rows.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        console.log("[useItems] Fetch completo. Cantidad:", rows.length);

        setItems(rows);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("[useItems] Error leyendo items:", err);
        setError(err);
        setLoading(false);
      }
    }

    fetchItems();

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading, error };
}
