import Company from "../models/CompanyModel.js";
import crypto from "crypto"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from 'validator';

// Registrar nova empresa
export const registerCompany = async (req, res) => {
  const { nome, cnpj, email, senha } = req.body;
  try {

    // Verifica se a empresa existe
    const existe = await Company.findOne({ email });
    if (existe) return res.status(400).json({ message: "Empresa já cadastrada!" });

    // Valida formato do Email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Utilize um email válido" })
    }

    // Valida a senha
    // Valida formato do Email
    if (!senha || senha.length < 8) {
      return res.status(400).json({ success: false, message: "Utilize uma senha válida" });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(senha, salt);

    const novoCompany = await Company.create({ nome, cnpj, email, senha: hashed });

    res.status(201).json({ message: "Cadastro realizado com sucesso", company: novoCompany });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar", error });
  }
};

// Login de empresa
export const loginCompany = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Procura a empresa
    const company = await Company.findOne({ email });

    if (!company) return res.status(404).json({ message: "Usuário não encontrado" });

    // Valida a senha
    const senhaValida = await bcrypt.compare(senha, company.senha);
    if (!senhaValida) return res.status(401).json({ message: "Senha incorreta" });

    // Gera token JWT
    const token = jwt.sign({
      companyId: company._id
    },
      process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      user: {
        companyId: company._id,
        nome: company.nome,
        email: company.email
      }
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};

// Gera token de reset de senha
export const sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company)
      return res.status(404).json({ message: "E-mail não encontrado" });

    // Gera token seguro
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 1000 * 60 * 15; // 15 minutos

    company.resetToken = resetToken;
    company.resetTokenExpires = tokenExpiration;

    await company.save();

    // Aqui você enviaria email — por enquanto retornamos o link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    res.status(200).json({
      message: "Link para redefinição enviado com sucesso!",
      resetToken,
      resetLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar link", error });
  }
};

// Troca de senha
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { novaSenha } = req.body;

  try {
    const company = await Company.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!company)
      return res.status(400).json({ message: "Token inválido ou expirado" });

    // Criptografar nova senha
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(novaSenha, salt);

    company.senha = hashed;
    company.resetToken = undefined;
    company.resetTokenExpires = undefined;

    await company.save();

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao redefinir senha", error });
  }
};
