import { useEffect, useState } from "react";
import { create, get, list, update, remove } from "./units.service";

export function useUnits() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    list()
      .then((res) => active && setUnits(res.data))
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const res = await list();
    setUnits(res.data);
  };

  const getUnit = async (id) => {
    const res = await get(id);
    return res.data;
  };

  const saveUnit = async (id, data) => {
    if (id) await update(id, data);
    else await create(data);
    await refresh();
  };

  const removeUnit = async (id) => {
    await remove(id);
    await refresh();
  };

  return {
    units,
    loading,
    loadError,
    getUnit,
    saveUnit,
    removeUnit,
  };
}
