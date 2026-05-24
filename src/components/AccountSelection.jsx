import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSelection = () => {
    const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const accounts = [
    {
      id: 1,
      title: "Cuenta Monetaria",
      description: "Transacciones inmediatas y cheques.",
      icon: "payments",
      bgIcon: "account_balance_wallet",
      color: "#4ae176",
    },
    {
      id: 2,
      title: "Cuenta de Ahorro",
      description: "Genera intereses sobre tu saldo.",
      icon: "trending_up",
      bgIcon: "savings",
      color: "#4ae176",
      featured: true,
    },
    {
      id: 3,
      title: "Otras Cuentas",
      description: "Cuentas empresariales o de terceros.",
      icon: "more_horiz",
      bgIcon: "account_tree",
      color: "#b7c8e1",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1326",
        color: "#dae2fd",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
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
          height: "72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          background: "rgba(23,31,51,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          zIndex: 100,
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#b1c7f2",
            letterSpacing: "0.5px",
          }}
        >
          SECUREBANK
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.04)",
              padding: "10px 16px",
              borderRadius: "999px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#4ae176" }}
            >
              wifi
            </span>

            <span
              style={{
                color: "#c4c6cf",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Conectado
            </span>
          </div>

          <span
            className="material-symbols-outlined"
            style={{
              color: "#b1c7f2",
              fontSize: "28px",
            }}
          >
            schedule
          </span>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          paddingTop: "120px",
          paddingBottom: "140px",
          paddingLeft: "40px",
          paddingRight: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
            animation: "fadeUp 0.8s ease",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              fontWeight: 700,
              marginBottom: "14px",
              lineHeight: 1.1,
            }}
          >
            Selección de Cuenta
          </h2>

          <p
            style={{
              fontSize: "20px",
              color: "#c4c6cf",
              maxWidth: "700px",
            }}
          >
            Por favor, elija la cuenta de origen para su retiro.
          </p>
        </div>

        {/* CARDS */}
        <div
          style={{
            width: "100%",
            maxWidth: "1400px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "32px",
          }}
        >
         {accounts.map((account, index) => {
  const isHovered = hoveredCard === account.id;

  return (
    <button
      key={account.id}
      onClick={() => {
        if (
          account.title === "Cuenta Monetaria" ||
          account.title === "Cuenta de Ahorro"
        ) {
          navigate("/withdrawal");
        }
      }}
      onMouseEnter={() => setHoveredCard(account.id)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "320px",
        padding: "32px",
        borderRadius: "32px",
        border: isHovered
          ? "1px solid rgba(74,225,118,0.4)"
          : "1px solid rgba(255,255,255,0.08)",
        background: isHovered
          ? "rgba(74,225,118,0.95)"
          : "rgba(23,31,51,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
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
        animation: `fadeUp 0.7s ease ${index * 0.1}s both`,
      }}
    >
      {/* BACKGROUND ICON */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          opacity: isHovered ? 0.2 : 0.1,
          transition: "all 0.3s ease",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: "120px",
            color: isHovered ? "#002109" : account.color,
          }}
        >
          {account.bgIcon}
        </span>
      </div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "24px",
            background: isHovered
              ? "rgba(0,33,9,0.1)"
              : `${account.color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
            transition: "all 0.3s ease",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "42px",
              color: isHovered ? "#002109" : account.color,
              fontVariationSettings: "'FILL' 1",
              transition: "all 0.3s ease",
            }}
          >
            {account.icon}
          </span>
        </div>

        <h3
          style={{
            fontSize: "34px",
            fontWeight: 700,
            marginBottom: "12px",
            color: isHovered ? "#002109" : "#dae2fd",
            transition: "all 0.3s ease",
          }}
        >
          {account.title}
        </h3>

        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.5,
            color: isHovered
              ? "rgba(0,33,9,0.8)"
              : "#c4c6cf",
            transition: "all 0.3s ease",
          }}
        >
          {account.description}
        </p>
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "40px",
          color: isHovered ? "#002109" : account.color,
          fontWeight: 700,
          letterSpacing: "0.5px",
          transition: "all 0.3s ease",
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

      {/* BOTTOM NAV */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "24px 40px",
          background: "rgba(6,14,32,0.92)",
          backdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          zIndex: 100,
        }}
      >
        {[
          { icon: "cancel", label: "Cancel" },
          { icon: "logout", label: "Exit" },
        ].map((item, index) => (
          <button
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 40px",
              borderRadius: "16px",
              background: "transparent",
              border: "none",
              color: "#c4c6cf",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "rgba(255,180,171,0.08)";
              e.currentTarget.style.color = "#ffb4ab";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#c4c6cf";
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "30px",
                marginBottom: "4px",
              }}
            >
              {item.icon}
            </span>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
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
          Seleccione una opción para continuar
        </span>
      </div>

      {/* BACKGROUND LIGHTS */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "-120px",
          width: "420px",
          height: "420px",
          background: "rgba(74,225,118,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: 0,
          animation: "float 10s ease-in-out infinite alternate",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "-120px",
          width: "420px",
          height: "420px",
          background: "rgba(177,199,242,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: 0,
          animation: "float 12s ease-in-out infinite alternate",
        }}
      />

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          from {
            transform: translateY(0px);
          }

          to {
            transform: translateY(30px);
          }
        }
      `}</style>
    </div>
  );
};

export default AccountSelection;