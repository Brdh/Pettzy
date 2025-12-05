import Company from "../models/CompanyModel.js";

// Criar um novo company
export const createCompany = async (req, res) => {
    try {
        const company = await Company.create(req.body);
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os companys
export const getCompanys = async (req, res) => {
  try {
    const companys = await Company.find();
    res.status(200).json(companys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar company por ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar company
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar company
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar dados da empresa autenticada (via token)
export const getMyCompany = async (req, res) => {
  try {
    const companyId = req.companyId; // Vem do authMiddleware
    if (!companyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};