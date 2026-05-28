import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PINKeypad = () => {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const maxPinLength = 4;

  const handleNumberClick = (num) => {
    if (pin.length < maxPinLength) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleConfirm = async () => {
    if (pin.length !== maxPinLength) return;

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/cajero/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username: "axelavila",
            password: pin,
          }),
        }
      );

      const data = await response.json();

      console.log("RESPUESTA LOGIN:", data);

      if (!response.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      // GUARDAR USUARIO
      localStorage.setItem(
        "usuario", 
        JSON.stringify(data.usuario)
      );
      localStorage.setItem(
        "token", 
        data.token
      );

      console.log(
        "USUARIO GUARDADO:",
        JSON.parse(localStorage.getItem("usuario"))
      );

      navigate("/main");

    } catch (error) {
      console.error(error);
      alert("Error conectando al servidor");
    } finally {
      setLoading(false);
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
    background: "rgba(23, 31, 51, 0.6)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(142, 144, 153, 0.15)",
  };

  const keypadButtonStyle = {
    ...glassStyle,
    padding: "24px 18px",
    borderRadius: "16px",
    fontSize: "28px",
    fontWeight: "500",
    color: "#dae2fd",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
      }}
    >
      {/* MAIN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Ingrese su PIN
        </h1>

        <p
          style={{
            color: "#c4c6cf",
            marginBottom: "30px",
          }}
        >
          Inicie sesión para continuar
        </p>

        {/* PIN DISPLAY */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          {getPinDisplay().map((filled, index) => (
            <div
              key={index}
              style={{
                width: "60px",
                height: "70px",
                borderRadius: "16px",
                ...glassStyle,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: filled
                  ? "2px solid #4ae176"
                  : "2px solid rgba(142,144,153,0.2)",
              }}
            >
              {filled && (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: "#4ae176",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* KEYPAD */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "14px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          {[1,2,3,4,5,6,7,8,9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={keypadButtonStyle}
            >
              {num}
            </button>
          ))}

          {/* DELETE */}
          <button
            onClick={handleDelete}
            style={{
              ...keypadButtonStyle,
              color: "#ffb4ab",
            }}
          >
            ⌫
          </button>

          {/* 0 */}
          <button
            onClick={() => handleNumberClick(0)}
            style={keypadButtonStyle}
          >
            0
          </button>

          {/* CONFIRM */}
          <button
            onClick={handleConfirm}
            disabled={pin.length !== 4 || loading}
            style={{
              ...keypadButtonStyle,
              background:
                pin.length === 4
                  ? "#4ae176"
                  : "rgba(74,225,118,0.2)",

              color:
                pin.length === 4
                  ? "#0b1326"
                  : "#4ae176",

              fontWeight: "800",
            }}
          >
            {loading ? "..." : "✓"}
          </button>
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
    </div>
    
  );
};

export default PINKeypad;