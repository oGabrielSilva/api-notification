const { Expo } = require("expo-server-sdk");
const express = require("express");
const router = express.Router();

const expo = new Expo();

router.post("/push/notification", (req, res) => {
  const { token: pushToken, title, body } = req.body;

  const messages = [];
  if (!Expo.isExpoPushToken(pushToken)) {
    return console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }

  messages.push({
    to: pushToken,
    sound: "default",
    body,
    title,
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  const receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) receiptIds.push(ticket.id);
  }

  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        for (let receiptId in receipts) {
          const { status, message, details } = receipts[receiptId];
          if (status === "ok") continue;
          else if (status === "error") {
            console.error(`There was an error sending a notification: ${message}`);
            if (details && details.error) console.error(`The error code is ${details.error}`);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();

  res.json({ status: 200 });
});

module.exports = router;
