import { useState } from "react";
import { QrCode } from "lucide-react";
import { Alert } from "../../../components/crud";

export default function ScanStep(props) {
  const { count, notice, onScan, onContinue } = props;
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onScan(code);
    setCode("");
  };

  return (
    <div className="tpv-narrow tpv-stack">
      <div className="scan-frame">
        <QrCode size={96} />
        <p>Apunta la cámara al código del producto.</p>
      </div>

      {notice && <Alert type={notice.type}>{notice.text}</Alert>}

      <form className="scan-manual" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="codigo-manual" className="form-label">
            ¿Prefieres escribir el código?
          </label>
          <input
            id="codigo-manual"
            className="form-input"
            inputMode="numeric"
            placeholder="Ejemplo: 00000001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-secondary">Agregar</button>
      </form>

      <button type="button" className="btn btn-primary btn-block" onClick={onContinue}>
        Ver venta ({count} {count === 1 ? "producto" : "productos"})
      </button>
    </div>
  );
}