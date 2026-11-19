import { useEffect, useState } from "react";
import { get, create, list, toggleStatus, update } from "./clients.service";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    list()
      .then((res) => active && setClients(res.data))
      .catch((err) => active && setLoadError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    const res = await list();
    setClients(res.data);
  };

  const getClient = async (id) => {
    const res = await get(id);
    return res.data;
  };

  const saveClient = async (id, data) => {
    if (id) await update(id, { data });
    else await create(data);
    await refresh();
  };

  const toggleClientStatus = async (id) => {
    await toggleStatus(id);
    await refresh();
  };

  return {
    clients,
    loading,
    loadError,
    getClient,
    saveClient,
    toggleClientStatus,
  };
}
