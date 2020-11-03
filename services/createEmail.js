const {
  WELLABIS_AGENT_ID,
  WELLABIS_FROM_EMAIL,
  USCHEM_FROM_EMAIL,
  CHRIS_USCHEM_EMAIL,
  CHRIS_WELLABIS_EMAIL,
  CAROL_USCHEM_EMAIL,
  CAROL_WELLABIS_EMAIL,
  DI_USCHEM_EMAIL,
} = process.env;

const emailOptions = {
  wellabis: {
    subject: 'WELLABIS',
    to: [CHRIS_WELLABIS_EMAIL, CAROL_WELLABIS_EMAIL],
    from: WELLABIS_FROM_EMAIL,
  },
  uschem: {
    subject: 'USCHEM-WOB',
    to: [CHRIS_USCHEM_EMAIL, CAROL_USCHEM_EMAIL, DI_USCHEM_EMAIL],
    from: USCHEM_FROM_EMAIL,
  }
};

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

  const isWellabis = voicemail.readerId === WELLABIS_AGENT_ID;
  const emailDetails = isWellabis ? emailOptions.wellabis : emailOptions.uschem;
  const { subject, to, from } = emailDetails;

  return {
    from,
    subject: `${subject}: New voicemail from ${voicemail.contactPhoneNumber}`,
    html,
    attachments: [
      {
        filename: 'voicemail.wav',
        content: voicemail.voicemailAudio,
      },
    ],
    to
  };
};

module.exports = createEmail;
