import Pet from "../models/PetModel.js";

// Criar um novo pet
export const createPet = async (req, res) => {
    try {
        const pet = await Pet.create(req.body);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Listar todos os pets
export const getPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate("dono", "nome telefone email");
    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar pet por ID
export const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("dono", "name email phone");
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar pet
export const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar pet
export const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};