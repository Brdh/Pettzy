document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirmar").value;
    const msg = document.getElementById("msg");

    if (senha !== confirmar) {
        msg.style.color = "red";
        msg.textContent = "As senhas não coincidem!";
        return;
    }

    // pegar token da URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        msg.style.color = "red";
        msg.textContent = "Token inválido ou ausente!";
        return;
    }

    try {
        const response = await fetch(`https://pettzy-backend.onrender.com/api/auth/reset-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                novaSenha: senha
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            msg.style.color = "red";
            msg.textContent = data.message || "Erro ao redefinir senha.";
            return;
        }

        msg.style.color = "green";
        msg.textContent = "Senha redefinida com sucesso!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        msg.style.color = "red";
        msg.textContent = "Erro de conexão com o servidor.";
    }
});
