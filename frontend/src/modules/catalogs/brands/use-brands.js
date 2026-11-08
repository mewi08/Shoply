import { useEffect, useState } from "react";
import { create, get, list, remove, update } from "./brands.service";

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    list()
      .then((res) => active && setBrands(res.data))
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const res = await list();
    setBrands(res.data);
  };

  const getBrand = async (id) => {
    const res = await get(id);
    return res.data;
  };

  const saveBrand = async (id, nombre) => {
    if (id) await update(id, { nombre });
    else await create({ nombre });
    await refresh();
  };

  const removeBrand = async (id) => {
    await remove(id);
    await refresh();
  };

  return {
    brands,
    loading,
    loadError,
    getBrand,
    saveBrand,
    removeBrand,
  };
}
