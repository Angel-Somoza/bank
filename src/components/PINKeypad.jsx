import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const PINKeypad = () => {
  const navigate = useNavigate();

  const [pin, setPin] = useState('');
  const maxPinLength = 4;

  const handleNumberClick = (num) => {
    if (pin.length < maxPinLength) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

const handleConfirm = () => {
  if (pin.length === maxPinLength) {
    console.log('PIN ingresado:', pin);

    // navegar al main
    navigate("/main");
  }
};

  const getPinDisplay = () => {
    const display = [];
    for (let i = 0; i < maxPinLength; i++) {
      display.push(i < pin.length);
    }
    return display;
  };

  const glassStyle = {
    background: 'rgba(23, 31, 51, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(142, 144, 153, 0.15)',
  };

  const keypadButtonStyle = {
    ...glassStyle,
    padding: '24px 18px',
    borderRadius: '16px',
    fontSize: '28px',
    fontWeight: '500',
    color: '#dae2fd',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(142, 144, 153, 0.15)',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        background: '#0b1326',
        color: '#dae2fd',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          height: '64px',
          background: 'rgba(23, 31, 51, 0.8)',
          backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(68, 71, 78, 0.2)',
          flexShrink: 0,
          zIndex: 50,
          animation: 'fadeInDown 0.8s ease-out forwards',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              color: '#b1c7f2',
            }}
          >
            SECUREBANK
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#b1c7f2',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '22px' }}
            >
              wifi
            </span>

            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#c4c6cf',
              }}
            >
              Conectado
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '22px' }}
            >
              schedule
            </span>

            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#c4c6cf',
              }}
            >
              14:45
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          height: 'calc(100dvh - 64px - 92px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '12px 24px',
          flexShrink: 0,
        }}
      >
        {/* Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '420px',
            height: '420px',
            background: 'rgba(177, 199, 242, 0.08)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            animation: 'float 20s ease-in-out infinite alternate',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '320px',
            height: '320px',
            background: 'rgba(74, 225, 118, 0.08)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            animation: 'float 20s ease-in-out infinite alternate',
            animationDelay: '-5s',
          }}
        />

        {/* Header Message */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '12px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            opacity: 0,
            animationFillMode: 'forwards',
            animationDelay: '0.1s',
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: '34px',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              fontWeight: '700',
              marginBottom: '4px',
              color: '#dae2fd',
            }}
          >
            Ingrese su PIN
          </h1>

          <p
            style={{
              fontSize: '13px',
              lineHeight: '1.2',
              fontWeight: '400',
              color: '#c4c6cf',
            }}
          >
            Proteja su pantalla mientras ingresa sus dígitos
          </p>
        </div>

        {/* PIN Visualizer */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            opacity: 0,
            animationFillMode: 'forwards',
            animationDelay: '0.2s',
            zIndex: 1,
          }}
        >
          {getPinDisplay().map((isFilled, index) => (
            <div
              key={index}
              style={{
                width: '58px',
                height: '70px',
                ...glassStyle,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isFilled
                  ? '3px solid #4ae176'
                  : '3px solid rgba(142, 144, 153, 0.3)',
                boxShadow: isFilled
                  ? '0 0 20px rgba(74, 225, 118, 0.3)'
                  : '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              {isFilled && (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    background: '#4ae176',
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Keypad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '520px',
            animation: 'fadeInUp 0.8s ease-out forwards',
            opacity: 0,
            animationFillMode: 'forwards',
            animationDelay: '0.3s',
            zIndex: 1,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                ...keypadButtonStyle,
                animation:
                  'staggerIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 0 30px 2px rgba(177, 199, 242, 0.15)';
                e.currentTarget.style.transform =
                  'translateY(-4px) scale(1.02)';
                e.currentTarget.style.background =
                  'rgba(34, 42, 61, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 10px 30px rgba(0,0,0,0.3)';
                e.currentTarget.style.transform =
                  'translateY(0) scale(1)';
                e.currentTarget.style.background =
                  glassStyle.background;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-4px) scale(1.02)';
              }}
            >
              {num}
            </button>
          ))}

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={pin.length === 0}
            style={{
              ...keypadButtonStyle,
              color: '#ffb4ab',
              opacity: pin.length === 0 ? 0.5 : 1,
              cursor:
                pin.length === 0 ? 'not-allowed' : 'pointer',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '22px' }}
            >
              backspace
            </span>

            <span style={{ fontSize: '11px', fontWeight: '600' }}>
              BORRAR
            </span>
          </button>

          {/* 0 */}
          <button
            onClick={() => handleNumberClick(0)}
            style={{
              ...keypadButtonStyle,
              animation:
                'staggerIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 0 30px 2px rgba(177, 199, 242, 0.15)';
              e.currentTarget.style.transform =
                'translateY(-4px) scale(1.02)';
              e.currentTarget.style.background =
                'rgba(34, 42, 61, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                '0 10px 30px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform =
                'translateY(0) scale(1)';
              e.currentTarget.style.background =
                glassStyle.background;
            }}
          >
            0
          </button>

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            disabled={pin.length !== maxPinLength}
            style={{
              ...keypadButtonStyle,
              background:
                pin.length === maxPinLength
                  ? '#4ae176'
                  : 'rgba(74, 225, 118, 0.3)',
              color:
                pin.length === maxPinLength
                  ? '#0b1326'
                  : '#4ae176',
              cursor:
                pin.length === maxPinLength
                  ? 'pointer'
                  : 'not-allowed',
              boxShadow:
                pin.length === maxPinLength
                  ? '0px 10px 30px rgba(74, 225, 118, 0.3)'
                  : '0 10px 30px rgba(0,0,0,0.3)',
              flexDirection: 'column',
              gap: '6px',
              fontWeight: '700',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '22px' }}
            >
              check_circle
            </span>

            <span style={{ fontSize: '11px' }}>
              CONFIRMAR
            </span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        style={{
          height: '92px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingTop: '12px',
          paddingBottom: '12px',
          background: 'rgba(6, 14, 32, 0.9)',
          backdropFilter: 'blur(32px)',
          borderTop: '1px solid rgba(68, 71, 78, 0.3)',
          boxShadow: '0px -10px 30px rgba(0,0,0,0.4)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          zIndex: 50,
          flexShrink: 0,
          animation: 'fadeInUp 0.8s ease-out forwards',
        }}
      >
        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4c6cf',
            padding: '8px 36px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '28px', marginBottom: '2px' }}
          >
            cancel
          </span>

          <span>Cancel</span>
        </button>

        <div
          style={{
            height: '28px',
            width: '1px',
            background: 'rgba(68, 71, 78, 0.3)',
          }}
        />

        <button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4c6cf',
            padding: '8px 36px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '28px', marginBottom: '2px' }}
          >
            logout
          </span>

          <span>Exit</span>
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

export default PINKeypad;