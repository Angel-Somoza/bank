import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ATMWelcome = ({ onEspanol }) => {
  const navigate = useNavigate();

  const [cardInserted, setCardInserted] = useState(false);
  const [showError, setShowError] = useState(false);

  const glassStyle = {
    background: 'rgba(23, 31, 51, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(142, 144, 153, 0.1)',
  };

 const handleSpanishClick = () => {
  if (cardInserted) {
    setShowError(false);
    navigate("/pin");
  } else {
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
    }, 3000);
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
      {/* MENSAJE ERROR FLOATING */}
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

      {/* Header */}
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

      {/* Main */}
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
        {/* Background Blurs */}
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
            pointerEvents: 'none',
            zIndex: 0,
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
            pointerEvents: 'none',
            zIndex: 0,
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
          {/* Welcome */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '16px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
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
              Por favor, inserte su tarjeta para comenzar
              a operar de forma segura.
            </p>
          </div>

          {/* Card Section */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
              aspectRatio: '16/9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Card */}
            <button
              onClick={() =>
                setCardInserted(!cardInserted)
              }
              style={{
                ...glassStyle,
                width: '288px',
                height: '176px',
                borderRadius: '12px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border:
                  '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: cardInserted
                  ? '0 0 50px rgba(74, 225, 118, 0.35)'
                  : '0 0 50px rgba(74, 225, 118, 0.15)',
                transform: cardInserted
                  ? 'scale(1.03)'
                  : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '48px',
                  height: '32px',
                  background:
                    'rgba(177, 199, 242, 0.2)',
                  borderRadius: '6px',
                }}
              />

              <div style={{ marginTop: 'auto' }}>
                <div
                  style={{
                    width: '50%',
                    height: '16px',
                    background:
                      'rgba(255, 255, 255, 0.2)',
                    borderRadius: '9999px',
                    marginBottom: '8px',
                  }}
                />

                <div
                  style={{
                    width: '75%',
                    height: '16px',
                    background:
                      'rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '32px',
                  width: '40px',
                  height: '32px',
                  background:
                    'rgba(74, 225, 118, 0.3)',
                  borderRadius: '4px',
                  border:
                    '1px solid rgba(74, 225, 118, 0.5)',
                }}
              />
            </button>

            {/* Slot */}
            <div
              style={{
                width: '320px',
                height: '16px',
                background: '#2d3449',
                borderRadius: '9999px',
                marginTop: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  'inset 0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              <div
                style={{
                  width: '288px',
                  height: '4px',
                  background: '#4ae176',
                  borderRadius: '9999px',
                  boxShadow:
                    '0 0 15px rgba(74,225,118,0.8)',
                  animation:
                    'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#4ae176',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '32px' }}
              >
                credit_card
              </span>

              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {cardInserted
                  ? 'Tarjeta Detectada'
                  : 'Inserte Tarjeta'}
              </span>
            </div>
          </div>

          {/* Language Buttons */}
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
            {/* ESPAÑOL */}
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
                      color: '#dae2fd',
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

              <span
                className="material-symbols-outlined"
                style={{ color: '#c4c6cf' }}
              >
                chevron_right
              </span>
            </button>

            {/* ENGLISH */}
            <button
              style={{
                ...glassStyle,
                padding: '24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderLeft: '4px solid #b1c7f2',
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
                    color: '#b1c7f2',
                  }}
                >
                  public
                </span>

                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#dae2fd',
                    }}
                  >
                    English
                  </div>

                  <div
                    style={{
                      fontSize: '16px',
                      color: '#c4c6cf',
                    }}
                  >
                    Continue in English
                  </div>
                </div>
              </div>

              <span
                className="material-symbols-outlined"
                style={{ color: '#c4c6cf' }}
              >
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.5;
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