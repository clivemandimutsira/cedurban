const memberModel = require('../models/memberModel');

const UPDATABLE_FIELDS = [
  'user_id', 'title', 'first_name', 'surname', 'date_of_birth',
  'contact_primary', 'contact_secondary', 'email', 'nationality', 'gender',
  'marital_status', 'num_children', 'physical_address', 'profession', 'occupation',
  'work_address', 'date_joined_church', 'date_born_again', 'date_baptized_immersion',
  'baptized_in_christ_embassy', 'date_received_holy_ghost', 'foundation_school_grad_date'
];

function normalize(val) {
  if (val === '' || val === 'null' || val === 'undefined' || val == null) {
    return null;
  }
  return typeof val === 'string' ? val.trim() : val;
}

exports.checkDuplicate = async (req, res) => {
  try {
    const { field, value } = req.query;
    if (!field || !value) return res.status(400).json({ error: 'Missing field or value' });

    const exists = await memberModel.checkDuplicateField(field, value);
    return res.json({ exists });
  } catch (err) {
    console.error('Duplicate check error:', err);
    return res.status(500).json({ error: 'Failed to check for duplicates' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const photoPath = req.file ? `/uploads/profile_photos/${req.file.filename}` : null;

    const duplicateEmail = await memberModel.checkDuplicateField('email', req.body.email);
    const duplicatePhone = await memberModel.checkDuplicateField('contact_primary', req.body.contact_primary);
    if (duplicateEmail || duplicatePhone) {
      return res.status(400).json({
        error: `Duplicate ${duplicateEmail ? 'email' : 'phone number'}`
      });
    }

    const data = {
      ...req.body,
      profile_photo: photoPath,
    };

    const newMember = await memberModel.createMember(data);
    return res.status(201).json(newMember);
  } catch (err) {
    console.error('Error creating member:', err);
    return res.status(500).json({ message: 'Error creating member' });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    const members = await memberModel.getAllMembers();
    return res.json(members);
  } catch (err) {
    console.error('Error retrieving members:', err);
    return res.status(500).json({ message: 'Error retrieving members' });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await memberModel.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    return res.json(member);
  } catch (err) {
    console.error('Error retrieving member:', err);
    return res.status(500).json({ message: 'Error retrieving member' });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const fields = {};
    if (req.file) fields.profile_photo = `/uploads/profile_photos/${req.file.filename}`;

    UPDATABLE_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) {
        fields[key] = key === 'baptized_in_christ_embassy'
          ? req.body[key] === 'true' || req.body[key] === true
          : normalize(req.body[key]);
      }
    });

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided.' });
    }

    const updated = await memberModel.updateMember(req.params.id, fields);
    if (!updated) return res.status(404).json({ message: 'Member not found.' });

    return res.json(updated);
  } catch (err) {
    console.error('Error updating member:', err);
    return res.status(500).json({ message: 'Error updating member' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const deleted = await memberModel.deleteMember(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Member not found' });
    return res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    return res.status(500).json({ message: 'Error deleting member' });
  }
};
