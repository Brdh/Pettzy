import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    status: {type: String},
    especie: { type: String, required: true },
    raca: { type: String },
    idade: { type: Number },
    peso: {type:Number},
    dono: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    empresaId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
}, { timestamps: true });

export default mongoose.model('Pet', PetSchema);


// const PetModel = mongoose.model('Pet', PetSchema);
// module.exports = PetModel;


