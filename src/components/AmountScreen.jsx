import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const AmountScreen = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("0");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cuentaSeleccionada = JSON.parse(localStorage.getItem("cuentaSeleccionada"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr =
                now.getHours().toString().padStart(2, "0") +
                ":" +
                now.getMinutes().toString().padStart(2, "0");
            setTime(timeStr);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    const appendNum = (num) => {
        if (amount === "0") {
            setAmount(num);
            return;
        }
        if (amount.length < 7) {
            setAmount(amount + num);
        }
        setError("");
    };

    const backspace = () => {
        if (amount.length > 1) {
            setAmount(amount.slice(0, -1));
        } else {
            setAmount("0");
        }
        setError("");
    };

    const clearDisplay = () => {
        setAmount("0");
        setError("");
    };

    const isValidAmount = (monto) => {
        return monto % 50 === 0;
    };

    const handleConfirm = async () => {
        const montoNumerico = Number(amount);
        
        if (montoNumerico === 0) {
            setError("Ingrese un monto válido");
            return;
        }

        if (montoNumerico < 50) {
            setError("El monto mínimo es Q50");
            return;
        }

        if (montoNumerico > 5000) {
            setError("El monto máximo es Q5,000");
            return;
        }

        if (!isValidAmount(montoNumerico)) {
            setError("El cajero solo dispensa billetes de Q50. Ingrese un monto múltiplo de 50 (50, 100, 150, 200, 250, 300, etc.)");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Sesión no encontrada");
                navigate("/");
                return;
            }

            if (!cuentaSeleccionada) {
                alert("No hay cuenta seleccionada");
                navigate("/account-selection");
                return;
            }

            if (!usuario) {
                alert("Usuario no encontrado");
                navigate("/");
                return;
            }

            const response = await fetch("https://cajero-online.onrender.com/api/cajero/retiro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    id_cuenta: cuentaSeleccionada.id_cuenta,
                    monto: montoNumerico,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                alert(data.message || "Error realizando retiro");
                return;
            }

            // Guardar info del último retiro
            localStorage.setItem("ultimoRetiro", JSON.stringify({
                monto: montoNumerico,
                saldo_actual: data.saldo_actual,
                cuenta: cuentaSeleccionada.numero_cuenta
            }));

            // Navegar a success
            navigate("/success", {
                state: {
                    amount: montoNumerico,
                    saldo: data.saldo_actual
                }
            });

        } catch (error) {
            console.error(error);
            setLoading(false);
            alert("Error conectando al servidor");
        }
    };

    // GLASS STYLE
    const glassStyle = {
        background: "rgba(23, 31, 51, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(142, 144, 153, 0.15)",
    };

    // BUTTON STYLE
    const keypadButtonStyle = {
        ...glassStyle,
        height: "95px",
        borderRadius: "18px",
        border: "none",
        cursor: "pointer",
        fontSize: "34px",
        fontWeight: "500",
        color: "#dae2fd",
        transition: "all 0.25s ease",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                background: "#0b1326",
                color: "#dae2fd",
                fontFamily: "Inter, sans-serif",
                overflow: "hidden",
                backgroundImage: `
                    radial-gradient(circle at top left, rgba(74,225,118,0.08), transparent 30%),
                    radial-gradient(circle at bottom right, rgba(177,199,242,0.08), transparent 30%)
                `,
            }}
        >
            {/* HEADER - Estándar fijo */}
            <header
                style={{
                    background: "rgba(23, 31, 51, 0.8)",
                    backdropFilter: "blur(40px)",
                    borderBottom: "1px solid rgba(68, 71, 78, 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 40px",
                    height: "80px",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#b1c7f2",
                        letterSpacing: "0.5px",
                    }}
                >
                     ✦ SECUREBANK | ATM
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        color: "#c4c6cf",
                    }}
                >
                    <span className="material-symbols-outlined">wifi</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="material-symbols-outlined">schedule</span>
                        <span>{time}</span>
                    </div>
                </div>
            </header>

            {/* MAIN - Centrado vertical y horizontalmente */}
            <main
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflowY: "auto",
                    padding: "100px 20px 20px 20px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "1100px",
                        margin: "0 auto",
                    }}
                >
                    {/* Mostrar cuenta seleccionada */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "16px",
                            color: "#c4c6cf",
                            fontSize: "16px",
                        }}
                    >
                        Cuenta: 
                        <span style={{ color: "#4ae176", marginLeft: "8px", fontWeight: "700" }}>
                            {cuentaSeleccionada?.numero_cuenta || "No seleccionada"}
                        </span>
                    </div>

                    {/* TITLE */}
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "28px",
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "42px",
                                fontWeight: "700",
                                marginBottom: "8px",
                            }}
                        >
                            Ingrese el Monto
                        </h1>
                        <p
                            style={{
                                color: "#c4c6cf",
                                fontSize: "18px",
                            }}
                        >
                            Mínimo Q50 - Máximo Q5,000 (Múltiplos de Q50)
                        </p>
                    </div>

                    {/* DISPLAY */}
                    <div
                        style={{
                            ...glassStyle,
                            width: "100%",
                            padding: "30px",
                            borderRadius: "28px",
                            marginBottom: "28px",
                            textAlign: "center",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "56px",
                                    fontWeight: "700",
                                    color: "#4ae176",
                                }}
                            >
                                Q
                            </span>
                            <span
                                style={{
                                    fontSize: "56px",
                                    fontWeight: "700",
                                }}
                            >
                                {Number(amount).toLocaleString("es-GT")}
                            </span>
                        </div>
                        <div
                            style={{
                                width: "100px",
                                height: "3px",
                                background: "#4ae176",
                                margin: "14px auto 0",
                                borderRadius: "999px",
                                boxShadow: "0 0 16px rgba(74,225,118,0.6)",
                            }}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            style={{
                                background: "rgba(255,180,171,0.15)",
                                border: "1px solid rgba(255,180,171,0.3)",
                                borderRadius: "16px",
                                padding: "12px 20px",
                                marginBottom: "20px",
                                textAlign: "center",
                                color: "#ffb4ab",
                                fontSize: "14px",
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    {/* CONTENT - Grid 2 columnas */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1.2fr 1fr",
                            gap: "28px",
                        }}
                    >
                        {/* KEYPAD */}
                        <div
                            style={{
                                ...glassStyle,
                                borderRadius: "28px",
                                padding: "20px",
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "14px",
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => appendNum(num.toString())}
                                    style={keypadButtonStyle}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(0.98)";
                                        e.currentTarget.style.background = "rgba(74,225,118,0.15)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.background = "rgba(23, 31, 51, 0.6)";
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={clearDisplay}
                                style={{
                                    ...keypadButtonStyle,
                                    color: "#ffb4ab",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(0.98)";
                                    e.currentTarget.style.background = "rgba(255,180,171,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.background = "rgba(23, 31, 51, 0.6)";
                                }}
                            >
                                C
                            </button>
                            <button
                                onClick={() => appendNum("0")}
                                style={keypadButtonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(0.98)";
                                    e.currentTarget.style.background = "rgba(74,225,118,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.background = "rgba(23, 31, 51, 0.6)";
                                }}
                            >
                                0
                            </button>
                            <button
                                onClick={backspace}
                                style={keypadButtonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(0.98)";
                                    e.currentTarget.style.background = "rgba(74,225,118,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.background = "rgba(23, 31, 51, 0.6)";
                                }}
                            >
                                ⌫
                            </button>
                        </div>

                        {/* RIGHT PANEL */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            {/* INFO */}
                            <div
                                style={{
                                    ...glassStyle,
                                    borderRadius: "28px",
                                    padding: "24px",
                                }}
                            >
                                <div style={{ display: "flex", gap: "16px" }}>
                                    <div
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "50%",
                                            background: "rgba(74,225,118,0.12)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: "#4ae176", fontSize: "28px" }}
                                        >
                                            info
                                        </span>
                                    </div>
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: "26px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            Confirmación
                                        </h3>
                                        <p
                                            style={{
                                                color: "#c4c6cf",
                                                lineHeight: 1.5,
                                                fontSize: "16px",
                                            }}
                                        >
                                            Verifique que el monto ingresado sea correcto
                                            antes de continuar.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CONFIRM BUTTON */}
                            <button
                                onClick={handleConfirm}
                                style={{
                                    background: "#00c853",
                                    color: "#06210f",
                                    height: "100px",
                                    borderRadius: "28px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "28px",
                                    fontWeight: "800",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "12px",
                                    boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                                    transition: "all 0.25s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(0.98)";
                                    e.currentTarget.style.background = "#00e05a";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.background = "#00c853";
                                }}
                            >
                                Confirmar Retiro
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontVariationSettings: "'FILL' 1", fontSize: "32px" }}
                                >
                                    check_circle
                                </span>
                            </button>

                            {/* Sugerencias de montos válidos */}
                            <div
                                style={{
                                    ...glassStyle,
                                    borderRadius: "28px",
                                    padding: "20px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "14px",
                                        color: "#c4c6cf",
                                        marginBottom: "12px",
                                    }}
                                >
                                    Montos sugeridos (múltiplos de 50):
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        justifyContent: "center",
                                        gap: "10px",
                                    }}
                                >
                                    {[50, 100, 200, 300, 500, 1000, 2000, 5000].map((sugerido) => (
                                        <button
                                            key={sugerido}
                                            onClick={() => {
                                                setAmount(sugerido.toString());
                                                setError("");
                                            }}
                                            style={{
                                                background: "rgba(74,225,118,0.15)",
                                                border: "1px solid rgba(74,225,118,0.3)",
                                                borderRadius: "20px",
                                                padding: "8px 16px",
                                                color: "#4ae176",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(74,225,118,0.3)";
                                                e.currentTarget.style.transform = "scale(1.05)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(74,225,118,0.15)";
                                                e.currentTarget.style.transform = "scale(1)";
                                            }}
                                        >
                                            Q{sugerido.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* BOTTOM NAV */}
            <nav
                style={{
                    position: "relative",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px 40px",
                    background: "rgba(6, 14, 32, 0.9)",
                    backdropFilter: "blur(32px)",
                    borderTop: "1px solid rgba(68, 71, 78, 0.3)",
                    boxShadow: "0px -10px 30px rgba(0,0,0,0.4)",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#c4c6cf",
                        padding: "8px 48px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#c4c6cf";
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "28px", marginBottom: "2px" }}>
                        arrow_back
                    </span>
                    <span>Regresar</span>
                </button>

                <div style={{ height: "30px", width: "1px", background: "rgba(68, 71, 78, 0.3)" }} />

                <button
                    onClick={() => navigate("/")}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#c4c6cf",
                        padding: "8px 48px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#c4c6cf";
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "28px", marginBottom: "2px" }}>
                        logout
                    </span>
                    <span>Salir</span>
                </button>
            </nav>
        </div>
    );
};

export default AmountScreen;