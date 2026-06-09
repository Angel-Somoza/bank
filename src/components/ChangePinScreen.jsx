import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const ChangePinScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [time, setTime] = useState(new Date());
  
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [currentField, setCurrentField] = useState("actual");
  
  const actualInputRef = useRef(null);
  const nuevaInputRef = useRef(null);
  const confirmarInputRef = useRef(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const focusField = (fieldId) => {
    setCurrentField(fieldId);
    if (fieldId === "actual") actualInputRef.current?.focus();
    if (fieldId === "nueva") nuevaInputRef.current?.focus();
    if (fieldId === "confirmar") confirmarInputRef.current?.focus();
  };

  const handlePinChange = (fieldId, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    
    if (fieldId === "actual") {
      setCurrentPin(numericValue.slice(0, 4));
      if (numericValue.length >= 4) focusField("nueva");
    } else if (fieldId === "nueva") {
      setNewPin(numericValue.slice(0, 4));
      if (numericValue.length >= 4) focusField("confirmar");
    } else if (fieldId === "confirmar") {
      setConfirmPin(numericValue.slice(0, 4));
    }
  };

  const getPinDisplay = (pin, index) => index < pin.length;

  const handleSubmit = async () => {
    if (currentPin.length !== 4) {
      alert("Ingrese su clave actual");
      focusField("actual");
      return;
    }
    if (newPin.length !== 4) {
      alert("Ingrese una nueva clave");
      focusField("nueva");
      return;
    }
    if (confirmPin.length !== 4) {
      alert("Confirme su nueva clave");
      focusField("confirmar");
      return;
    }
    if (newPin !== confirmPin) {
      alert("La nueva clave y la confirmación no coinciden");
      setNewPin("");
      setConfirmPin("");
      focusField("nueva");
      return;
    }
    if (currentPin === newPin) {
      alert("La nueva clave debe ser diferente a la actual");
      setNewPin("");
      setConfirmPin("");
      focusField("nueva");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://cajero-online.onrender.com/api/cajero/cambiar-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          pin_actual: currentPin,
          pin_nuevo: newPin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al cambiar la clave");
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
        focusField("actual");
        setLoading(false);
        return;
      }

      alert("Clave cambiada correctamente");
      navigate("/main");
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: "#0b1326", minHeight: "100vh", color: "#dae2fd", fontFamily: "Inter, sans-serif", position: "relative" }}>
      <style>{`
        @keyframes fadeInDown { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(20px, 30px) scale(1.1); } }
      `}</style>

      {/* Blobs */}
      <div style={{ position: "fixed", top: "15%", left: "-120px", width: "420px", height: "420px", borderRadius: "50%", background: "rgba(74,225,118,0.12)", filter: "blur(120px)", animation: "float 8s ease-in-out infinite alternate", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-120px", width: "420px", height: "420px", borderRadius: "50%", background: "rgba(177,199,242,0.12)", filter: "blur(120px)", animation: "float 10s ease-in-out infinite alternate", animationDelay: "-5s", zIndex: 0 }} />

      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          height: '80px',
          background: 'rgba(23, 31, 51, 0.8)',
          backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(68, 71, 78, 0.2)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          animation: 'fadeInDown 0.8s ease-out forwards',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#b1c7f2' }}>
             ✦ SECUREBANK | ATM
          </span>
        </div>
      </header>
      {/* Main */}
      <main style={{ paddingTop: "100px", paddingBottom: "120px", paddingLeft: "20px", paddingRight: "20px", maxWidth: "500px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px", animation: "fadeInUp 0.8s ease-out forwards", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(177,199,242,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#b1c7f2" }}>encrypted</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "6px" }}>Cambio de Clave</h1>
          <p style={{ color: "#c4c6cf", fontSize: "14px" }}>Elige una clave de 4 dígitos segura</p>
        </div>

        {/* Formulario compacto */}
        <div style={{ background: "rgba(23,31,51,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(142,144,153,0.1)", borderRadius: "20px", padding: "24px" }}>
          
          {/* Clave Actual */}
          <div style={{ marginBottom: "24px", cursor: "pointer" }} onClick={() => focusField("actual")}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4ae176", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
              Clave Actual
              <span style={{ fontSize: "10px", color: "#4ae176", opacity: currentField === "actual" ? 1 : 0 }}>Seleccionado</span>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(6,14,32,0.4)", border: currentField === "actual" ? "2px solid #4ae176" : "2px solid rgba(142,144,153,0.2)", borderRadius: "14px", padding: "16px 20px", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", background: getPinDisplay(currentPin, i) ? "#4ae176" : "#44474e", boxShadow: getPinDisplay(currentPin, i) ? "0 0 8px rgba(74,225,118,0.5)" : "none", transition: "all 0.2s ease" }} />
                ))}
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: currentPin.length === 4 ? "#4ae176" : "#c4c6cf" }}>
                {currentPin.length === 4 ? "lock_open" : "lock"}
              </span>
            </div>
            <input ref={actualInputRef} type="password" inputMode="numeric" maxLength={4} value={currentPin} onChange={(e) => handlePinChange("actual", e.target.value)} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }} />
          </div>

          {/* Nueva Clave */}
          <div style={{ marginBottom: "24px", cursor: "pointer" }} onClick={() => focusField("nueva")}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4ae176", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
              Nueva Clave
              <span style={{ fontSize: "10px", color: "#4ae176", opacity: currentField === "nueva" ? 1 : 0 }}>Seleccionado</span>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(6,14,32,0.4)", border: currentField === "nueva" ? "2px solid #4ae176" : "2px solid rgba(142,144,153,0.2)", borderRadius: "14px", padding: "16px 20px", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", background: getPinDisplay(newPin, i) ? "#4ae176" : "#44474e", boxShadow: getPinDisplay(newPin, i) ? "0 0 8px rgba(74,225,118,0.5)" : "none" }} />
                ))}
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: newPin.length === 4 ? "#4ae176" : "#c4c6cf" }}>
                {newPin.length === 4 ? "lock_open" : "lock"}
              </span>
            </div>
            <input ref={nuevaInputRef} type="password" inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => handlePinChange("nueva", e.target.value)} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }} />
          </div>

          {/* Confirmar Clave */}
          <div style={{ marginBottom: "24px", cursor: "pointer" }} onClick={() => focusField("confirmar")}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4ae176", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
              Confirmar Clave
              <span style={{ fontSize: "10px", color: "#4ae176", opacity: currentField === "confirmar" ? 1 : 0 }}>Seleccionado</span>
            </label>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(6,14,32,0.4)", border: currentField === "confirmar" ? "2px solid #4ae176" : "2px solid rgba(142,144,153,0.2)", borderRadius: "14px", padding: "16px 20px", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ width: "14px", height: "14px", borderRadius: "50%", background: getPinDisplay(confirmPin, i) ? "#4ae176" : "#44474e", boxShadow: getPinDisplay(confirmPin, i) ? "0 0 8px rgba(74,225,118,0.5)" : "none" }} />
                ))}
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: "20px", color: confirmPin.length === 4 ? "#4ae176" : "#c4c6cf" }}>
                {confirmPin.length === 4 ? "lock_open" : "lock"}
              </span>
            </div>
            <input ref={confirmarInputRef} type="password" inputMode="numeric" maxLength={4} value={confirmPin} onChange={(e) => handlePinChange("confirmar", e.target.value)} style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }} />
          </div>

          {/* Botón */}
          <button onClick={handleSubmit} style={{ width: "100%", padding: "14px", background: "#4ae176", color: "#002109", fontSize: "18px", fontWeight: "800", borderRadius: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(0.98)"; e.currentTarget.style.background = "#5cf08a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#4ae176"; }}>
            Actualizar Clave
          </button>
        </div>

      </main>

       {/* Bottom Nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", paddingLeft: "40px", paddingRight: "40px", paddingTop: "20px", paddingBottom: "20px", background: "rgba(6,14,32,0.9)", backdropFilter: "blur(32px)", borderTop: "1px solid rgba(68,71,78,0.3)", boxShadow: "0px -10px 30px rgba(0,0,0,0.4)", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", zIndex: 50 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#c4c6cf", paddingLeft: "48px", paddingRight: "48px", paddingTop: "12px", paddingBottom: "12px", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.3s ease", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(177,199,242,0.1)"; e.currentTarget.style.color = "#b1c7f2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>arrow_back</span>
            <span>Regresar</span>
          </button>
          <div style={{ height: "32px", width: "1px", background: "rgba(68,71,78,0.3)" }} />
          <button onClick={() => navigate("/")} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#c4c6cf", paddingLeft: "48px", paddingRight: "48px", paddingTop: "12px", paddingBottom: "12px", background: "transparent", border: "none", cursor: "pointer", transition: "all 0.3s ease", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,180,171,0.1)"; e.currentTarget.style.color = "#ffb4ab"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}>
            <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>logout</span>
            <span>Salir</span>
          </button>
        </nav>

      {/* Toast */}
      <div style={{ position: "fixed", top: "90px", left: "50%", transform: showToast ? "translate(-50%,0)" : "translate(-50%,-40px)", opacity: showToast ? 1 : 0, transition: "all 0.5s ease", background: "rgba(23,31,51,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(74,225,118,0.3)", borderRadius: "999px", padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", zIndex: 100 }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#4ae176" }}>info</span>
        <span style={{ fontSize: "12px" }}>Complete los campos para cambiar su clave</span>
      </div>
    </div>
  );
};

export default ChangePinScreen;