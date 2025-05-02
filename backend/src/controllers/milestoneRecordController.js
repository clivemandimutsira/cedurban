const model = require('../models/milestoneRecordModel');

exports.getByMember = async (req, res) => {
  try {
    const memberId = req.params.member_id;
    const data = await model.getByMember(memberId);
    res.json(data);
  } catch (err) {
    console.error('[getByMember] Error:', err);
    res.status(500).json({ error: 'Failed to fetch milestones' });
  }
};

exports.create = async (req, res) => {
  try {
    const { member_id, template_id } = req.body;

    if (!member_id || !template_id) {
      return res.status(400).json({ error: 'member_id and template_id are required' });
    }

    console.log('[assignMilestone] Incoming:', { member_id, template_id });

    const data = await model.create(member_id, template_id);
    res.status(201).json(data);
  } catch (err) {
    console.error('[assignMilestone] DB error:', err);
    res.status(500).json({ error: 'Failed to create milestone record' });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await model.delete(id);
    res.json(data);
  } catch (err) {
    console.error('[deleteMilestone] DB error:', err);
    res.status(500).json({ error: 'Failed to delete milestone' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await require('../models/milestoneRecordModel').getAll();
    res.json(data);
  } catch (err) {
    console.error('[getAllMilestones] Error:', err);
    res.status(500).json({ error: 'Failed to fetch all milestones' });
  }
};
