const MemberCounseling = require('../models/memberCounselingModel');

exports.list = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const result = await MemberCounseling.getMemberCounselings(memberId);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const memberId = parseInt(req.params.memberId, 10);
    const sessionData = req.body; 
    const newSession = await MemberCounseling.createMemberCounseling(memberId, sessionData);
    res.status(201).json(newSession);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
    const updatedData = req.body;
    const updated = await MemberCounseling.updateMemberCounseling(sessionId, updatedData);
    res.json(updated.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const memberCounselingId = parseInt(req.params.memberCounselingId, 10);
    const sessionId = parseInt(req.params.sessionId, 10);
    await MemberCounseling.deleteMemberCounseling(memberCounselingId, sessionId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
