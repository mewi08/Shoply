import { useEffect, useState } from "react";
import * as api from "./stores.service";

const REQUEST_STATES = ["pendiente", "rechazada"];

export function useStores() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const refresh = async () => {
    const res = await api.list();
    setAll(res.data);
  };

  useEffect(() => {
    refresh()
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const act = (action) => async (...args) => {
    const res = await action(...args);
    await refresh();
    return res;
  };

  return {
    requests: all.filter((s) => REQUEST_STATES.includes(s.estado)),
    stores: all.filter((s) => !REQUEST_STATES.includes(s.estado)),
    loading,
    loadError,
    updateStore: act(api.update),
    approve: act(api.approve),
    reject: act(api.reject),
    deactivate: act(api.deactivate),
    reactivate: act(api.reactivate),
  };
}