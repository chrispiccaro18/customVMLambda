const getVoicemailAudio = (s3, bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    return s3.getObject(params, (err, s3Object) => {
      if (err) {
        reject({ error: 'Error getting S3 object' + err });
        return;
      }
      console.log(s3Object);
      resolve(s3Object.Body);
    });
  });
};

const getVoicemailLink = (s3, bucket, key, expires) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expires,
    };

    return s3.getSignedURL('getObject', params, (err, preSignedUrl) => {
      if (err) {
        reject({ error: 'Error getting S3 object url:' + err });
        return;
      }

      resolve(preSignedUrl);
    });
  });
};

module.exports = {
  getVoicemailAudio,
  getVoicemailLink,
};
