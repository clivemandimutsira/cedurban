const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

exports.sendBulkSms = async (body, recipients) => {
  const results = await Promise.allSettled(
    recipients.map(to =>
      client.messages.create({
        body,
        from: process.env.TWILIO_PHONE,
        to
      })
    )
  );
  return results;
};

const africastalking = require('africastalking')({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

const sms = africastalking.SMS;

exports.sendBulkSms = async (body, recipients) => {
  return await sms.send({
    to: recipients, // array of phone numbers
    message: body,
    enqueue: true
  });
};
