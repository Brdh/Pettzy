import Owner from "../models/OwnerModel.js";

// Criar um novo owner
export const createOwner = async (req, res) => {
    try {
        const owner = await Owner.create(req.body);
        res.status(201).json(owner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os owners
export const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find();
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar owner por ID
export const getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ error: "Owner not found" });
    res.status(200).json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar owner
export const updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!owner) return res.status(404).json({ error: "Owner not found" });
    res.status(200).json(owner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar owner
export const deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) return res.status(404).json({ error: "Owner not found" });
    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};