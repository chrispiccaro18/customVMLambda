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
        .then(response => {
          console.log(response.body);
          const transcripts = response.body;
          // console.log('transcript', transcript);
          // console.log('transcript results', transcript.results);
          // console.log('transcripts', transcript.results.transcripts);
          return transcripts.results.transcripts[0].transcript || null
        })

    })
};

module.exports = getTranscript;
