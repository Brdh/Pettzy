import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // email único
    telefone: { type: String },
    senha: { type: String, required: true },

    // CAMPOS PARA RECUPERAÇÃO DE SENHA
    resetToken: { type: String },
    resetTokenExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model('Company', CompanySchema);
