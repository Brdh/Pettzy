import Pet from "../models/PetModel.js";

// Criar um novo pet
export const createPet = async (req, res) => {
  try {
    const companyId = req.companyId;
    const petData = req.body;

    const novoPet = await Pet.create({
      ...petData,
      companyId: companyId
    });
    
    res.status(201).json(novoPet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos os pets
export const getPets = async (req, res) => {
  try {
    const companyId = req.companyId

    const pets = await Pet.find({ companyId: companyId }).populate("dono", "nome telefone email");

    res.status(200).json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar pet por ID
export const getPetById = async (req, res) => {
  try {
    const companyId = req.companyId
    const petId = req.params.id;

    const pet = await Pet.findOne({
      _id: petId,
      companyId: companyId
    }).populate("dono", "name email phone");

    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar pet
export const updatePet = async (req, res) => {
  try {
    const companyId = req.companyId
    const petId = req.params.id;

    const pet = await Pet.findByIdAndUpdate({
      _id: petId,
      companyId: companyId
    },
      req.body,
      { new: true });

    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar pet
export const deletePet = async (req, res) => {
  try {
    const companyId = req.companyId
    const petId = req.params.id;

    const pet = await Pet.findByIdAndDelete({
      _id: petId,
      companyId: companyId
    });

    if (!pet) return res.status(404).json({ error: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};