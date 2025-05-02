// src/controllers/memberDepartmentController.js

const model = require('../models/memberDepartmentModel');

exports.createAssignment = async (req, res) => {
  try {
    const item = await model.createAssignment(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error creating assignment' });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const list = await model.getAllAssignments();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assignments' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const item = await model.getAssignmentById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving assignment' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const item = await model.updateAssignment(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const item = await model.deleteAssignment(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting assignment' });
  }
};
