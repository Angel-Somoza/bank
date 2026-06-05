import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const DestinationSelectionScreen = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [myAccounts, setMyAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [deletingId, setDeletingId] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Obtener mis cuentas destino desde el backend
  const obtenerMisCuentasDestino = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!usuario || !token) {
        alert("Sesión no encontrada");
        navigate("/");
        return;
      }

      const response = await fetch(`https://cajero-online.onrender.com/api/cajero/mis-cuentas-destino/${usuario.id_usuario}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error obteniendo cuentas destino");
        return;
      }

      setMyAccounts(data.cuentas || []);
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMisCuentasDestino();
  }, [navigate, usuario]);

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

  // Función para obtener iniciales del nombre
  const getInitials = (nombre) => {
    if (!nombre) return "??";
    const partes = nombre.split(" ");
    if (partes.length >= 2) {
      return `${partes[0].charAt(0)}${partes[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const seleccionarCuenta = (account) => {
    localStorage.setItem("cuentaDestino", JSON.stringify({
      id_cuenta_destino: account.id_cuenta_destino,
      numero_cuenta: account.numero_cuenta,
      nombre_titular: account.nombre_titular,
      alias: account.alias
    }));
    navigate("/transfer");
  };

  // Eliminar cuenta destino
  const eliminarCuenta = async (idCuentaDestino, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}" de tu lista de cuentas destino?`)) {
      return;
    }

    setDeletingId(idCuentaDestino);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`https://cajero-online.onrender.com/api/cajero/eliminar-cuenta-destino/${idCuentaDestino}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error al eliminar cuenta");
        setDeletingId(null);
        return;
      }

      alert("Cuenta eliminada correctamente");
      // Recargar la lista
      await obtenerMisCuentasDestino();
    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setDeletingId(null);
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          height: "80px",
          background: "rgba(23,31,51,0.8)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid rgba(68,71,78,0.2)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          animation: "fadeInDown 0.8s ease-out forwards",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#b1c7f2",
          }}
        >
          SECUREBANK
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "#c4c6cf",
          }}
        >
          <span className="material-symbols-outlined">wifi</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="material-symbols-outlined">schedule</span>
            <span>{formatTime(time)}</span>
          </div>
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
        {/* HEADER SECTION */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            animation: "fadeInUp 0.8s ease-out forwards",
            opacity: 0,
            animationFillMode: "forwards",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "800",
                marginBottom: "10px",
              }}
            >
              Seleccionar Cuenta Destino
            </h1>
            <p
              style={{
                color: "#c4c6cf",
                fontSize: "20px",
              }}
            >
              Elige una cuenta de tus favoritos o agrega una nueva para continuar.
            </p>
          </div>

          {/* Conexión Segura Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              background: "rgba(23,31,51,0.6)",
              backdropFilter: "blur(20px)",
              borderRadius: "999px",
              border: "1px solid rgba(74,225,118,0.2)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#4ae176", fontSize: "16px" }}
            >
              security
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#4ae176",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              CONEXIÓN SEGURA
            </span>
          </div>
        </div>

        {/* GRID 2 COLUMNAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "stretch",
          }}
        >
          {/* AGREGAR NUEVA CUENTA */}
          <button
            onClick={() => navigate("/add-destination")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px",
              borderRadius: "24px",
              border: "2px dashed rgba(74,225,118,0.4)",
              background: "rgba(74,225,118,0.05)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              minHeight: "400px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(74,225,118,0.1)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(74,225,118,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#4ae176",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                transition: "transform 0.3s ease",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "40px",
                  color: "#002109",
                }}
              >
                person_add
              </span>
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#4ae176",
                marginBottom: "12px",
              }}
            >
              Agregar Nueva Cuenta
            </span>
            <p
              style={{
                fontSize: "16px",
                color: "#c4c6cf",
                textAlign: "center",
                maxWidth: "280px",
              }}
            >
              Transfiere a un nuevo destinatario por número de cuenta
            </p>
          </button>

          {/* LISTA DE CUENTAS FAVORITAS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {myAccounts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  background: "rgba(23,31,51,0.6)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p style={{ color: "#c4c6cf" }}>No tienes cuentas destino agregadas</p>
                <p style={{ fontSize: "14px", color: "#c4c6cf", marginTop: "8px" }}>
                  Contacta al administrador
                </p>
              </div>
            ) : (
              myAccounts.map((account, index) => (
                <div
                  key={account.id_cuenta_destino}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => seleccionarCuenta(account)}
                    style={{
                      flex: 1,
                      textAlign: "left",
                      padding: "24px",
                      borderRadius: "24px",
                      background: "rgba(23,31,51,0.6)",
                      backdropFilter: "blur(20px)",
                      border: index === 0 ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(255,255,255,0.05)",
                      borderLeft: index === 0 ? "4px solid #4ae176" : "4px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: "24px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(45,52,73,0.4)";
                      e.currentTarget.style.transform = "scale(0.98)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(23,31,51,0.6)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "rgba(45,52,73,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#b1c7f2",
                        fontWeight: "bold",
                        fontSize: "24px",
                      }}
                    >
                      {getInitials(account.alias || account.nombre_titular)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#dae2fd",
                          }}
                        >
                          {account.alias || account.nombre_titular}
                        </span>
                        {index === 0 && (
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#4ae176", fontSize: "16px" }}
                          >
                            star
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#c4c6cf",
                          }}
                        >
                          SecureBank
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontFamily: "monospace",
                            color: "#b1c7f2",
                            letterSpacing: "0.05em",
                            marginTop: "4px",
                          }}
                        >
                          •••• {account.numero_cuenta.slice(-4)}
                        </span>
                      </div>
                    </div>
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#8e9099", transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(8px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      chevron_right
                    </span>
                  </button>
                  <button
                    onClick={() => eliminarCuenta(account.id_cuenta_destino, account.alias || account.nombre_titular)}
                    disabled={deletingId === account.id_cuenta_destino}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "rgba(255,180,171,0.1)",
                      border: "1px solid rgba(255,180,171,0.3)",
                      cursor: deletingId === account.id_cuenta_destino ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== account.id_cuenta_destino) {
                        e.currentTarget.style.background = "rgba(255,180,171,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,180,171,0.1)";
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: "#ffb4ab", fontSize: "24px" }}
                    >
                      {deletingId === account.id_cuenta_destino ? "progress_activity" : "delete"}
                    </span>
                  </button>
                </div>
              ))
            )}
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
        Seleccione una cuenta destino para continuar
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          paddingLeft: "40px",
          paddingRight: "40px",
          paddingTop: "20px",
          paddingBottom: "20px",
          background: "rgba(6,14,32,0.9)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(68,71,78,0.3)",
          boxShadow: "0px -10px 30px rgba(0,0,0,0.4)",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          zIndex: 50,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#c4c6cf",
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingTop: "12px",
            paddingBottom: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(177,199,242,0.1)";
            e.currentTarget.style.color = "#b1c7f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#c4c6cf";
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "32px", marginBottom: "4px" }}
          >
            cancel
          </span>
          <span>Cancelar</span>
        </button>

        <div
          style={{
            height: "32px",
            width: "1px",
            background: "rgba(68,71,78,0.3)",
          }}
        />

        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#c4c6cf",
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingTop: "12px",
            paddingBottom: "12px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,180,171,0.1)";
            e.currentTarget.style.color = "#ffb4ab";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#c4c6cf";
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "32px", marginBottom: "4px" }}
          >
            logout
          </span>
          <span>Salir</span>
        </button>
      </nav>

      {/* VISUAL DECORATION (AMBIENT LIGHT) */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background: "rgba(74,225,118,0.05)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: -10,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default DestinationSelectionScreen;