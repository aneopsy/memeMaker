import AWS from "aws-sdk";
import { AttributeItem, StringPublicKey } from "../types";

export async function isExistS3(bucket: string, attachmentId: string) {
  const s3 = new AWS.S3();
  try {
    await s3
      .headObject({
        Bucket: bucket,
        Key: attachmentId,
      })
      .promise();
    return true;
  } catch (headErr) {
    if (headErr.code === "NotFound") {
      return false;
    }
  }
}

export async function* paginateListObjectsV2(bucket: string) {
  const s3 = new AWS.S3();
  try {
    const opts = {
      Bucket: bucket,
      MaxKeys: 2147483647,
      ContinuationToken: null,
    };
    do {
      const data = await s3.listObjectsV2(opts).promise();
      opts.ContinuationToken = data.NextContinuationToken;
      yield data;
    } while (opts.ContinuationToken);
  } catch (err) {
    throw err;
  }
}

export async function listS3(bucket: string) {
  const totalFiles = [];
  for await (const data of paginateListObjectsV2(bucket)) {
    totalFiles.push(...(data.Contents ?? []));
  }
  return totalFiles;
}

export async function downloadAttrS3(attachmentId) {
  const s3 = new AWS.S3(); // Pass in opts to S3 if necessary
  const file = await s3
    .getObject({
      Bucket: "pixsols-attributes", // your bucket name,
      Key: attachmentId, // path to the object you're looking for
    })
    .promise();
  return file.Body;
}

export async function downloadImageS3(attachmentId) {
  const s3 = new AWS.S3();
  try {
    const file = await s3
      .getObject({
        Bucket: "pixsols-images",
        Key: attachmentId,
      })
      .promise();
    console.log(`File downloaded successfully`);
    return file.Body;
  } catch (err) {
    throw err;
  }
}

export async function uploadImageS3(file: Buffer | string, key: string) {
  const s3 = new AWS.S3();

  try {
    const data = await s3
      .upload({
        Bucket: "pixsols-images",
        Key: key,
        Body: file,
      })
      .promise();
    console.log(`File uploaded successfully at ${data.Location}`);
  } catch (s3Err) {
    throw s3Err;
  }
}
export async function downloadS3(bucket: string, attachmentId: string) {
  const s3 = new AWS.S3();
  try {
    const file = await s3
      .getObject({
        Bucket: bucket,
        Key: attachmentId,
      })
      .promise();
    return file.Body;
  } catch (err) {
    throw err;
  }
}

export async function uploadS3(
  bucket: string,
  key: string,
  file: Buffer | string
) {
  const s3 = new AWS.S3();

  try {
    await s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: file,
      })
      .promise();
  } catch (s3Err) {
    throw s3Err;
  }
}

export const getAttributeTable = async (): Promise<{
  timestamp: number;
  attributes: AttributeItem[];
}> =>
  JSON.parse(
    (await downloadS3("pixsols-config", "attributes.json")).toString()
  ) as { timestamp: number; attributes: AttributeItem[] };
