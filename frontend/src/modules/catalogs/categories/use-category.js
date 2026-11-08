import { useEffect, useState } from "react";
import { create, get, list, update, remove } from "./categories.service";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    list()
      .then((res) => active && setCategories(res.data))
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const res = await list();
    setCategories(res.data);
  }

  const getCategory = async (id) => {
    const res = await get(id);
    return res.data;
  };

  const saveCategory = async (id, nombre) => {
    if (id) await update(id, { nombre });
    else await create({ nombre });
    await refresh();
  };

  const removeCategory = async (id) => {
    await remove(id);
    await refresh();
  };

  return {
    categories,
    loading,
    loadError,
    getCategory,
    saveCategory,
    removeCategory,
  };
}
