import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cargo: { type: String, required: true },         // cargo/função do funcionário
    numero: { type: String },                         // telefone (opcional)
    email: { type: String, required: true, unique: true }, // email único
    salario: { type: Number },                       // salário (opcional)
}, { timestamps: true });

export default mongoose.model('Employee', EmployeeSchema);


// const EmployeeModel = mongoose.model('Employee', EmployeeSchema);
// module.exports = EmployeeModel;