const cron = require('node-cron');
const {
  populateFromMembers,
  updateFirstTimers,
  updateNewConverts
} = require('../services/autoMemberUpdater');

// Schedule to run every day at 7:00 AM
cron.schedule('0 7 * * *', async () => {
  console.log('[CRON] Running daily member status update');

  try {
    await populateFromMembers();
    await updateFirstTimers();
    await updateNewConverts();
    console.log('[CRON] Member status update complete');
  } catch (err) {
    console.error('[CRON] Error during member status update:', err.message);
  }
});
