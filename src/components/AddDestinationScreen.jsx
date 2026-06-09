import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const AddDestinationScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [time, setTime] = useState(new Date());

  const [alias, setAlias] = useState("");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("Ahorro");
  const [verifying, setVerifying] = useState(false);
  const [accountFound, setAccountFound] = useState(null);
  const [existingDestinations, setExistingDestinations] = useState([]);
  const [misCuentas, setMisCuentas] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Cargar mis cuentas destino existentes y mis cuentas propias
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        // Cargar cuentas destino existentes del usuario
        const destinosResponse = await fetch(`https://cajero-online.onrender.com/api/cajero/mis-cuentas-destino/${usuario.id_usuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const destinosData = await destinosResponse.json();
        if (destinosData.cuentas) {
          setExistingDestinations(destinosData.cuentas);
        }

        // Cargar mis propias cuentas (para no transferirme a mí mismo)
        const cuentasResponse = await fetch(`https://cajero-online.onrender.com/api/cajero/cuentas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ idCliente: usuario.id_cliente }),
        });
        const cuentasData = await cuentasResponse.json();
        if (cuentasData.cuentas) {
          setMisCuentas(cuentasData.cuentas);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [usuario]);

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

  // Verificar si la cuenta es propia (del mismo usuario)
  const esCuentaPropia = (numeroCuenta) => {
    return misCuentas.some(cuenta => cuenta.numero_cuenta === numeroCuenta);
  };

  // Verificar si la cuenta ya existe en la lista de destinos
  const yaExisteEnDestinos = (numeroCuenta) => {
    return existingDestinations.some(destino => destino.numero_cuenta === numeroCuenta);
  };

  const verificarCuenta = async () => {
    if (!numeroCuenta || numeroCuenta.length < 8) {
      alert("Ingrese un número de cuenta válido");
      return;
    }

    setVerifying(true);
    setAccountFound(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`https://cajero-online.onrender.com/api/cajero/buscar-cuenta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          numero_cuenta: numeroCuenta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Cuenta no encontrada");
        return;
      }

      // Validar que no sea mi propia cuenta
      if (esCuentaPropia(numeroCuenta)) {
        alert("No puedes agregar tu propia cuenta como destino");
        setVerifying(false);
        return;
      }

      // Validar que no exista ya en mi lista de destinos
      if (yaExisteEnDestinos(numeroCuenta)) {
        alert("Esta cuenta ya está en tu lista de destinos");
        setVerifying(false);
        return;
      }

      const tipoCuentaDetectado = data.cuenta.id_tipo_cuenta === 1 ? "Ahorro" : "Monetaria";
      
      setAccountFound(data.cuenta);
      setNombreTitular(data.cuenta.nombre_titular);
      setTipoCuenta(tipoCuentaDetectado);
      
      alert(`Cuenta encontrada: ${data.cuenta.nombre_titular}`);
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!alias) {
      alert("Ingrese un alias para la cuenta");
      return;
    }

    if (!numeroCuenta) {
      alert("Ingrese el número de cuenta");
      return;
    }

    if (!nombreTitular && !accountFound) {
      alert("Verifique la cuenta primero");
      return;
    }

    // Validar nuevamente antes de guardar
    if (esCuentaPropia(numeroCuenta)) {
      alert("No puedes agregar tu propia cuenta como destino");
      return;
    }

    if (yaExisteEnDestinos(numeroCuenta)) {
      alert("Esta cuenta ya está en tu lista de destinos");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`https://cajero-online.onrender.com/api/cajero/agregar-cuenta-destino`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          numero_cuenta: numeroCuenta,
          alias: alias,
          nombre_titular: nombreTitular || accountFound?.nombre_titular,
          tipo_cuenta: tipoCuenta,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al agregar cuenta");
        setLoading(false);
        return;
      }

      alert("Cuenta destino agregada correctamente");
      navigate("/destination-selection");
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{
        background: "#0b1326",
        minHeight: "100vh",
        color: "#dae2fd",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, 30px) scale(1.1); }
        }
      `}</style>

      {/* BLOBS DECORATIVOS */}
      <div
        style={{
          position: "fixed",
          top: "15%",
          left: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(74,225,118,0.12)",
          filter: "blur(120px)",
          animation: "float 8s ease-in-out infinite alternate",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(177,199,242,0.12)",
          filter: "blur(120px)",
          animation: "float 10s ease-in-out infinite alternate",
          animationDelay: "-5s",
          zIndex: 0,
        }}
      />

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

      {/* MAIN */}
      <main
        style={{
          paddingTop: "120px",
          paddingBottom: "180px",
          paddingLeft: "40px",
          paddingRight: "40px",
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            marginBottom: "40px",
            textAlign: "center",
            animation: "fadeInUp 0.8s ease-out forwards",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            Agregar Nueva Cuenta
          </h1>
          <p
            style={{
              color: "#c4c6cf",
              fontSize: "20px",
            }}
          >
            Complete los datos para vincular un nuevo destinatario
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "rgba(23,31,51,0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(142,144,153,0.1)",
            borderRadius: "24px",
            padding: "48px",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "32px",
              }}
            >
              {/* Alias */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "#4ae176",
                    marginLeft: "4px",
                  }}
                >
                  Alias
                </label>
                <div
                  style={{
                    height: "80px",
                    background: "rgba(34,42,61,0.2)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#c4c6cf", marginRight: "16px" }}
                  >
                    person
                  </span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Alias"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#dae2fd",
                    }}
                  />
                </div>
              </div>

              {/* Número de Cuenta */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "#4ae176",
                    marginLeft: "4px",
                  }}
                >
                  Número de Cuenta
                </label>
                <div
                  style={{
                    height: "80px",
                    background: "rgba(34,42,61,0.2)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                    gap: "12px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#c4c6cf", marginRight: "16px" }}
                  >
                    account_balance_wallet
                  </span>
                  <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => {
                      setNumeroCuenta(e.target.value);
                      setAccountFound(null);
                    }}
                    placeholder="Numero de cuenta"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      flex: 1,
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#dae2fd",
                    }}
                  />
                  <button
                    type="button"
                    onClick={verificarCuenta}
                    disabled={verifying}
                    style={{
                      padding: "8px 20px",
                      borderRadius: "12px",
                      background: verifying ? "#4ae17650" : "#4ae176",
                      color: "#002109",
                      border: "none",
                      cursor: verifying ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {verifying ? "Verificando..." : "Verificar"}
                  </button>
                </div>
                {accountFound && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 16px",
                      background: "rgba(74,225,118,0.1)",
                      borderRadius: "12px",
                      fontSize: "14px",
                      color: "#4ae176",
                    }}
                  >
                    Cuenta verificada: {accountFound.nombre_titular}
                  </div>
                )}
              </div>

              {/* Nombre del Titular */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "#4ae176",
                    marginLeft: "4px",
                  }}
                >
                  Nombre Completo
                </label>
                <div
                  style={{
                    height: "80px",
                    background: "rgba(34,42,61,0.2)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 24px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#c4c6cf", marginRight: "16px" }}
                  >
                    badge
                  </span>
                  <input
                    type="text"
                    value={nombreTitular}
                    onChange={(e) => setNombreTitular(e.target.value)}
                    placeholder="Nombre"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#dae2fd",
                    }}
                  />
                </div>
              </div>

              {/* Tipo de Cuenta */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <label
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    color: "#4ae176",
                    marginLeft: "4px",
                  }}
                >
                  Tipo de Cuenta
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    height: "80px",
                  }}
                >
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      borderRadius: "16px",
                      border: tipoCuenta === "Ahorro" ? "2px solid #4ae176" : "1px solid rgba(255,255,255,0.1)",
                      background: tipoCuenta === "Ahorro" ? "rgba(74,225,118,0.1)" : "rgba(34,42,61,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "default",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: tipoCuenta === "Ahorro" ? "#4ae176" : "#c4c6cf",
                      }}
                    >
                      savings
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: tipoCuenta === "Ahorro" ? "#4ae176" : "#c4c6cf",
                      }}
                    >
                      Ahorro
                    </span>
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      borderRadius: "16px",
                      border: tipoCuenta === "Monetaria" ? "2px solid #4ae176" : "1px solid rgba(255,255,255,0.1)",
                      background: tipoCuenta === "Monetaria" ? "rgba(74,225,118,0.1)" : "rgba(34,42,61,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "default",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: tipoCuenta === "Monetaria" ? "#4ae176" : "#c4c6cf",
                      }}
                    >
                      payments
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: tipoCuenta === "Monetaria" ? "#4ae176" : "#c4c6cf",
                      }}
                    >
                      Monetaria
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div
                style={{
                  gridColumn: "span 2",
                  marginTop: "16px",
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    minHeight: "80px",
                    background: "#4ae176",
                    color: "#002109",
                    fontSize: "22px",
                    fontWeight: "800",
                    borderRadius: "24px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(0.98)";
                    e.currentTarget.style.background = "#5cf08a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#4ae176";
                  }}
                >
                  Vincular Cuenta
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Safety Note */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "rgba(196,198,207,0.6)",
          }}
        />
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
    </div>
  );
};

export default AddDestinationScreen;