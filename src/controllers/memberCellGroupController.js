// src/controllers/memberCellGroupController.js

const model = require('../models/memberCellGroupModel');

exports.createMembership = async (req, res) => {
  try {
    const item = await model.createMembership(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating membership' });
  }
};

exports.getAllMemberships = async (req, res) => {
  try {
    const list = await model.getAllMemberships();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving memberships' });
  }
};

exports.getMembershipById = async (req, res) => {
  try {
    const item = await model.getMembershipById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving membership' });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const { designation, date_joined } = req.body;

    console.log('Updating membership:', {
      id: req.params.id,
      designation,
      date_joined,
    });

    const item = await model.updateMembership(req.params.id, { designation, date_joined });

    if (!item) return res.status(404).json({ message: 'Not found' });

    res.json(item);
  } catch (err) {
    console.error('❌ Error updating membership:', err);
    res.status(500).json({ message: 'Error updating membership' });
  }
};


exports.deleteMembership = async (req, res) => {
  try {
    const item = await model.deleteMembership(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting membership' });
  }
};

exports.getMembershipsByCellGroupId = async (req, res) => {
  try {
    const list = await model.getMembershipsByCellGroupId(req.params.cellGroupId);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving memberships for cell group' });
  }
};

exports.getMembershipsByMemberId = async (req, res) => {
  try {
    const list = await model.getMembershipsByMemberId(req.params.memberId);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving memberships for member' });
  }
};
