import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const MainBank = () => {
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const usuario = JSON.parse(
    localStorage.getItem("usuario")) || {};

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Sesión no encontrada");
    navigate("/");
  }
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
    { icon: 'payments', label: 'Retiro de Efectivo', desc: 'Dispensa billetes de forma rápida', color: '#4ae176', delay: 0.1 },
    { icon: 'account_balance_wallet', label: 'Consulta de Saldo', desc: 'Verifica tus cuentas y ahorros', color: '#b1c7f2', delay: 0.2 },
    { icon: 'sync_alt', label: 'Transferencias', desc: 'Envía dinero a otras cuentas', color: '#b7c8e1', delay: 0.3 },
    { icon: 'receipt_long', label: 'Pagos', desc: 'Servicios, tarjetas y convenios', color: '#b1c7f2', delay: 0.4 },
    { icon: 'lock_reset', label: 'Cambio de Clave', desc: 'Actualiza tu PIN de seguridad', color: '#b1c7f2', delay: 0.5 },
    { icon: 'grid_view', label: 'Otros Servicios', desc: 'Donaciones, recargas y más', color: '#b1c7f2', delay: 0.6 },
  ];

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

        {/* Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {menuItems.map((item, index) => (
  <button
    key={index}
    onClick={() => {
      // SOLO navega en Retiro de Efectivo
      if (item.label === 'Retiro de Efectivo') {
        navigate("/account-selection");
      }
    }}
    style={{
      ...glassStyle,
      padding: '32px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderLeft: `4px solid ${index === 0 ? '#4ae176' : 'transparent'}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      animation: `staggerIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
      animationDelay: `${item.delay}s`,
      opacity: 0,
      animationFillMode: 'forwards',
      border: '1px solid rgba(142, 144, 153, 0.15)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        `0 0 30px 2px rgba(177, 199, 242, 0.15)`;

      e.currentTarget.style.transform =
        'translateY(-4px) scale(1.02)';

      e.currentTarget.style.background =
        'rgba(34, 42, 61, 0.8)';

      e.currentTarget.style.borderColor =
        'rgba(177, 199, 242, 0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        '0 10px 30px rgba(0,0,0,0.3)';

      e.currentTarget.style.transform =
        'translateY(0) scale(1)';

      e.currentTarget.style.background =
        glassStyle.background;

      e.currentTarget.style.borderColor =
        'rgba(142, 144, 153, 0.15)';
    }}
    onMouseDown={(e) => {
      e.currentTarget.style.transform =
        'scale(0.96)';
    }}
    onMouseUp={(e) => {
      e.currentTarget.style.transform =
        'translateY(-4px) scale(1.02)';
    }}
  >
    {/* Icon */}
    <div
      style={{
        background: `${item.color}33`,
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{
          fontSize: '32px',
          color: item.color,
          transition: 'transform 0.3s ease',
        }}
      >
        {item.icon}
      </span>
    </div>

    {/* Text */}
    <div>
      <h2
        style={{
          fontSize: '24px',
          lineHeight: '1.4',
          fontWeight: '600',
          color: '#dae2fd',
          marginBottom: '4px',
        }}
      >
        {item.label}
      </h2>

      <p
        style={{
          fontSize: '16px',
          lineHeight: '1.2',
          letterSpacing: '0.05em',
          fontWeight: '600',
          color: '#c4c6cf',
        }}
      >
        {item.desc}
      </p>
    </div>
  </button>
))}
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

      {}
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