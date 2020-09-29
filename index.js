var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
const createEmail = require('./services/createEmail.js');
const getTranscript = require('./services/getTranscript.js');
const {
  getVoicemailLink,
  getVoicemailAudio,
} = require('./services/getVoicemail.js');

var ses = new AWS.SES();
const transporter = nodemailer.createTransport({
  SES: ses,
});

const s3 = new AWS.S3();

const LINK_EXPERATION = 604800;

exports.handler = (event, context, callback) => {
  const { Records } = event;
  return Promise.all(
    Records.map(async record => {
      const newRecord = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage
      );
      const oldRecord = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.OldImage
      );
      let transcribeCompleted =
        oldRecord.transcribeStatus === 'IN_PROGRESS' &&
        newRecord.transcribeStatus === 'COMPLETED';
      if (transcribeCompleted) {
        const transcript = await getTranscript(
          `${newRecord.contactId}_${newRecord.timestamp}`
        );

        const { recordingBucketName, recordingObjectKey } = newRecord;
        const voicemailAudio = await getVoicemailAudio(
          s3,
          recordingBucketName,
          recordingObjectKey
        );
        const voicemailLink = await getVoicemailLink(
          s3,
          recordingObjectKey,
          recordingObjectKey,
          LINK_EXPERATION
        );

        const voicemailInfo = {
          ...newRecord,
          transcript,
          voicemailAudio,
          voicemailLink,
          expires: LINK_EXPERATION,
        };
        const emailContent = createEmail(voicemailInfo);

        return transporter.sendMail(emailContent, err => {
          if (err) {
            console.log('Error sending email', err);
            callback(err);
          } else {
            console.log('Email sent successfully');
            callback();
          }
        });
      } else if (
        newRecord.transcribeStatus === null ||
        newRecord.transcribeStatus === undefined
      ) {
        // return this._deliver(newVoicemail);
        console.log('hi');
      } else {
        // return Promise.resolve({message: "Unhandled Resolution"});
        console.log('Transcript Not Ready');
      }
    })
  );
};
