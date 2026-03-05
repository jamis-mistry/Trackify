const Role = require('../models/Role.json.js');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: "Role name is required" });

        const newRole = await Role.create({ name, description });
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const success = await Role.findByIdAndDelete(req.params.id);
        if (!success) return res.status(404).json({ message: "Role not found" });
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
