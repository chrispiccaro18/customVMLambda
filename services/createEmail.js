const createEmail = voicemail => {
  const voicemailDate = new Date(voicemail.timestamp * 1000);

  let html = `<p>${voicemailDate.toString()}</p>`;
  html += `<p>New voicemail from ${voicemail.contactPhoneNumber}.</p>`;

  html += `<b>Voicemail Transcript:</b><em>"${voicemail.transcript}</em>"`;

  const expirationDate = new Date(
    Math.floor(Date.now() / 1000 + voicemail.expires) * 1000
  );
  html += `<p>Voicemail Expiration Date: ${expirationDate}</p>`;

  const audioLink = `<p><a href="${voicemail.voicemailLink}">Click Here</a> to listen to the voicemail</p>`;
  html += audioLink;

  return {
    from: 'uschemwobvm@gmail.com',
    subject: `New voicemail from ${voicemail.contactPhoneNumber}`,
    html,
    attachments: [
      {
        filename: 'voicemail.wav',
        content: voicemail.voicemailAudio,
      },
    ],
    to: 'cjpiccaro@uschemicals-wob.com',
    cc: ['cjpiccaro@wellabisusa.com', 'chrispiccaro18@gmail.com'],
  };
};

module.exports = createEmail;
