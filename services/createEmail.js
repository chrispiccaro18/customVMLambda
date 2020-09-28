const createEmail = (voicemail, s3) => {
  const expires = 604800
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: voicemail.recordingBucketName,
      Key: voicemail.recordingObjectKey,
      Expires: expires,
    };
    return s3.getSignedUrl('getObject', params, (err, preSignedUrl) => {
      if(err) {
        reject({ error: 'Error getting S3 object url:' + err });
        return;
      }
      const voicemailDate = new Date(voicemail.timestamp * 1000);
    
      let html = `<p>${voicemailDate.toString()}</p>`;
      html += `<p>New voicemail from ${voicemail.contactPhoneNumber}.</p>`;

      html += `<b>Voicemail Transcript:</b><p>${voicemail.transcript}</p>`;
    
      const expirationDate = new Date(Math.floor((Date.now() / 1000) + expires) * 1000);
      html += `<p>Voicemail Expiration Date: ${expirationDate}</p>`;

      const audioLink = `<p><a href="${preSignedUrl}">Click Here</a> to listen to the voicemail</p>`;
      html += audioLink;
    
      resolve({
        from: 'uschemwobvm@gmail.com',
        subject: `New voicemail from ${voicemail.contactPhoneNumber}`,
        html,
        to: 'cjpiccaro@uschemicals-wob.com',
        cc: ['cjpiccaro@wellabisusa.com', 'chrispiccaro18@gmail.com']
      });
    });
  });
}

module.exports = createEmail;
