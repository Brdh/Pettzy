import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    especie: { type: String, required: true },
    raca: { type: String },
    idade: { type: Number },
    dono: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    empresaID: { empresaId: { type: mongoose.Schema.Types.ObjectId, ref: "Empresa" } }
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema);


// const PetModel = mongoose.model('Pet', PetSchema);
// module.exports = PetModel;