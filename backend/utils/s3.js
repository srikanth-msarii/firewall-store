import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK
// This works now because dotenv.config() ran first in server.js
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Uploads a file buffer to S3
 */
export const uploadFileToS3 = (fileBuffer, originalname, mimetype) => {
  const fileExtension = originalname.split('.').pop();
  const newFileName = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: newFileName, // Unique key
    Body: fileBuffer,
    ContentType: mimetype,
    // ACL: 'public-read', // Uncomment if your bucket needs this
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('S3 Upload Error:', err);
        return reject(err);
      }
      // data.Location is the public URL
      resolve(data.Location);
    });
  });
};

/**
 * Deletes a file from S3
 */
export const deleteFileFromS3 = (fileUrl) => {
  const key = fileUrl.split('/').pop();
  if (!key) return Promise.resolve(); // No key, nothing to delete

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error('S3 Delete Error:', err);
        return reject(err);
      }
      console.log(`Successfully deleted ${key} from S3`);
      resolve(data);
    });
  });
};