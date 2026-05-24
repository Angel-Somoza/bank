import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const WithdrawalSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredButton, setHoveredButton] = useState(null);

  // MONTO RECIBIDO DESDE LA PANTALLA ANTERIOR
  const selectedAmount = location.state?.amount || 0;

  // SALDO INICIAL
  const initialBalance = 12450.5;

  // NUEVO SALDO
  const remainingBalance = initialBalance - selectedAmount;

  // FORMATO GTQ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const glassStyle = {
    background: "rgba(23, 31, 51, 0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(142, 144, 153, 0.1)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#0b1326",
        color: "#dae2fd",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(74,225,118,0.08)",
          filter: "blur(120px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "rgba(177,199,242,0.08)",
          filter: "blur(140px)",
        }}
      />

      {/* HEADER */}
      <header
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          background: "rgba(23,31,51,0.8)",
          backdropFilter: "blur(30px)",
          borderBottom: "1px solid rgba(68,71,78,0.2)",
          zIndex: 20,
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "30px", color: "#4ae176" }}
          >
            wifi
          </span>

          <span
            className="material-symbols-outlined"
            style={{ fontSize: "30px", color: "#b1c7f2" }}
          >
            schedule
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "720px",
            ...glassStyle,
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 0 50px rgba(74,225,118,0.08)",
          }}
        >
          {/* ICON */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "#4ae176",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(74,225,118,0.3)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "50px",
                  color: "#0b1326",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                check
              </span>
            </div>
          </div>

          {/* TITLE */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "#4ae176",
                marginBottom: "8px",
              }}
            >
              Retiro Exitoso
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#c4c6cf",
              }}
            >
              Su transacción ha sido procesada correctamente.
            </p>
          </div>

          {/* INFO */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            {[
              {
                label: "Cuenta de origen",
                value: "Cuenta Monetaria",
                color: "#dae2fd",
              },
              {
                label: "Monto retirado",
                value: formatCurrency(selectedAmount),
                color: "#dae2fd",
              },
              {
                label: "Saldo restante",
                value: formatCurrency(remainingBalance),
                color: "#4ae176",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(34,42,61,0.7)",
                  border: "1px solid rgba(142,144,153,0.12)",
                  borderRadius: "18px",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#c4c6cf",
                  }}
                >
                  {item.label}
                </span>

                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: item.color,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            {/* PRINT */}
            <button
              onMouseEnter={() => setHoveredButton("print")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1,
                minHeight: "70px",
                border: "none",
                borderRadius: "20px",
                padding: "0 20px",
                background:
                  hoveredButton === "print"
                    ? "#64ff8a"
                    : "#4ae176",
                color: "#0b1326",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.3s",
                fontWeight: "800",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span className="material-symbols-outlined">
                  print
                </span>

                <span>Imprimir Recibo</span>
              </div>

              <span className="material-symbols-outlined">
                chevron_right
              </span>
            </button>

            {/* EMAIL */}
            <button
              onMouseEnter={() => setHoveredButton("mail")}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                flex: 1,
                minHeight: "70px",
                borderRadius: "20px",
                padding: "0 20px",
                background:
                  hoveredButton === "mail"
                    ? "#4ae176"
                    : "rgba(34,42,61,0.8)",
                color:
                  hoveredButton === "mail"
                    ? "#0b1326"
                    : "#4ae176",
                border: "1px solid rgba(74,225,118,0.3)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "0.3s",
                fontWeight: "800",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span className="material-symbols-outlined">
                  mail
                </span>

                <span>Enviar por Email</span>
              </div>

              <span className="material-symbols-outlined">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawalSuccess;