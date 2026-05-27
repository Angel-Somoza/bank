import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSelection = () => {
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // TOAST
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // =========================
  // OBTENER CUENTAS
  // =========================
  useEffect(() => {
    const obtenerCuentas = async () => {
      try {
        const usuario = JSON.parse(
          localStorage.getItem("usuario")
        );

        console.log("USUARIO:", usuario);

        if (!usuario) {
          alert("Sesión no encontrada");
          navigate("/");
          return;
        }

        const idCliente = usuario.id_cliente;

        console.log("ID CLIENTE:", idCliente);

        const response = await fetch(
          `http://localhost:3000/api/cajero/cuentas/${idCliente}`
        );

        const data = await response.json();

        console.log("RESPUESTA:", data);

        if (!response.ok) {
          alert(data.message || "Error obteniendo cuentas");
          return;
        }

        setAccounts(data.cuentas);

      } catch (error) {
        console.error(error);
        alert("Error conectando al servidor");
      } finally {
        setLoading(false);
      }
    };

    obtenerCuentas();
  }, [navigate]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b1326",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "32px",
          fontWeight: "bold",
        }}
      >
        Cargando cuentas...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1326",
        color: "#dae2fd",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "80px",
          background: "rgba(23,31,51,0.75)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(68,71,78,0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          zIndex: 50,
        }}
      >
        <div
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#b1c7f2",
            letterSpacing: "1px",
          }}
        >
          SECUREBANK
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "#4ae176", fontSize: "30px" }}
          >
            wifi
          </span>

          <span
            className="material-symbols-outlined"
            style={{ color: "#b1c7f2", fontSize: "30px" }}
          >
            schedule
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          paddingTop: "140px",
          paddingBottom: "120px",
          paddingLeft: "40px",
          paddingRight: "40px",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              marginBottom: "14px",
            }}
          >
            Selección de Cuenta
          </h1>

          <p
            style={{
              color: "#c4c6cf",
              fontSize: "22px",
            }}
          >
            Seleccione una cuenta para continuar.
          </p>
        </div>

        {/* SI NO HAY CUENTAS */}
        {accounts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#ffb4ab",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            No se encontraron cuentas
          </div>
        )}

        {/* CARDS */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          {accounts.map((account) => {
            const isHovered =
              hoveredCard === account.id_cuenta;

            return (
              <button
                key={account.id_cuenta}
                onClick={() => {
                  localStorage.setItem(
                    "cuentaSeleccionada",
                    JSON.stringify(account)
                  );

                  navigate("/withdrawal");
                }}
                onMouseEnter={() =>
                  setHoveredCard(account.id_cuenta)
                }
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  overflow: "hidden",

                  width: "340px",
                  height: "320px",

                  padding: "32px",
                  borderRadius: "32px",

                  border: isHovered
                    ? "1px solid rgba(74,225,118,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",

                  background: isHovered
                    ? "#4ae176"
                    : "rgba(23,31,51,0.6)",

                  backdropFilter: "blur(20px)",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",

                  cursor: "pointer",

                  transition: "all 0.35s ease",

                  boxShadow: isHovered
                    ? "0 0 40px rgba(74,225,118,0.25)"
                    : "0 10px 30px rgba(0,0,0,0.3)",

                  transform: isHovered
                    ? "translateY(-8px) scale(1.02)"
                    : "translateY(0px) scale(1)",
                }}
              >
                {/* BG ICON */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    opacity: isHovered ? 0.2 : 0.08,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "120px",
                      color: isHovered
                        ? "#002109"
                        : "#4ae176",
                    }}
                  >
                    {account.tipo_cuenta === "Monetaria"
                      ? "account_balance_wallet"
                      : "savings"}
                  </span>
                </div>

                {/* CONTENT */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {/* ICON */}
                  <div
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius: "22px",
                      background: isHovered
                        ? "rgba(0,0,0,0.08)"
                        : "rgba(74,225,118,0.1)",

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      marginBottom: "28px",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        fontSize: "42px",
                        color: isHovered
                          ? "#002109"
                          : "#4ae176",

                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      {account.tipo_cuenta === "Monetaria"
                        ? "payments"
                        : "savings"}
                    </span>
                  </div>

                  {/* TIPO */}
                  <h3
                    style={{
                      fontSize: "36px",
                      fontWeight: "800",
                      marginBottom: "10px",

                      color: isHovered
                        ? "#002109"
                        : "#dae2fd",
                    }}
                  >
                    {account.tipo_cuenta}
                  </h3>

                  {/* NUMERO */}
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "18px",

                      color: isHovered
                        ? "rgba(0,33,9,0.8)"
                        : "#c4c6cf",
                    }}
                  >
                    {account.numero_cuenta}
                  </p>

                  {/* SALDO */}
                  <div
                    style={{
                      fontSize: "34px",
                      fontWeight: "800",

                      color: isHovered
                        ? "#002109"
                        : "#4ae176",
                    }}
                  >
                    Q {Number(account.saldo).toFixed(2)}
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",

                    color: isHovered
                      ? "#002109"
                      : "#4ae176",

                    fontWeight: "700",
                    fontSize: "18px",
                  }}
                >
                  <span>SELECCIONAR</span>

                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* TOAST */}
      <div
        style={{
          position: "fixed",
          top: "100px",
          left: "50%",

          transform: showToast
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-20px)",

          opacity: showToast ? 1 : 0,

          transition: "all 0.5s ease",

          background: "rgba(23,31,51,0.8)",
          backdropFilter: "blur(20px)",

          border: "1px solid rgba(74,225,118,0.2)",

          borderRadius: "999px",

          padding: "14px 24px",

          display: "flex",
          alignItems: "center",
          gap: "12px",

          zIndex: 999,
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ color: "#4ae176" }}
        >
          info
        </span>

        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Seleccione una cuenta para continuar
        </span>
      </div>
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
    background: "rgba(6, 14, 32, 0.9)",
    backdropFilter: "blur(32px)",
    borderTop: "1px solid rgba(68, 71, 78, 0.3)",
    boxShadow: "0px -10px 30px rgba(0,0,0,0.4)",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    zIndex: 50,
  }}
>
  {/* REGRESAR */}
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
      e.currentTarget.style.background =
        "rgba(177, 199, 242, 0.1)";
      e.currentTarget.style.color = "#b1c7f2";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        "transparent";
      e.currentTarget.style.color = "#c4c6cf";
    }}
  >
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: "32px",
        marginBottom: "4px",
      }}
    >
      arrow_back
    </span>

    <span>Regresar</span>
  </button>

  {/* DIVIDER */}
  <div
    style={{
      height: "32px",
      width: "1px",
      background:
        "rgba(68, 71, 78, 0.3)",
    }}
  />

  {/* SALIR */}
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
      e.currentTarget.style.background =
        "rgba(255, 180, 171, 0.1)";
      e.currentTarget.style.color =
        "#ffb4ab";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        "transparent";
      e.currentTarget.style.color =
        "#c4c6cf";
    }}
  >
    <span
      className="material-symbols-outlined"
      style={{
        fontSize: "32px",
        marginBottom: "4px",
      }}
    >
      logout
    </span>

    <span>Salir</span>
  </button>
</nav>
    </div>
  );
};

export default AccountSelection;