/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.deleteUserAuth = functions.https.onCall(async (data, context) => {
  // Optional: Only allow admins (or skip this if you want simple setup)
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in.');
  }

  const uid = data.uid;

  try {
    await admin.auth().deleteUser(uid);
    return { message: `Successfully deleted user ${uid}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
