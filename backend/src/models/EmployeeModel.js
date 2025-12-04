import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cargo: { type: String, required: true },         // cargo/função do funcionário
    telefone: { type: String },                         // telefone (opcional)
    email: { type: String, required: true, unique: true }, // email único
    salario: { type: Number },                       // salário (opcional)
    cor: { type: String },
    vinculo: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }
}, { timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);
