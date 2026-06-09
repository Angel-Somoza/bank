import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const WithdrawalSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  const [hoveredButton, setHoveredButton] = useState(null);

  const selectedAmount = location.state?.amount || 0;

  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const cuenta = JSON.parse(localStorage.getItem("cuentaSeleccionada")) || {};

  const saldoAnterior = Number(cuenta.saldo || 0);
  const saldoActual = saldoAnterior - selectedAmount;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const glassStyle = {
    background: "rgba(23, 31, 51, 0.65)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(142, 144, 153, 0.1)",
  };

  const generarComprobantePDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString("es-GT");

    doc.setFillColor(11, 19, 38);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(23, 31, 51);
    doc.roundedRect(15, 15, 180, 260, 8, 8, "F");

    doc.setTextColor(74, 225, 118);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SECUREBANK", 105, 35, { align: "center" });

    doc.setTextColor(218, 226, 253);
    doc.setFontSize(18);
    doc.text("Comprobante de Retiro", 105, 50, { align: "center" });

    doc.setDrawColor(74, 225, 118);
    doc.line(30, 60, 180, 60);

    doc.setFontSize(12);
    doc.setTextColor(196, 198, 207);

    const datos = [
      ["Cliente", `${usuario.nombre || ""} ${usuario.apellido || ""}`],
      ["Tipo de cuenta", cuenta.tipo_cuenta || "N/A"],
      ["Número de cuenta", cuenta.numero_cuenta || "N/A"],
      ["Monto retirado", formatCurrency(selectedAmount)],
      ["Fecha", fecha],
      ["Estado", "Exitosa"],
    ];

    let y = 78;
    datos.forEach(([label, value]) => {
      doc.setTextColor(196, 198, 207);
      doc.setFont("helvetica", "bold");
      doc.text(label + ":", 30, y);
      doc.setTextColor(218, 226, 253);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 90, y);
      y += 14;
    });

    doc.setDrawColor(74, 225, 118);
    doc.line(30, y + 5, 180, y + 5);
    doc.setFontSize(10);
    doc.setTextColor(196, 198, 207);
    doc.text("Gracias por utilizar nuestros servicios.", 105, y + 25, { align: "center" });
    doc.text("Este comprobante fue generado electrónicamente.", 105, y + 35, { align: "center" });
    doc.save(`comprobante-retiro-${Date.now()}.pdf`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1326",
        color: "#dae2fd",
        fontFamily: "Inter, sans-serif",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Blobs decorativos */}
      <div style={{ position: "fixed", top: "15%", left: "-120px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(74,225,118,0.08)", filter: "blur(120px)", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-120px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(177,199,242,0.08)", filter: "blur(120px)", zIndex: 0 }} />

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", height: "60px", background: "rgba(23,31,51,0.8)", backdropFilter: "blur(40px)", borderBottom: "1px solid rgba(68,71,78,0.2)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, animation: "fadeInDown 0.8s ease-out forwards" }}>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#b1c7f2" }}> ✦ SECUREBANK | ATM</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#c4c6cf" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>wifi</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>schedule</span>
            <span style={{ fontSize: "14px" }}>{formatTime(time)}</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", paddingTop: "80px", paddingBottom: "100px", paddingLeft: "16px", paddingRight: "16px", position: "relative", zIndex: 2 }}>
        <div style={{ width: "100%", maxWidth: "450px", ...glassStyle, borderRadius: "20px", padding: "24px", boxShadow: "0 0 26px rgba(74,225,118,0.08)" }}>
          
          {/* Icono check */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#4ae176", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(74,225,118,0.25)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#0b1326", fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
          </div>

          {/* Título */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#4ae176", marginBottom: "4px" }}>Retiro Exitoso</h1>
            <p style={{ fontSize: "13px", color: "#c4c6cf" }}>Su transacción ha sido procesada correctamente.</p>
          </div>

          {/* Detalles */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {[
              { label: "Usuario", value: `${usuario.nombre || ""} ${usuario.apellido || ""}`, color: "#dae2fd" },
              { label: "Cuenta", value: cuenta.tipo_cuenta, color: "#dae2fd" },
              { label: "Número", value: cuenta.numero_cuenta, color: "#dae2fd" },
              { label: "Retirado", value: formatCurrency(selectedAmount), color: "#dae2fd" },
              { label: "Saldo Actual", value: formatCurrency(saldoActual), color: "#4ae176" },
            ].map((item, index) => (
              <div key={index} style={{ background: item.label === "Saldo Actual" ? "rgba(74,225,118,0.08)" : "rgba(34,42,61,0.75)", border: item.label === "Saldo Actual" ? "1px solid rgba(74,225,118,0.25)" : "1px solid rgba(142,144,153,0.12)", borderRadius: "12px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#c4c6cf" }}>{item.label}</span>
                <span style={{ fontSize: "14px", fontWeight: "800", color: item.color, textAlign: "right", wordBreak: "break-word" }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "8px" }}>
            <button onClick={generarComprobantePDF} onMouseEnter={() => setHoveredButton("print")} onMouseLeave={() => setHoveredButton(null)}
              style={{ width: "100%", minHeight: "48px", border: "none", borderRadius: "12px", padding: "0 14px", background: hoveredButton === "print" ? "#64ff8a" : "#4ae176", color: "#0b1326", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "0.3s", fontWeight: "800", fontSize: "13px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>print</span>
                <span>Imprimir Recibo</span>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
            </button>

            <button onClick={() => navigate("/main")} onMouseEnter={() => setHoveredButton("finish")} onMouseLeave={() => setHoveredButton(null)}
              style={{ width: "100%", minHeight: "48px", borderRadius: "12px", padding: "0 14px", background: hoveredButton === "finish" ? "#4ae176" : "rgba(34,42,61,0.8)", color: hoveredButton === "finish" ? "#0b1326" : "#4ae176", border: "1px solid rgba(74,225,118,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "0.3s", fontWeight: "800", fontSize: "13px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>home</span>
                <span>Menú Principal</span>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawalSuccess;