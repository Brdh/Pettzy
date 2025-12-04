import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    status: { type: String },
    especie: { type: String, required: true },
    raca: { type: String },
    idade: { type: Number },
    foto: { type: String },
    peso: { type: Number },
    comportamento: { type: String },
    ultimaVacina: { type: String },
    ultimaConsulta: { type: String },
    medicacoes: { type: String },
    saude: { type: String },
    observacoes: [{ type: String }],
    Owner: { type: String },
    telefone: { type: String },
    dono: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema);
