// cronJob.js
const cron = require('node-cron');
const {
  syncMembersToUsers,     // New auto-user creation function
  populateFromMembers,
  updateFirstTimers,
  updateNewConverts
} = require('../services/autoMemberUpdater');

// Schedule to run every day at 7:00 AM
cron.schedule('0 7 * * *', async () => {
  console.log('[CRON] Running daily member and user update');

  try {
    // Auto create user accounts from new members
    await syncMembersToUsers();
    console.log('[CRON] Auto user creation complete');

    // Now run member population and promotion functions
    await populateFromMembers();
    await updateFirstTimers();
    await updateNewConverts();

    console.log('[CRON] Member status update complete');
  } catch (err) {
    console.error('[CRON] Error during member update:', err.message);
  }
});
