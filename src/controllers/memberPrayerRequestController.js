const MemberPrayerRequest = require('../models/memberPrayerRequestModel');

// GET all prayer requests for a member
exports.list = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const result = await MemberPrayerRequest.getMemberPrayerRequests(memberId);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// CREATE a prayer request
exports.create = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const { request, status } = req.body;

    const result = await MemberPrayerRequest.createPrayerRequest(memberId, request, status);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// UPDATE a prayer request
exports.update = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const id = parseInt(req.params.id, 10);
    const { request, status } = req.body;

    const result = await MemberPrayerRequest.updatePrayerRequest(memberId, id, request, status);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE a prayer request
exports.delete = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const id = parseInt(req.params.id, 10);

    await MemberPrayerRequest.deletePrayerRequest(memberId, id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
