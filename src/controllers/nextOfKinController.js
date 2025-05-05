// src/controllers/nextOfKinController.js

const nextOfKinModel = require('../models/nextOfKinModel');

// Create Next of Kin
exports.createNextOfKin = async (req, res) => {
  try {
    const nextOfKin = await nextOfKinModel.createNextOfKin(req.body);
    res.status(201).json(nextOfKin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating next of kin' });
  }
};

// Get All
exports.getAllNextOfKin = async (req, res) => {
  try {
    const list = await nextOfKinModel.getAllNextOfKin();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving next of kin list' });
  }
};

// Get Single
exports.getNextOfKinById = async (req, res) => {
  try {
    const item = await nextOfKinModel.getNextOfKinById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Next of kin not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving next of kin' });
  }
};

// Update
exports.updateNextOfKin = async (req, res) => {
  try {
    const updated = await nextOfKinModel.updateNextOfKin(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Next of kin not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating next of kin' });
  }
};

// Delete
exports.deleteNextOfKin = async (req, res) => {
  try {
    const deleted = await nextOfKinModel.deleteNextOfKin(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Next of kin not found' });
    res.json({ message: 'Next of kin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting next of kin' });
  }
};
