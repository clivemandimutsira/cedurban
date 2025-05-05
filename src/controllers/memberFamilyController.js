// src/controllers/memberFamilyController.js

const memberFamilyModel = require('../models/memberFamilyModel');

// Create Family Link
exports.createFamilyLink = async (req, res) => {
  try {
    const link = await memberFamilyModel.createFamilyLink(req.body);
    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating family link' });
  }
};

// Get All Family Links
exports.getAllFamilyLinks = async (req, res) => {
  try {
    const data = await memberFamilyModel.getAllFamilyLinks();
    res.json(data);
  } catch (err) {
    console.error('Error fetching family links:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Single Family Link
exports.getFamilyLinkById = async (req, res) => {
  try {
    const link = await memberFamilyModel.getFamilyLinkById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Family link not found' });
    res.json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving family link' });
  }
};

// Update Family Link
exports.updateFamilyLink = async (req, res) => {
  try {
    const updated = await memberFamilyModel.updateFamilyLink(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Family link not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating family link' });
  }
};

// Delete Family Link
exports.deleteFamilyLink = async (req, res) => {
  try {
    const deleted = await memberFamilyModel.deleteFamilyLink(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Family link not found' });
    res.json({ message: 'Family link deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting family link' });
  }
};
