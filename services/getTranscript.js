const AWS = require('aws-sdk');
const request = require('superagent');

const transcribe = new AWS.TranscribeService();

const getTranscript = jobName => {
  const params = {
    TranscriptionJobName: jobName
  };

  return transcribe
    .getTranscriptionJob(params)
    .promise()
    .then(transcriptionJob => {
      return request
        .get(transcriptionJob.TranscriptionJob.Transcript.TranscriptFileUri)
        .set('Accept', 'application/json')
        .buffer(true)
        .then(response => {
          const transcripts = JSON.parse(response.body.toString());
          return transcripts.results.transcripts[0].transcript || null;
        });
    });
};

module.exports = getTranscript;
