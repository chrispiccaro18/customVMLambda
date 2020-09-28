var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
const createEmail = require('./services/createEmail.js');
const getTranscript = require('./services/getTranscript.js');

var ses = new AWS.SES();
const transporter = nodemailer.createTransport({
  SES: ses
});

const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
  const { Records } = event;
  Records.forEach(record => {
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
      getTranscript(`${newRecord.contactId}_${newRecord.timestamp}`)
        .then(transcript => {
          const voicemailInfo = { ...newRecord, transcript };
          createEmail(voicemailInfo, s3)
            .then(emailContent => {
              transporter.sendMail(emailContent, err => {
                if (err) {
                  console.log('Error sending email', err);
                  callback(err);
                } else {
                  console.log('Email sent successfully');
                  callback();
                }
              });
            })
            .catch(err => {
              console.log(err);
              callback(err);
            });
        })
        .catch(err => {
          console.log(err);
          callback(err);
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
  });
  // callback(null, 'Hello from Lambda');
};
