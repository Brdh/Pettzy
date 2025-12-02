import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    // 1. Tenta pegar o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido. Acesso negado." });
    }

    // 2. O token geralmente vem como "Bearer eyJhbGci..."
    // Precisamos separar a palavra "Bearer" do código
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ message: "Erro no token." });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: "Token malformatado." });
    }

    try {
        // 3. Verifica se o token é válido usando sua SEGREDO
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. A MÁGICA: Colocamos o ID da empresa dentro da requisição (req)
        // Isso faz com que o ID fique disponível para o próximo controller usar
        req.companyId = decoded.companyId;

        return next(); // Pode passar, está autorizado!

    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
};

export default authMiddleware;