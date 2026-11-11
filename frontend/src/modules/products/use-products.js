import { useEffect, useState } from "react";
import {
  create,
  get,
  list,
  listBrands,
  listCategories,
  listUnits,
  toggleStatus,
  update,
} from "./products.service";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState({ brands: [], categories: [], units: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([list(), listBrands(), listCategories(), listUnits()])
      .then(([p, b, c, u]) => {
        if (!active) return;
        setProducts(p.data);
        setCatalogs({ brands: b.data, categories: c.data, units: u.data });
      })
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const res = await list();
    setProducts(res.data);
  };

  const getProduct = async (id) => {
    const res = await get(id);
    return res.data;
  };

  const saveProduct = async (id, data) => {
    if (id) await update(id, data);
    else await create(data);
    await refresh();
  };

  const toggleProductStatus = async (id) => {
    await toggleStatus(id);
    await refresh();
  };

  return {
    products,
    catalogs,
    loading,
    loadError,
    getProduct,
    saveProduct,
    toggleProductStatus,
  };
}