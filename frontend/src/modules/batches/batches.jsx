import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ConfirmDialog, CrudCard, CrudPage, DataTable, Dialog } from "../../../components/crud";
import BatchForm from "./batch-form";
import * as batchesService from "./batches.service";
import * as productsService from "../products/products.service";

const TRAIL = [
  { label: "Menú", to: "/" },
  { label: "Punto de venta", to: "/punto-de-venta" },
  { label: "Lotes" },
];

const COLUMNS = [
  { key: "nombre", header: "Producto" },
  { key: "cantidad_actual", header: "Disponible", render: (l) => Number(l.cantidad_actual) },
  { key: "cantidad_inicial", header: "Ingresó", render: (l) => Number(l.cantidad_inicial) },
  {
    key: "costo_unitario",
    header: "Costo",
    render: (l) => (l.costo_unitario ? `S/ ${Number(l.costo_unitario).toFixed(2)}` : "—"),
  },
  { key: "fecha_caducidad", header: "Caduca", render: (l) => l.fecha_caducidad?.slice(0, 10) ?? "—" },
];

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadBatches = async () => {
    const res = await batchesService.list();
    setBatches(res.data);
  };

  useEffect(() => {
    Promise.all([batchesService.list(), productsService.list({ estado: 1, limit: 100 })])
      .then(([batchesRes, productsRes]) => {
        setBatches(batchesRes.data);
        setProducts(productsRes.data.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (data) => {
    await batchesService.create(data);
    setFormOpen(false);
    setStatus("Lote registrado");
    await loadBatches();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");

    try {
      await batchesService.remove(toDelete.id);
      setToDelete(null);
      setStatus("Lote eliminado");
      await loadBatches();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <CrudPage
      titulo="Lotes"
      subtitulo="Ingresos de mercadería y stock disponible por lote."
      ruta={TRAIL}
      estado={status}
      accion={
        <button type="button" className="btn btn-primary btn-block" onClick={() => setFormOpen(true)}>
          <Plus size={20} /> Registrar lote
        </button>
      }
    >
      {error && <p className="form-error">{error}</p>}

      <CrudCard titulo="Lotes de tu tienda" subtitulo="Más recientes primero">
        <DataTable
          columnas={COLUMNS}
          filas={batches}
          cargando={loading}
          accionesExtra={(lot) => (
            <button type="button" className="btn btn-danger-soft" onClick={() => setToDelete(lot)}>
              <Trash2 size={13} /> Eliminar
            </button>
          )}
        />
      </CrudCard>

      <Dialog abierto={formOpen} titulo="Registrar lote" alCerrar={() => setFormOpen(false)}>
        {formOpen && (
          <BatchForm products={products} onSave={handleSave} onCancel={() => setFormOpen(false)} />
        )}
      </Dialog>

      <ConfirmDialog
        abierto={toDelete !== null}
        titulo={`¿Eliminar el lote de ${toDelete?.nombre ?? ""}?`}
        textoConfirmar="Eliminar lote"
        textoCargando="Eliminando…"
        tipo="peligro"
        IconoConfirmar={Trash2}
        cargando={deleting}
        error={deleteError}
        alConfirmar={confirmDelete}
        alCancelar={() => setToDelete(null)}
      >
        <p>Esta acción no se puede deshacer.</p>
      </ConfirmDialog>
    </CrudPage>
  );
}