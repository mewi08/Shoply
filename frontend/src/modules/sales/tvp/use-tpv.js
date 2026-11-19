import { useCallback, useMemo, useState } from "react";
import { FRACTIONAL_UNITS, roundQty, saleTotal } from "./format.js";

const MAX_QUANTITY = 9999;

export function useTpv() {
  const [items, setItems] = useState([]);

  const addProduct = useCallback((product) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(roundQty(item.quantity + 1), MAX_QUANTITY) }
            : item,
        );
      }
      return [
        {
          id: product.id,
          code: product.codigo,
          name: product.nombre,
          presentation: product.presentacion,
          price: product.precio_venta,
          unit: product.unidad || "und",
          fractional: FRACTIONAL_UNITS.includes(product.unidad),
          quantity: 1,
        },
        ...current,
      ];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(roundQty(quantity), MAX_QUANTITY) } : item
      )
    );
  }, []);

  const removeProduct = useCallback((id) => setItems((current) => current.filter((item) => item.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const total = useMemo(() => saleTotal(items), [items]);

  return { items, total, addProduct, setQuantity, removeProduct, clear };
}