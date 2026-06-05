import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";


const MovementsScreen = () => {

    const navigate = useNavigate();

    const [transacciones, setTransacciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displaySaldo, setDisplaySaldo] = useState(0);
    const [revealedRows, setRevealedRows] = useState([]);

    const cuenta = JSON.parse(localStorage.getItem("cuentaMovimientos"));
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // Count-up animation
    useEffect(() => {
        if (!cuenta?.saldo) return;
        const target = Number(cuenta.saldo);
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setDisplaySaldo(target * ease);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [cuenta?.saldo]);

    useEffect(() => {
        const obtenerMovimientos = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token || !usuario) {
                    alert("Sesión no encontrada");
                    navigate("/");
                    return;
                }

                const response = await fetch(
                    `https://cajero-online.onrender.com/api/cajero/transacciones/${usuario.id_usuario}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Error obteniendo movimientos");
                    return;
                }

                const filtradas = data.transacciones.filter(
                    (t) =>
                        Number(t.id_cuenta_origen) === Number(cuenta?.id_cuenta) ||
                        Number(t.id_cuenta_destino) === Number(cuenta?.id_cuenta)
                );

                setTransacciones(filtradas);

                // Staggered reveal
                filtradas.forEach((_, i) => {
                    setTimeout(() => {
                        setRevealedRows(prev => [...prev, i]);
                    }, 400 + i * 100);
                });

            } catch (error) {
                console.error(error);
                alert("Error conectando al servidor");
            } finally {
                setLoading(false);
            }
        };

        obtenerMovimientos();
    }, [navigate]);

    const handleRipple = (e) => {
        const btn = e.currentTarget;
        const ripple = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            transform: scale(0);
            animation: ripple-anim 0.6s linear;
            width: ${diameter}px;
            height: ${diameter}px;
            left: ${e.clientX - rect.left - radius}px;
            top: ${e.clientY - rect.top - radius}px;
            pointer-events: none;
        `;
        const old = btn.querySelector(".ripple-el");
        if (old) old.remove();
        ripple.classList.add("ripple-el");
        btn.appendChild(ripple);
    };

    const getIcono = (tipo) => {
        switch (tipo) {
            case "Retiro": return "atm";
            case "Deposito": return "south_west";
            case "Transferencia": return "sync_alt";
            default: return "receipt_long";
        }
    };

    const getColor = (tipo, id_cuenta_destino) => {
        if (tipo === "Deposito") return "#4ae176";
        if (tipo === "Transferencia" && Number(id_cuenta_destino) === Number(cuenta?.id_cuenta)) return "#4ae176";
        return "#c4c6cf";
    };

    const getMonto = (t) => {
        const esIngreso =
            t.tipo_transaccion === "Deposito" ||
            (t.tipo_transaccion === "Transferencia" && Number(t.id_cuenta_destino) === Number(cuenta?.id_cuenta));
        return { signo: esIngreso ? "+" : "-", color: esIngreso ? "#4ae176" : "#dae2fd" };
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-GT", {
            day: "2-digit", month: "short", year: "numeric",
        });
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div style={{ height: "100vh", background: "#0b1326", color: "#dae2fd", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>

            <style>{`
                @keyframes fadeInDown {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes spring-in {
                    0% { transform: translateY(-40px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-50%) rotate(45deg); }
                    100% { transform: translateX(50%) rotate(45deg); }
                }
                @keyframes float {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(20px, 30px) scale(1.1); }
                }
                @keyframes ripple-anim {
                    to { transform: scale(4); opacity: 0; }
                }
                @keyframes move-wave {
                    0% { transform: translate(-25%, 20%) scale(1); }
                    100% { transform: translate(0, 0) scale(1.2); }
                }
                .glass-card-shimmer {
                    background: rgba(45, 52, 73, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    overflow: hidden;
                }
                .glass-card-shimmer::before {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(177, 199, 242, 0.03), transparent);
                    transform: rotate(45deg);
                    animation: shimmer 10s infinite linear;
                    pointer-events: none;
                }
                .transaction-row-reveal {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .transaction-row-reveal.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
                .transaction-row-reveal:hover {
                    background: rgba(49, 57, 77, 0.3);
                }
                .transaction-row-reveal::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 0;
                    background: #4ae176;
                    transition: width 0.3s ease;
                }
                .transaction-row-reveal:hover::after {
                    width: 4px;
                }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-thumb { background: rgba(177,199,242,0.25); border-radius: 10px; }
            `}</style>

            {/* Ocean wave ambient */}
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.15, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "200%", height: "100%", background: "radial-gradient(circle at 50% 50%, #1e3a8a 0%, transparent 70%)", animation: "move-wave 25s infinite alternate ease-in-out" }} />
                <div style={{ position: "absolute", bottom: 0, left: "-50%", width: "200%", height: "100%", background: "radial-gradient(circle at 50% 50%, #1e3a8a 0%, transparent 70%)", animation: "move-wave 35s infinite alternate ease-in-out", animationDelay: "-5s", opacity: 0.5 }} />
            </div>

            {/* Blobs */}
            <div style={{ position: "fixed", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "rgba(177,199,242,0.05)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", animation: "float 20s ease-in-out infinite alternate", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "rgba(74,225,118,0.05)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", animation: "float 20s ease-in-out infinite alternate", animationDelay: "-5s", zIndex: 0 }} />

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

            {/* Main */}
            <main style={{
                paddingTop: "90px", paddingBottom: "120px", paddingLeft: "20px", paddingRight: "20px",
                maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2,
                display: "flex", flexDirection: "column", gap: "20px", height: "100%", boxSizing: "border-box",
            }}>

                {/* Resumen */}
                <section
                    className="glass-card-shimmer"
                    style={{
                        borderLeft: "4px solid #4ae176", borderRadius: "12px", padding: "20px",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        flexShrink: 0, animation: "spring-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                    }}
                >
                    <div>
                        <p style={{ fontSize: "10px", color: "#c4c6cf", marginBottom: "4px" }}>Saldo Disponible</p>
                        <h2 style={{ fontSize: "20px", margin: 0 }}>No. {cuenta?.numero_cuenta}</h2>
                        <p style={{ fontSize: "32px", fontWeight: "700", color: "#4ae176", margin: 0 }}>
                            Q {displaySaldo.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "#4ae176" }}>
                        {cuenta?.tipo_cuenta === "Monetaria" ? "account_balance_wallet" : "savings"}
                    </span>
                </section>

                {/* Movimientos */}
                <section style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, minHeight: 0, paddingBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ fontSize: "18px", margin: 0 }}>Movimientos Recientes</h3>
                        <span style={{ fontSize: "12px", color: "#c4c6cf" }}>{transacciones.length} transacciones</span>
                    </div>

                    <div className="glass-card-shimmer" style={{ borderRadius: "12px", overflowY: "auto", overflowX: "hidden", flex: 1, minHeight: 0, marginBottom: "10px" }}>
                        {transacciones.length === 0 ? (
                            <div style={{ height: "100%", minHeight: "320px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 20px" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(177,199,242,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: "42px", color: "#b1c7f2" }}>receipt_long</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: "20px", color: "#dae2fd" }}>No tienes movimientos</h3>
                                <p style={{ marginTop: "8px", color: "#8b93a7", fontSize: "14px" }}>Tus transacciones aparecerán aquí.</p>
                            </div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                                    <tr style={{ background: "rgba(34,42,61,0.95)", backdropFilter: "blur(10px)" }}>
                                        <th style={{ padding: "14px 18px", textAlign: "left", fontSize: "11px", color: "#c4c6cf" }}>Fecha</th>
                                        <th style={{ padding: "14px 18px", textAlign: "left", fontSize: "11px", color: "#c4c6cf" }}>Descripción</th>
                                        <th style={{ padding: "14px 18px", textAlign: "right", fontSize: "11px", color: "#c4c6cf" }}>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transacciones.map((t, index) => {
                                        const { signo, color } = getMonto(t);
                                        const iconColor = getColor(t.tipo_transaccion, t.id_cuenta_destino);
                                        const isRevealed = revealedRows.includes(index);

                                        return (
                                            <tr
                                                key={t.id_transaccion}
                                                className={`transaction-row-reveal${isRevealed ? " revealed" : ""}`}
                                                style={{ borderTop: "1px solid rgba(68,71,78,0.2)", cursor: "pointer" }}
                                                onClick={handleRipple}
                                            >
                                                <td style={{ padding: "14px 18px", fontSize: "13px", color: "#c4c6cf" }}>
                                                    {formatFecha(t.fecha_transaccion)}
                                                </td>
                                                <td style={{ padding: "14px 18px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: iconColor }}>
                                                                {getIcono(t.tipo_transaccion)}
                                                            </span>
                                                        </div>
                                                        <span style={{ fontSize: "14px" }}>{t.descripcion || t.tipo_transaccion}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 18px", textAlign: "right", fontSize: "15px", fontWeight: "700", color }}>
                                                    {signo}Q {Number(t.monto).toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </main>

            {/* Navbar */}
            <nav style={{
                position: "fixed", bottom: 0, left: 0, right: 0,
                display: "flex", justifyContent: "center", alignItems: "center", gap: "16px",
                padding: "20px 40px", background: "rgba(6,14,32,0.9)", backdropFilter: "blur(32px)",
                borderTop: "1px solid rgba(68,71,78,0.3)", zIndex: 50,
            }}>
                <button
                    onClick={(e) => { handleRipple(e); navigate(-1); }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#c4c6cf", padding: "12px 48px", background: "transparent", border: "none", cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(177,199,242,0.1)"; e.currentTarget.style.color = "#b1c7f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>arrow_back</span>
                    <span>Regresar</span>
                </button>
                <div style={{ height: "32px", width: "1px", background: "rgba(68,71,78,0.3)" }} />
                <button
                    onClick={(e) => { handleRipple(e); navigate("/"); }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#c4c6cf", padding: "12px 48px", background: "transparent", border: "none", cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: "12px", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,180,171,0.1)"; e.currentTarget.style.color = "#ffb4ab"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c4c6cf"; }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "32px", marginBottom: "4px" }}>logout</span>
                    <span>Salir</span>
                </button>
            </nav>
        </div>
    );
};

export default MovementsScreen;