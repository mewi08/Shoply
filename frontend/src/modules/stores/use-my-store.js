import { useEffect, useState } from "react";
import { getMyStore, updateMyStore } from "./stores.service";

export function useMyStore() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const refresh = async () => {
    const res = await getMyStore();
    setStore(res.data);
  };

  useEffect(() => {
    refresh()
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const saveMyStore = async (data) => {
    const res = await updateMyStore(data);
    await refresh();
    return res;
  };

  return { store, loading, loadError, saveMyStore };
}