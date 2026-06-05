import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const MainBank = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [hoveredCard, setHoveredCard] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
      if (confirmLogout) {
        setLoading(true);
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          navigate("/");
        }, 2500);
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [navigate]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const glassStyle = {
    background: 'rgba(23, 31, 51, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(142, 144, 153, 0.15)',
  };

  const menuItems = [
    { icon: 'payments', label: 'Retiro de Efectivo', desc: 'Dispensa billetes de forma rápida', color: '#b1c7f2', delay: 0.1 },
    { icon: 'account_balance_wallet', label: 'Consulta de Saldo', desc: 'Verifica tus cuentas y ahorros', color: '#b1c7f2', delay: 0.2 },
    { icon: 'sync_alt', label: 'Transferencias', desc: 'Envía dinero a otras cuentas', color: '#b1c7f2', delay: 0.3 },
    { icon: 'lock_reset', label: 'Cambio de Clave', desc: 'Actualiza tu PIN de seguridad', color: '#b1c7f2', delay: 0.5 },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ background: '#0b1326', color: '#dae2fd', minHeight: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
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

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          paddingTop: '80px',
          paddingBottom: '128px',
          paddingLeft: '40px',
          paddingRight: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Glows */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '384px',
            height: '384px',
            background: 'rgba(177, 199, 242, 0.1)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            animation: 'float 20s ease-in-out infinite alternate',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '384px',
            height: '384px',
            background: 'rgba(74, 225, 118, 0.1)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            animation: 'float 20s ease-in-out infinite alternate',
            animationDelay: '-5s',
          }}
        ></div>

        {/* Greeting Section */}
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            marginBottom: '32px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          <h1 style={{ fontSize: '48px', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700', marginBottom: '8px', color: '#dae2fd' }}>
            Hola, {usuario.nombre}
          </h1>
          <p style={{ fontSize: '20px', lineHeight: '1.5', fontWeight: '400', color: '#c4c6cf' }}>
            ¿Qué transacción deseas realizar el día de hoy?
          </p>
        </div>

        {/* Bento Grid - Cards con efecto hover como AccountSelection */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {menuItems.map((item, index) => {
            const isHovered = hoveredCard === index;
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.label === 'Retiro de Efectivo') {
                    navigate("/account-selection");
                  }
                  if (item.label === 'Consulta de Saldo') {
                    navigate("/balance");
                  }
                  if(item.label === "Transferencias"){
                    navigate("/transfer")
                  }
                  if (item.label === 'Cambio de Clave') {
  navigate("/change-pin");
}
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "32px",
                  borderRadius: "28px",
                  border: isHovered ? "1px solid rgba(74,225,118,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: isHovered ? "#4ae176" : "rgba(23,31,51,0.6)",
                  backdropFilter: "blur(20px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  boxShadow: isHovered ? "0 0 40px rgba(74,225,118,0.25)" : "0 10px 30px rgba(0,0,0,0.3)",
                  transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0px) scale(1)",
                  animation: `staggerIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${item.delay}s`,
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                {/* BG Icon */}
                <div style={{ position: "absolute", top: 20, right: 20, opacity: isHovered ? 0.2 : 0.08 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "100px", color: isHovered ? "#002109" : item.color }}>
                    {item.icon}
                  </span>
                </div>

                {/* Icon */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    background: isHovered ? "rgba(0,0,0,0.08)" : `${item.color}33`,
                    padding: "16px",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "32px",
                      color: isHovered ? "#002109" : item.color,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Text */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      lineHeight: "1.4",
                      fontWeight: "600",
                      color: isHovered ? "#002109" : "#dae2fd",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </h2>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.2",
                      letterSpacing: "0.05em",
                      fontWeight: "500",
                      color: isHovered ? "rgba(0,33,9,0.8)" : "#c4c6cf",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: isHovered ? "#002109" : item.color,
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  <span>SELECCIONAR</span>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    arrow_forward
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Bottom Navigation */}
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
          onClick={async () => {
            const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
            if (confirmLogout) {
              setLoading(true);
              setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                navigate("/");
              }, 2500);
            }
          }}
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
            e.currentTarget.style.background = "rgba(177, 199, 242, 0.1)";
            e.currentTarget.style.color = "#b1c7f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#c4c6cf";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>
            arrow_back
          </span>
          <span>Regresar</span>
        </button>

        {/* DIVIDER */}
        <div
          style={{
            height: "32px",
            width: "1px",
            background: "rgba(68, 71, 78, 0.3)",
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
            e.currentTarget.style.background = "rgba(255, 180, 171, 0.1)";
            e.currentTarget.style.color = "#ffb4ab";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#c4c6cf";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>
            logout
          </span>
          <span>Salir</span>
        </button>
      </nav>

      <style>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes staggerIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(20px, 30px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default MainBank;