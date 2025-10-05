import Company from "../models/CompanyModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerCompany = async (req, res) => {
  try {
    const { nome, cnpj, email, senha } = req.body;

    const existe = await Company.findOne({ email });
    if (existe) return res.status(400).json({ message: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(senha, 10);
    const novoCompany = await Company.create({ nome, cnpj, email, senha: hashed });

    res.status(201).json({ message: "Cadastro realizado com sucesso", company: novoCompany });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar", error });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Procura o usuário
    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ message: "Usuário não encontrado" });

    // Valida a senha
    const senhaValida = await bcrypt.compare(senha, company.senha);
    if (!senhaValida) return res.status(401).json({ message: "Senha incorreta" });

    // Gera token JWT
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};
