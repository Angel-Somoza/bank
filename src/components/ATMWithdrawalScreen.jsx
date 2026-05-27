import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ATMWithdrawalScreen = () => {
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  // =========================
  // CUENTA Y USUARIO
  // =========================
  const cuentaSeleccionada = JSON.parse(
    localStorage.getItem("cuentaSeleccionada")
  );

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

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
  // MONTOS
  // =========================
  const amounts = [
    {
      value: "Q50",
      description: "1 billete de Q50",
    },
    {
      value: "Q150",
      description: "1 de 100 y 1 de 50",
    },
    {
      value: "Q200",
      description: "2 de 100",
    },
    {
      value: "Q300",
      description: "3 billetes de Q100",
    },
    {
      value: "Q500",
      description: "5 billetes de Q100",
    },
    {
      value: "Q1000",
      description: "10 billetes de Q100",
    },
    {
      value: "Q2000",
      description: "20 billetes de Q100",
    },
  ];

  // =========================
  // RETIRO
  // =========================
  const realizarRetiro = async (amountValue) => {
    try {
      const monto = Number(
        amountValue.replace("Q", "").replace(",", "")
      );

      setSelectedAmount(amountValue);

      const response = await fetch(
        "http://localhost:3000/api/cajero/retiro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id_usuario: usuario.id_usuario,
            id_cuenta: cuentaSeleccionada.id_cuenta,
            monto: monto,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error realizando retiro");
        return;
      }

      // GUARDAR RESULTADO
      localStorage.setItem(
        "ultimoRetiro",
        JSON.stringify({
          monto,
          saldo_actual: data.saldo_actual,
          cuenta: cuentaSeleccionada.numero_cuenta,
        })
      );

      navigate("/success", {
        state: {
          amount: monto,
          saldo: data.saldo_actual,
        },
      });

    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    }
  };

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
      {/* GLOW */}
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
          animation: "floatGlow 8s ease-in-out infinite alternate",
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
          animation: "floatGlow2 10s ease-in-out infinite alternate",
          zIndex: 0,
        }}
      />

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
          }}
        >
          SECUREBANK
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
        {/* TITLE */}
        <div
          style={{
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            Seleccione Monto
          </h1>

          <p
            style={{
              color: "#c4c6cf",
              fontSize: "20px",
            }}
          >
            Cuenta:
            <span
              style={{
                color: "#4ae176",
                marginLeft: "10px",
                fontWeight: "700",
              }}
            >
              {cuentaSeleccionada?.numero_cuenta}
            </span>
          </p>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: "28px",
          }}
        >
          {amounts.map((amount, index) => {
            const isSelected =
              selectedAmount === amount.value;

            return (
              <button
                key={index}
                onClick={() =>
                  realizarRetiro(amount.value)
                }
                style={{
                  position: "relative",
                  overflow: "hidden",

                  background: isSelected
                    ? "#4ae176"
                    : "rgba(23,31,51,0.55)",

                  color: isSelected
                    ? "#002109"
                    : "#dae2fd",

                  backdropFilter: "blur(20px)",

                  border: isSelected
                    ? "1px solid #4ae176"
                    : "1px solid rgba(142,144,153,0.2)",

                  borderRadius: "26px",
                  minHeight: "190px",
                  padding: "30px",
                  cursor: "pointer",
                  transition: "all 0.35s ease",

                  boxShadow: isSelected
                    ? "0 0 40px rgba(74,225,118,0.45)"
                    : "0 10px 30px rgba(0,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "#4ae176";

                  e.currentTarget.style.color =
                    "#002109";

                  e.currentTarget.style.transform =
                    "translateY(-6px) scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    isSelected
                      ? "#4ae176"
                      : "rgba(23,31,51,0.55)";

                  e.currentTarget.style.color =
                    isSelected
                      ? "#002109"
                      : "#dae2fd";

                  e.currentTarget.style.transform =
                    "translateY(0px) scale(1)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: "54px",
                      fontWeight: "800",
                      marginBottom: "16px",
                    }}
                  >
                    {amount.value}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: isSelected
                          ? "#003915"
                          : "#4ae176",
                      }}
                    >
                      payments
                    </span>

                    {amount.description}
                  </div>
                </div>
              </button>
            );
          })}

          {/* OTRO MONTO */}
          <button
            style={{
              background: "rgba(23,31,51,0.55)",
              color: "#dae2fd",
              border:
                "1px solid rgba(142,144,153,0.2)",
              borderRadius: "26px",
              minHeight: "190px",
              padding: "30px",
              cursor: "pointer",
              transition: "all 0.35s ease",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                fontSize: "34px",
                marginBottom: "16px",
              }}
            >
              Otro Monto
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                opacity: 0.9,
              }}
            >
              <span className="material-symbols-outlined">
                dialpad
              </span>

              Entrada personalizada
            </div>
          </button>
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
      </main>

      {/* TOAST */}
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

          border:
            "1px solid rgba(74,225,118,0.3)",

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

        Seleccione una opción para continuar
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes floatGlow {
          from {
            transform: translateY(0px) translateX(0px);
          }
          to {
            transform: translateY(40px) translateX(20px);
          }
        }

        @keyframes floatGlow2 {
          from {
            transform: translateY(0px) translateX(0px);
          }
          to {
            transform: translateY(-30px) translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default ATMWithdrawalScreen;