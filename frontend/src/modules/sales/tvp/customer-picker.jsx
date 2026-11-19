import { useEffect, useState } from "react";
import { ChevronRight, Plus, User } from "lucide-react";
import { Dialog } from "../../../components/crud";
import ClientForm from "../../clients/client-form";
import * as clientsService from "../../clients/clients.service.js";
import { customerName, normalize } from "./format.js";

export default function CustomerPicker(props) {
  const { customer, onSelect } = props;

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (!open) return;
    clientsService.list().then((res) => setClients(res.data));
  }, [open]);

  const closePicker = () => {
    setOpen(false);
    setCreating(false);
    setQuery("");
  };

  const choose = (person) => {
    onSelect(person);
    closePicker();
  };

  const term = normalize(query.trim());
  const filtered = clients.filter((c) =>
    normalize(`${customerName(c)} ${c.num_doc}`).includes(term),
  );

  return (
    <>
      <button type="button" className="tpv-customer" onClick={() => setOpen(true)}>
        <User size={20} aria-hidden="true" />
        <span className="tpv-customer-text">
          <span className="tpv-customer-label">Cliente</span>
          <span className="tpv-customer-name">{customerName(customer)}</span>
        </span>
        <ChevronRight size={20} aria-hidden="true" />
      </button>

      <Dialog
        abierto={open}
        titulo={creating ? "Nuevo cliente" : "Seleccionar cliente"}
        alCerrar={closePicker}
      >
        {creating ? (
          <ClientForm
            onSaved={choose}
            onCancel={() => setCreating(false)}
          />
        ) : (
          <>
            <div className="form-field">
              <label htmlFor="buscar-cliente" className="form-label">
                Buscar por nombre o documento
              </label>
              <input
                id="buscar-cliente"
                type="search"
                className="form-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                data-autofocus
              />
            </div>

            <ul className="tpv-picker-list">
              <li>
                <button type="button" className="tpv-picker-option" onClick={() => choose(null)}>
                  <span className="tpv-picker-name">Público general</span>
                  <span className="tpv-picker-doc">Sin datos del cliente</span>
                </button>
              </li>

              {filtered.map((person) => (
                <li key={person.id}>
                  <button type="button" className="tpv-picker-option" onClick={() => choose(person)}>
                    <span className="tpv-picker-name">{customerName(person)}</span>
                    <span className="tpv-picker-doc">{person.tipo_doc} {person.num_doc}</span>
                  </button>
                </li>
              ))}
            </ul>

            {term && filtered.length === 0 && (
              <p role="status">No hay clientes con ese nombre o documento.</p>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={() => setCreating(true)}
            >
              <Plus size={20} aria-hidden="true" /> Nuevo cliente
            </button>
          </>
        )}
      </Dialog>
    </>
  );
}