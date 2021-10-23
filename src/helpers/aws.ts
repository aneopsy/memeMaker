import AWS from "aws-sdk";

export async function downloadFromS3(attachmentId) {
  const s3 = new AWS.S3(); // Pass in opts to S3 if necessary
  const file = await s3
    .getObject({
      Bucket: "pixsols-images", // your bucket name,
      Key: attachmentId, // path to the object you're looking for
    })
    .promise();
  return file.Body;
  // {
  //   data: file.Body,
  //   mimetype: file.ContentType,
  // };
}
