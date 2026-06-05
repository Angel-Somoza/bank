import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const TransferScreen = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [selectedSource, setSelectedSource] = useState(null);

  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");

  const [time, setTime] = useState(new Date());

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [cuentaDestino, setCuentaDestino] = useState(() => {
    const saved = localStorage.getItem("cuentaDestino");
    return saved ? JSON.parse(saved) : null;
  });

  // =========================================
  // OBTENER CUENTAS
  // =========================================

  useEffect(() => {
    const obtenerCuentas = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!usuario || !token) {
          alert("Sesión no encontrada");
          navigate("/");
          return;
        }

        const response = await fetch(
          "https://cajero-online.onrender.com/api/cajero/cuentas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              idCliente: usuario.id_cliente,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Error obteniendo cuentas");
          return;
        }

        setAccounts(data.cuentas);

        if (data.cuentas.length > 0 && !selectedSource) {
          setSelectedSource(data.cuentas[0].id_cuenta);
        }
      } catch (error) {
        console.error(error);
        alert("Error conectando al servidor");
      } finally {
        setLoadingAccounts(false);
      }
    };

    obtenerCuentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escuchar cambios en localStorage cuando se selecciona una cuenta destino
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("cuentaDestino");
      setCuentaDestino(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // =========================================
  // TOAST
  // =========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // =========================================
  // RELOJ
  // =========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // TRANSFERENCIA
  // =========================================

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Ingrese un monto válido");
      return;
    }

    if (!selectedSource) {
      alert("Seleccione una cuenta de origen");
      return;
    }

    if (!cuentaDestino) {
      alert("Seleccione una cuenta destino");
      navigate("/destination-selection");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sesión no encontrada");
        navigate("/");
        return;
      }

      const montoNumerico = parseFloat(amount);
      
      // Obtener el ID de la cuenta destino (puede venir como id_cuenta o id_cuenta_destino)
      const idDestino = cuentaDestino.id_cuenta || cuentaDestino.id_cuenta_destino;
      const idOrigen = Number(selectedSource);
      
      console.log("Enviando transferencia:", {
        id_usuario: usuario.id_usuario,
        id_cuenta_origen: idOrigen,
        id_cuenta_destino: idDestino,
        monto: montoNumerico,
      });

      const response = await fetch(
        "https://cajero-online.onrender.com/api/cajero/transferencia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            id_cuenta_origen: idOrigen,
            id_cuenta_destino: idDestino,
            monto: montoNumerico,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error realizando transferencia");
        setLoading(false);
        return;
      }

      alert("Transferencia realizada correctamente");

      // Limpiar cuenta destino después de la transferencia
      localStorage.removeItem("cuentaDestino");
      setCuentaDestino(null);

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading || loadingAccounts) {
    return <LoadingScreen />;
  }

  // =========================================
  // UI
  // =========================================

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
      {/* ANIMACIONES */}
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
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

      {/* HEADER */}
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
              SECUREBANK
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
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TITULO */}
        <div
          style={{
            marginBottom: "40px",
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
            Transferencia de Fondos
          </h1>

          <p
            style={{
              color: "#c4c6cf",
              fontSize: "20px",
            }}
          >
            Complete los detalles para realizar su operación segura.
          </p>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
          }}
        >
          {/* COLUMNA IZQUIERDA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* CUENTAS ORIGEN */}
            <div
              style={{
                background: "rgba(23,31,51,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(142,144,153,0.15)",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  color: "#4ae176",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Cuenta de Origen
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {accounts.map((account, index) => {
                  const isSelected =
                    selectedSource === account.id_cuenta;

                  const isMonetaria =
                    account.tipo_cuenta === "Monetaria";

                  const icon = isMonetaria
                    ? "account_balance_wallet"
                    : "savings";
                  
                  const delay = 0.1 + index * 0.1;

                  return (
                    <button
                      key={account.id_cuenta}
                      type="button"
                      onClick={() => {
                        setSelectedSource(account.id_cuenta);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        padding: "20px",
                        borderRadius: "20px",
                        border: isSelected
                          ? "2px solid #4ae176"
                          : "1px solid rgba(142,144,153,0.2)",
                        background: isSelected
                          ? "rgba(74,225,118,0.1)"
                          : "rgba(34,42,61,0.5)",
                        cursor: "pointer",
                        transition: "all 0.35s ease",
                        textAlign: "left",
                        animation: `staggerIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                        animationDelay: `${delay}s`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background =
                            "rgba(34,42,61,0.8)";
                          e.currentTarget.style.transform =
                            "translateY(-4px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background =
                            "rgba(34,42,61,0.5)";
                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            color: "#b1c7f2",
                            fontSize: "28px",
                          }}
                        >
                          {icon}
                        </span>

                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: "2px solid #8e9099",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#4ae176",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        {account.tipo_cuenta}
                      </h3>

                      <p
                        style={{
                          color: "#c4c6cf",
                          fontSize: "14px",
                        }}
                      >
                        **** {account.numero_cuenta?.slice(-4)}
                      </p>

                      <p
                        style={{
                          color: "#4ae176",
                          fontSize: "24px",
                          fontWeight: "800",
                        }}
                      >
                        Q{" "}
                        {Number(account.saldo).toLocaleString(
                          "es-GT",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CUENTA DESTINO - Botón para seleccionar */}
            <div
              style={{
                background: "rgba(23,31,51,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(142,144,153,0.15)",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  color: "#4ae176",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                Cuenta Destino
              </h2>

              {cuentaDestino ? (
                // Mostrar cuenta destino seleccionada
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(34,42,61,0.5)",
                    border: "1px solid rgba(74,225,118,0.3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(74,225,118,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "#4ae176" }}
                      >
                        account_circle
                      </span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#dae2fd",
                        }}
                      >
                        {cuentaDestino.alias || cuentaDestino.nombre_titular}
                      </p>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#4ae176",
                          fontFamily: "monospace",
                        }}
                      >
                        {cuentaDestino.numero_cuenta}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/destination-selection")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      background: "rgba(74,225,118,0.2)",
                      border: "none",
                      color: "#4ae176",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(74,225,118,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(74,225,118,0.2)";
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              ) : (
                // Botón para seleccionar cuenta destino
                <button
                  onClick={() => navigate("/destination-selection")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "20px",
                    borderRadius: "16px",
                    background: "rgba(34,42,61,0.5)",
                    border: "2px dashed rgba(74,225,118,0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(34,42,61,0.8)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(34,42,61,0.5)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#4ae176", fontSize: "28px" }}
                  >
                    add_circle
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#4ae176",
                    }}
                  >
                    Seleccionar Cuenta Destino
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* MONTO */}
            <div
              style={{
                background: "rgba(23,31,51,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(142,144,153,0.15)",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  color: "#4ae176",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                Monto a Transferir
              </h2>

              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#c4c6cf",
                  }}
                >
                  Q
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: "100%",
                    padding: "24px 20px 24px 48px",
                    borderRadius: "20px",
                    border: "none",
                    background: "rgba(6,14,32,0.5)",
                    color: "#dae2fd",
                    fontSize: "32px",
                    fontWeight: "700",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 2px #4ae176")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                />
              </div>
            </div>

            {/* CONCEPTO */}
            <div
              style={{
                background: "rgba(23,31,51,0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(142,144,153,0.15)",
                borderRadius: "24px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                  color: "#4ae176",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                }}
              >
                Comentario o Concepto
              </h2>

              <div style={{ position: "relative" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#c4c6cf",
                  }}
                >
                  notes
                </span>
                <input
                  type="text"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Motivo de la transferencia (opcional)"
                  style={{
                    width: "100%",
                    padding: "16px 20px 16px 48px",
                    borderRadius: "16px",
                    border: "none",
                    background: "rgba(6,14,32,0.5)",
                    color: "#dae2fd",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 2px #4ae176")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                />
              </div>
            </div>

            {/* INFO TOAST */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                background: "rgba(177,199,242,0.1)",
                border: "1px solid rgba(177,199,242,0.2)",
                borderRadius: "16px",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#b1c7f2" }}
              >
                info
              </span>
              <p style={{ fontSize: "14px", color: "#b1c7f2" }}>
                Las transferencias a terceros se acreditan de forma
                inmediata.
              </p>
            </div>

            {/* BOTON CONTINUAR */}
            <button
              onClick={handleTransfer}
              disabled={!cuentaDestino}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "24px",
                background: cuentaDestino ? "#4ae176" : "rgba(74,225,118,0.3)",
                color: cuentaDestino ? "#002109" : "#c4c6cf",
                fontSize: "20px",
                fontWeight: "800",
                border: "none",
                cursor: cuentaDestino ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                boxShadow: cuentaDestino ? "0 10px 30px rgba(74,225,118,0.3)" : "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (cuentaDestino) {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.background = "#5cf08a";
                }
              }}
              onMouseLeave={(e) => {
                if (cuentaDestino) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = "#4ae176";
                }
              }}
            >
              Continuar
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          left: "50%",
          transform: showToast
            ? "translate(-50%,0)"
            : "translate(-50%,-40px)",
          opacity: showToast ? 1 : 0,
          transition: "all 0.5s ease",
          background: "rgba(23,31,51,0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74,225,118,0.3)",
          borderRadius: "999px",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 100,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: "#4ae176" }}
        >
          info
        </span>
        Complete los datos para realizar la transferencia
      </div>

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

export default TransferScreen;