import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ATMWithdrawalScreen = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [hoveredAmount, setHoveredAmount] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      {/* BACKGROUND GLOWS */}
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
          animation: "fadeDown 0.8s ease",
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

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                color: "#c4c6cf",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              ATM #4022
            </div>

            <div
              style={{
                color: "#4ae176",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              EN LÍNEA
            </div>
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
        {/* TITLE */}
        <div
          style={{
            marginBottom: "40px",
            animation: "fadeUp 0.8s ease",
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
            Elija una opción rápida o ingrese un monto personalizado.
          </p>
        </div>

        {/* GRID */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: "28px",
  }}
>
  {amounts.map((amount, index) => {
    const isSelected = selectedAmount === amount.value;

    return (
      <button
        key={index}
onClick={() => {
  setSelectedAmount(amount.value);

  const numericAmount = Number(
    amount.value.replace("Q", "").replace(",", "")
  );

  navigate("/success", {
    state: {
      amount: numericAmount,
    },
  });
}}
        style={{
          position: "relative",
          overflow: "hidden",

          /* NORMAL */
          background: isSelected
            ? "#4ae176"
            : "rgba(23,31,51,0.55)",

          color: isSelected ? "#002109" : "#dae2fd",

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

          animation: `cardIn 0.6s ease forwards`,
          animationDelay: `${index * 0.08}s`,
          opacity: 0,
          transform: "translateY(40px)",
        }}
        onMouseEnter={(e) => {
          /* TODO VERDE AL PASAR EL MOUSE */
          e.currentTarget.style.background = "#4ae176";
          e.currentTarget.style.color = "#002109";
          e.currentTarget.style.border = "1px solid #4ae176";
          e.currentTarget.style.boxShadow =
            "0 0 45px rgba(74,225,118,0.55)";
          e.currentTarget.style.transform =
            "translateY(-6px) scale(1.03)";
        }}
        onMouseLeave={(e) => {
          /* VUELVE A NORMAL */
          e.currentTarget.style.background = isSelected
            ? "#4ae176"
            : "rgba(23,31,51,0.55)";

          e.currentTarget.style.color = isSelected
            ? "#002109"
            : "#dae2fd";

          e.currentTarget.style.border = isSelected
            ? "1px solid #4ae176"
            : "1px solid rgba(142,144,153,0.2)";

          e.currentTarget.style.boxShadow = isSelected
            ? "0 0 40px rgba(74,225,118,0.45)"
            : "0 10px 30px rgba(0,0,0,0.3)";

          e.currentTarget.style.transform =
            "translateY(0px) scale(1)";
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              fontSize: "54px",
              fontWeight: "800",
              marginBottom: "16px",
              color: isSelected ? "#002109" : "#dae2fd",
              transition: "0.3s",
            }}
            className="amount-text"
          >
            {amount.value}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: isSelected ? "#003915" : "#c4c6cf",
              fontSize: "16px",
            }}
            className="amount-description"
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: isSelected ? "#003915" : "#4ae176",
                fontVariationSettings: "'FILL' 1",
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

  {/* OTHER AMOUNT */}
  <button
    style={{
      background: "rgba(23,31,51,0.55)",
      color: "#dae2fd",
      border: "1px solid rgba(142,144,153,0.2)",
      borderRadius: "26px",
      minHeight: "190px",
      padding: "30px",
      cursor: "pointer",
      transition: "all 0.35s ease",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      fontWeight: "700",
      animation: "cardIn 0.6s ease forwards",
      animationDelay: "0.5s",
      opacity: 0,
      transform: "translateY(40px)",
    }}
    onMouseEnter={(e) => {
      /* MISMO EFECTO VERDE */
      e.currentTarget.style.background = "#4ae176";
      e.currentTarget.style.color = "#002109";
      e.currentTarget.style.border = "1px solid #4ae176";
      e.currentTarget.style.transform =
        "translateY(-6px) scale(1.03)";
      e.currentTarget.style.boxShadow =
        "0 0 45px rgba(74,225,118,0.55)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background =
        "rgba(23,31,51,0.55)";
      e.currentTarget.style.color = "#dae2fd";
      e.currentTarget.style.border =
        "1px solid rgba(142,144,153,0.2)";
      e.currentTarget.style.transform =
        "translateY(0px) scale(1)";
      e.currentTarget.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.3)";
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
</div>

    
      </main>

      {/* BOTTOM NAV */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "24px",
          background: "rgba(6,14,32,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(68,71,78,0.3)",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          zIndex: 50,
          animation: "fadeUp 1s ease",
        }}
      >
        {[
          { icon: "cancel", label: "Cancel" },
          { icon: "logout", label: "Exit" },
        ].map((item, index) => (
          <button
            key={index}
            style={{
              border: "none",
              background: "transparent",
              color: "#c4c6cf",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "12px 40px",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,180,171,0.12)";
              e.currentTarget.style.color = "#ffb4ab";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#c4c6cf";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>

            {item.label}
          </button>
        ))}
      </nav>

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
          border: "1px solid rgba(74,225,118,0.3)",
          borderRadius: "999px",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 100,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
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
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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