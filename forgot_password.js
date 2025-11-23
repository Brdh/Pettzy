document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    if (!email) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro ao solicitar redefinição.");
            return;
        }

        // TOKEN
        const token = data.resetToken;

        alert("Token gerado com sucesso!");

        // Redireciona redefinição de senha
        window.location.href = `redefinir_senha.html?token=${token}`;

    } catch (error) {
        alert("Erro de conexão com o servidor.");
    }
});
