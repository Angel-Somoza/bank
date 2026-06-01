import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BalanceScreen = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerCuentas = async () => {
            try {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                const token = localStorage.getItem("token");

                if (!usuario || !token) {
                    alert("Sesión no encontrada");
                    navigate("/");
                    return;
                }

                const response = await fetch(
                    "http://localhost:3000/api/cajero/cuentas",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ idCliente: usuario.id_cliente }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Error obteniendo cuentas");
                    return;
                }

                setAccounts(data.cuentas);
            } catch (error) {
                console.error(error);
                alert("Error conectando al servidor");
            } finally {
                setLoading(false);
            }
        };

        obtenerCuentas();
    }, [navigate]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#0b1326", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "32px", fontWeight: "bold" }}>
                Cargando cuentas...
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#0b1326", color: "#dae2fd", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}>
            {/* Header */}
            <header style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "80px", background: "rgba(23,31,51,0.8)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(68,71,78,0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", zIndex: 50, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "24px", fontWeight: "800", color: "#b1c7f2", letterSpacing: "1px" }}>SECUREBANK</span>
                    <div style={{ height: "24px", width: "1px", background: "rgba(68,71,78,0.5)", margin: "0 8px" }} />
                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#b1c7f2" }}>Consulta de Saldo</h1>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#b1c7f2", fontSize: "28px" }}>wifi</span>
                    <span className="material-symbols-outlined" style={{ color: "#b1c7f2", fontSize: "28px" }}>schedule</span>
                </div>
            </header>

            {/* Blobs */}
            <div style={{ position: "absolute", top: "-160px", right: "-160px", width: "384px", height: "384px", background: "rgba(74,225,118,0.08)", borderRadius: "50%", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: "-160px", left: "-160px", width: "384px", height: "384px", background: "rgba(177,199,242,0.08)", borderRadius: "50%", filter: "blur(80px)" }} />

            {/* Main */}
            <main style={{ paddingTop: "120px", paddingBottom: "120px", paddingLeft: "40px", paddingRight: "40px", maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontSize: "48px", fontWeight: "800", marginBottom: "12px" }}>Mis Cuentas</h2>
                    <p style={{ color: "#c4c6cf", fontSize: "20px" }}>Consulta el saldo de tus cuentas disponibles.</p>
                </div>

                {accounts.length === 0 && (
                    <div style={{ textAlign: "center", color: "#ffb4ab", fontSize: "24px", fontWeight: "bold" }}>
                        No se encontraron cuentas
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 480px))", gap: "32px", justifyContent: "center" }}>
                    {accounts.map((account) => {
                        const defaultColor = "#b1c7f2";
                        const hoverColor = "#4ae176";

                        return (
                            <div
                                key={account.id_cuenta}
                                style={{
                                    background: "rgba(23, 31, 51, 0.4)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(142, 144, 153, 0.1)",
                                    borderLeft: `4px solid ${defaultColor}`,
                                    borderRadius: "16px",
                                    padding: "40px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "24px",
                                    transition: "transform 0.2s ease",
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.01)";
                                    e.currentTarget.style.borderLeft = `4px solid ${hoverColor}`;
                                    e.currentTarget.querySelector(".card-icon").style.color = hoverColor;
                                    e.currentTarget.querySelector(".card-saldo").style.color = hoverColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.borderLeft = `4px solid ${defaultColor}`;
                                    e.currentTarget.querySelector(".card-icon").style.color = defaultColor;
                                    e.currentTarget.querySelector(".card-saldo").style.color = defaultColor;
                                }}
                            >
                                {/* Card Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <p style={{ fontSize: "12px", fontWeight: "600", color: "#c4c6cf", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Tipo de Cuenta</p>
                                        <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#dae2fd" }}>
                                            {account.tipo_cuenta === "Monetaria" ? "Cuenta Monetaria" : "Cuenta de Ahorro"}
                                        </h3>
                                    </div>
                                    <span
                                        className="material-symbols-outlined card-icon"
                                        style={{ fontSize: "36px", color: defaultColor, transition: "color 0.2s ease" }}
                                    >
                                        {account.tipo_cuenta === "Monetaria" ? "account_balance_wallet" : "savings"}
                                    </span>
                                </div>

                                {/* Saldo y número */}
                                <div style={{ borderTop: "1px solid rgba(68,71,78,0.3)", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div>
                                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#c4c6cf", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>Saldo Disponible</p>
                                        <p
                                            className="card-saldo"
                                            style={{ fontSize: "48px", fontWeight: "700", color: defaultColor, transition: "color 0.2s ease" }}
                                        >
                                            Q {Number(account.saldo).toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* No. cuenta */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(45,52,73,0.4)", padding: "16px", borderRadius: "12px" }}>
                                        <span style={{ fontSize: "16px", color: "#c4c6cf" }}>No. de Cuenta</span>
                                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#dae2fd", letterSpacing: "0.05em" }}>{account.numero_cuenta}</span>
                                    </div>

                                    {/* Botón movimientos */}
                                    <button
                                        onClick={() => {
                                            localStorage.setItem("cuentaMovimientos", JSON.stringify(account));
                                            navigate("/movimientos");
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "16px",
                                            background: "transparent",
                                            border: "1px solid rgba(142, 144, 153, 0.2)",
                                            borderRadius: "12px",
                                            color: "#dae2fd",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "rgba(74,225,118,0.1)";
                                            e.currentTarget.style.borderColor = "#4ae176";
                                            e.currentTarget.style.color = "#4ae176";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.borderColor = "rgba(142, 144, 153, 0.2)";
                                            e.currentTarget.style.color = "#dae2fd";
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>receipt_long</span>
                                        Ver Movimientos
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Bottom Nav */}
            <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", padding: "20px 40px", background: "rgba(6,14,32,0.9)", backdropFilter: "blur(32px)", borderTop: "1px solid rgba(68,71,78,0.3)", boxShadow: "0px -10px 30px rgba(0,0,0,0.4)", borderTopLeftRadius: "12px", borderTopRightRadius: "12px", zIndex: 50 }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#c4c6cf", padding: "12px 48px", background: "transparent", border: "none", cursor: "pointer", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(177,199,242,0.1)"; e.currentTarget.style.color = "#b1c7f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>arrow_back</span>
                    <span>Regresar</span>
                </button>
                <div style={{ height: "32px", width: "1px", background: "rgba(68,71,78,0.3)" }} />
                <button
                    onClick={() => navigate("/")}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#c4c6cf", padding: "12px 48px", background: "transparent", border: "none", cursor: "pointer", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,180,171,0.1)"; e.currentTarget.style.color = "#ffb4ab"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>logout</span>
                    <span>Salir</span>
                </button>
            </nav>

            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", height: "1px", background: "linear-gradient(to right, transparent, #4ae176, transparent)", opacity: 0.3 }} />
        </div>
    );
};

export default BalanceScreen;