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

export function useProducts(filters = {}) {
  const { buscar, idmarca, idcategoria, page, limit } = filters;
  const params = { buscar, idmarca, idcategoria, page, limit };

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [catalogs, setCatalogs] = useState({ brands: [], categories: [], units: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const showResult = (data) => {
    setProducts(data.items);
    setTotal(data.total);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    Promise.all([listBrands(), listCategories(), listUnits()])
      .then(([b, c, u]) =>
        setCatalogs({ brands: b.data, categories: c.data, units: u.data }),
      )
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    list(params)
      .then((res) => active && showResult(res.data))
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [buscar, idmarca, idcategoria, page, limit]);

  const refresh = async () => {
    const res = await list(params);
    showResult(res.data);
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
    total,
    totalPages,
    catalogs,
    loading,
    loadError,
    getProduct,
    saveProduct,
    toggleProductStatus,
  };
}