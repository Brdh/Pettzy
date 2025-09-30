import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    numero: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // email único
}, { timestamps: true });

export default mongoose.model('Owner', OwnerSchema);


// const OwnerModel = mongoose.model('Owner', OwnerSchema);
// module.exports = OwnerModel;