import React, { useEffect, useState } from "react";

const LoadingScreen = ({ message = "Procesando..." }) => {

    const [loadingText, setLoadingText] = useState("Iniciando sistema seguro...");

    const messages = [
        "Iniciando sistema seguro...",
        "Sincronizando con red SecureBank...",
        "Verificando protocolos de seguridad...",
        "Estableciendo túnel encriptado...",
        "Finalizando conexión...",
    ];

    // Cambio de mensajes
    useEffect(() => {
        let index = 0;

        const interval = setInterval(() => {
            index++;

            if (index >= messages.length) {
                index = 0;
            }

            setLoadingText(messages[index]);

        }, 1800);

        return () => clearInterval(interval);

    }, []);

    // Particles
    useEffect(() => {
        const container = document.getElementById("particle-container-loading");

        if (!container) return;

        container.innerHTML = "";

        for (let i = 0; i < 40; i++) {

            const p = document.createElement("div");

            const size = (Math.random() * 4 + 2) + "px";

            p.style.cssText = `
                position: absolute;
                background: #4ae176;
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                width: ${size};
                height: ${size};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: bioluminescence ${Math.random() * 10 + 10}s ease-in-out ${Math.random() * 5}s infinite;
            `;

            container.appendChild(p);
        }

    }, []);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background:
                    "radial-gradient(circle at center, #131b2e 0%, #060e20 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
                color: "#dae2fd",
                overflow: "hidden",
            }}
        >

            <style>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.33); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                @keyframes float-anim {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes bioluminescence {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.2); }
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce-dot {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-6px);
                    }
                }
            `}</style>

            {/* Particles */}
            <div
                id="particle-container-loading"
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                }}
            />

            {/* Bank name */}
            <div
                style={{
                    position: "absolute",
                    top: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    animation: "fadeInDown 1s ease-out forwards",
                }}
            >
                <span
                    className="material-symbols-outlined"
                    style={{
                        color: "#b1c7f2",
                        fontSize: "48px",
                        marginBottom: "8px",
                        fontVariationSettings: "'FILL' 1",
                    }}
                >
                    account_balance
                </span>

                <h1
                    style={{
                        fontSize: "28px",
                        fontWeight: "900",
                        color: "#b1c7f2",
                        letterSpacing: "-0.02em",
                        margin: 0,
                    }}
                >
                     ✦ SECUREBANK | ATM
                </h1>
            </div>

            {/* Loader visual */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "256px",
                    height: "256px",
                    zIndex: 1,
                }}
            >

                {/* Pulse rings */}
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: `1px solid rgba(177,199,242,${
                                0.2 - i * 0.05
                            })`,
                            animation: `pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) ${i}s infinite`,
                        }}
                    />
                ))}

                {/* Floating glass circle */}
                <div
                    style={{
                        animation: "float-anim 4s ease-in-out infinite",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                   <div
    style={{
        width: "128px",
        height: "128px",
        borderRadius: "50%",
        backdropFilter: "blur(20px)",
        background: "rgba(11,19,38,0.4)",
        border:
            "1px solid rgba(177,199,242,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
            "0 20px 60px rgba(0,0,0,0.5)",
    }}
>
    <span
        className="material-symbols-outlined"
        style={{
            color: "#4ae176",
            fontSize: "54px",
            fontVariationSettings: "'FILL' 1",
        }}
    >
        account_balance
    </span>
</div>
                </div>
            </div>

            {/* Text */}
            <div
                style={{
                    marginTop: "48px",
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                <p
                    style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#c4c6cf",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.8,
                    }}
                >
                    {loadingText}
                </p>

                {/* Dots */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                        marginTop: "16px",
                    }}
                >
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <div
                            key={i}
                            style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#4ae176",
                                animation:
                                    `bounce-dot 1s ease-in-out ${delay}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;