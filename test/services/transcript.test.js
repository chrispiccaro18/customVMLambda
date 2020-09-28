const getTranscript = require('../../services/getTranscript');

describe('transcript fetch tests', () => {
  it('fetches the transcript', async () => {
    const jobName = '97d958f3-be9c-4262-a7e0-0b33a957bd42_1601074624';
    const transcript = await getTranscript(jobName);

    expect(transcript).toBe('this test Number seven Test number seven.');
  });
});
