import { useEffect, useState } from "react";
import { listenToItems } from "../services/itemsService";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToItems(
      (rows) => {
        setItems(rows);
        setLoading(false);
      },
      (err) => {
        console.error("[useItems] Error escuchando items:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, []);

  return { items, loading, error };
}
