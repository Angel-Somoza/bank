
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const glassStyle = {
  background: 'rgba(23, 31, 51, 0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(142, 144, 153, 0.1)',
};

const ATMWelcome = () => {
  const navigate = useNavigate();

  const [cardInserted, setCardInserted] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    let timer;

    if (showError) {
      timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showError]);

  const handleCardClick = () => {
    setCardInserted(prev => !prev);
  };

  const handleSpanishClick = () => {
    if (cardInserted) {
      navigate("/pin");
    } else {
      setShowError(true);
    }
  };

  return (
    <div
      style={{
        background: '#0b1326',
        color: '#dae2fd',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* ERROR */}
      {showError && (
        <div
          style={{
            position: 'fixed',
            top: '100px',
            right: '30px',
            background: 'rgba(255, 80, 80, 0.15)',
            border: '1px solid rgba(255, 80, 80, 0.35)',
            color: '#ffb4ab',
            padding: '16px 22px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            animation: 'slideIn 0.35s ease',
          }}
        >
          <span className="material-symbols-outlined">
            warning
          </span>

          <span
            style={{
              fontWeight: '600',
              fontSize: '15px',
            }}
          >
            Inserte su tarjeta para continuar
          </span>
        </div>
      )}

      {/* HEADER */}
      <header
        style={{
          background: 'rgba(23, 31, 51, 0.8)',
          backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(68, 71, 78, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          height: '80px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#b1c7f2',
            letterSpacing: '0.5px',
          }}
        >
          SECUREBANK
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BACKGROUND */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '-80px',
            width: '384px',
            height: '384px',
            background: 'rgba(177, 199, 242, 0.1)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '-80px',
            width: '384px',
            height: '384px',
            background: 'rgba(74, 225, 118, 0.1)',
            borderRadius: '50%',
            filter: 'blur(120px)',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* TITLE */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
                marginBottom: '8px',
              }}
            >
              Bienvenido a{' '}
              <span style={{ color: '#b1c7f2' }}>
                SECUREBANK
              </span>
            </h1>

            <p
              style={{
                fontSize: '20px',
                lineHeight: '1.5',
                color: '#c4c6cf',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Inserte su tarjeta para comenzar.
            </p>
          </div>

          {/* ATM AREA */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
              height: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* CARD */}
            <button
              onClick={handleCardClick}
              aria-label="Insertar tarjeta"
              style={{
                ...glassStyle,

                width: '288px',
                height: '176px',

                borderRadius: '18px',
                padding: '24px',

                display: 'flex',
                flexDirection: 'column',

                cursor: 'pointer',

                position: 'absolute',
                top: cardInserted
                  ? '145px'
                  : '40px',

                zIndex: 20,

                overflow: 'hidden',

                transformStyle: 'preserve-3d',
                willChange: 'transform, top, opacity',

                animation: !cardInserted
                  ? 'float 4s ease-in-out infinite'
                  : 'none',

                transform: cardInserted
                  ? `
                    perspective(1400px)
                    rotateX(78deg)
                    scale(0.62)
                  `
                  : `
                    perspective(1400px)
                    rotateX(0deg)
                    scale(1)
                  `,

                opacity: cardInserted
                  ? 0.18
                  : 1,

                filter: cardInserted
                  ? 'blur(1.4px)'
                  : 'blur(0px)',

                boxShadow: cardInserted
                  ? `
                    0 50px 100px rgba(0,0,0,0.75),
                    0 0 50px rgba(74,225,118,0.12)
                  `
                  : `
                    0 30px 80px rgba(0,0,0,0.5),
                    0 0 50px rgba(74,225,118,0.14)
                  `,

                transition: `
                  top 1.25s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 1.25s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 1s ease,
                  filter 1s ease,
                  box-shadow 1s ease
                `,
              }}
            >
              {/* SHINE */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-60%',
                  width: '80%',
                  height: '240%',
                  background:
                    'linear-gradient(to right, transparent, rgba(255,255,255,0.14), transparent)',
                  transform: 'rotate(25deg)',
                  animation: !cardInserted
                    ? 'shine 4s linear infinite'
                    : 'none',
                }}
              />

              {/* CHIP */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '32px',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '34px',
                  background:
                    'linear-gradient(135deg, #ffe082, #ffb300)',
                  borderRadius: '6px',
                  border:
                    '1px solid rgba(255,255,255,0.25)',
                  boxShadow:
                    '0 0 20px rgba(255,215,0,0.25)',
                }}
              />

              {/* VISA */}
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  width: '52px',
                  height: '32px',
                  background:
                    'rgba(177, 199, 242, 0.18)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(4px)',
                }}
              />

              {/* CARD TEXT */}
              <div style={{ marginTop: 'auto' }}>
                <div
                  style={{
                    width: '60%',
                    height: '14px',
                    background:
                      'rgba(255,255,255,0.18)',
                    borderRadius: '999px',
                    marginBottom: '10px',
                  }}
                />

                <div
                  style={{
                    width: '78%',
                    height: '12px',
                    background:
                      'rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                  }}
                />
              </div>
            </button>

            {/* SLOT */}
            <div
              style={{
                position: 'absolute',
                top: '220px',
                width: '320px',
                height: '18px',
                background:
                  'linear-gradient(to bottom, #111827, #05070d)',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxShadow: `
                  inset 0 3px 12px rgba(0,0,0,0.9),
                  0 0 25px rgba(0,0,0,0.5)
                `,

                overflow: 'visible',
              }}
            >
              {/* SLOT GLOW */}
              <div
                style={{
                  position: 'absolute',
                  width: cardInserted
                    ? '360px'
                    : '280px',

                  height: cardInserted
                    ? '40px'
                    : '20px',

                  background:
                    'radial-gradient(circle, rgba(74,225,118,0.7), transparent 72%)',

                  filter: 'blur(24px)',

                  opacity: cardInserted
                    ? 1
                    : 0.45,

                  transform: cardInserted
                    ? 'scale(1.2)'
                    : 'scale(1)',

                  transition: `
                    all 0.8s cubic-bezier(0.16, 1, 0.3, 1)
                  `,
                }}
              />

              {/* SLOT LIGHT */}
              <div
                style={{
                  width: '290px',
                  height: '4px',
                  borderRadius: '999px',

                  background: cardInserted
                    ? '#6bff8f'
                    : '#4ae176',

                  boxShadow: cardInserted
                    ? `
                      0 0 25px rgba(107,255,143,1),
                      0 0 50px rgba(107,255,143,0.7)
                    `
                    : `
                      0 0 15px rgba(74,225,118,0.8)
                    `,

                  animation: cardInserted
                    ? 'scanner 1.1s linear infinite'
                    : 'pulse 2s ease infinite',

                  transition: 'all 0.5s ease',
                }}
              />
            </div>

            {/* TEXT */}
            <div
              style={{
                position: 'absolute',
                top: '280px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',

                color: '#4ae176',

                animation:
                  'breathe 2.5s ease-in-out infinite',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '32px',
                }}
              >
                credit_card
              </span>

              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {cardInserted
                  ? 'Tarjeta Insertada'
                  : 'Inserte Tarjeta'}
              </span>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              width: '100%',
              maxWidth: '900px',
              marginTop: '32px',
            }}
          >
            <button
              onClick={handleSpanishClick}
              style={{
                ...glassStyle,
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderLeft: '4px solid #4ae176',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '40px',
                    color: '#4ae176',
                  }}
                >
                  language
                </span>

                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                    }}
                  >
                    Español
                  </div>

                  <div
                    style={{
                      fontSize: '16px',
                      color: '#c4c6cf',
                    }}
                  >
                    Continuar en español
                  </div>
                </div>
              </div>

              <span className="material-symbols-outlined">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.45;
          }
        }

        @keyframes scanner {
          0% {
            transform: scaleX(0.6);
            opacity: 0.4;
          }

          50% {
            transform: scaleX(1);
            opacity: 1;
          }

          100% {
            transform: scaleX(0.6);
            opacity: 0.4;
          }
        }

        @keyframes breathe {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }

        @keyframes shine {
          0% {
            transform:
              translateX(-250%)
              rotate(25deg);
          }

          100% {
            transform:
              translateX(450%)
              rotate(25deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform:
              perspective(1400px)
              translateY(0px)
              rotateX(0deg)
              rotateZ(0deg);
          }

          25% {
            transform:
              perspective(1400px)
              translateY(-10px)
              rotateX(2deg)
              rotateZ(-1deg);
          }

          50% {
            transform:
              perspective(1400px)
              translateY(-16px)
              rotateX(4deg)
              rotateZ(1deg);
          }

          75% {
            transform:
              perspective(1400px)
              translateY(-8px)
              rotateX(2deg)
              rotateZ(-0.5deg);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ATMWelcome;

