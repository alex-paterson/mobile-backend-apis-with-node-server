var aws = require('aws-sdk');
var config = require('../config');
var uuid = require('uuid');

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: "us-west-2"
});

exports.getSignedImageUploadURL = function(callback) {
  var s3 = new aws.S3();
  var filename = uuid.v4();
  var params = {
    Bucket: 'xxx',
    Key: filename,
    Expires: 100,
    ContentType: "image/jpeg"
  };
  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
