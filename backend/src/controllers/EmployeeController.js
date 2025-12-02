import Employee from "../models/EmployeeModel.js";

// Criar um novo employee
export const createEmployee = async (req, res) => {
  try {
    const companyId = req.companyId;
    const employeeData = req.body;

    const novoEmployee = await Employee.create({
      ...employeeData,
      companyId: companyId
    });

    res.status(201).json(novoEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos os employees
export const getEmployees = async (req, res) => {
  try {
    const companyId = req.companyId;

    const employees = await Employee.find({ companyId: companyId });

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar employee por ID
export const getEmployeeById = async (req, res) => {
  try {
    const companyId = req.companyId
    const employeeId = req.params.id;

    const employee = await Employee.findOne({
      _id: employeeId,
      companyId: companyId
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar employee
export const updateEmployee = async (req, res) => {
  try {
    const companyId = req.companyId
    const employeeId = req.params.id;

    const employee = await Employee.findByIdAndUpdate({
      _id: employeeId,
      companyId: companyId
    },
      req.body,
      { new: true });

    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar employee
export const deleteEmployee = async (req, res) => {
  try {
    const companyId = req.companyId
    const employeeId = req.params.id;

    const employee = await Employee.findByIdAndDelete({
      _id: employeeId,
      companyId: companyId
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};