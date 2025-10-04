// Bibliotecas e dependências
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import petRoutes from "./src/routes/petRoutes.js";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";


dotenv.config();

// Inicialização do app e porta
const app = express();
const PORT = 3000;


// Usando CORS
app.use(cors());

// Importações de rotas
app.use(express.json());
app.use("/api/pets", petRoutes)
app.use("/api/owners", ownerRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/companys", companyRoutes)


// Conectando ao BD
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to the database')
        app.emit('Connected');
    })
    .catch(e => console.log(e));

// Confirmação de funcionamento e indicação de porta
app.on('Connected', () => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});