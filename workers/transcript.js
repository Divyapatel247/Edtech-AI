const AWS = require("aws-sdk");
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const path = require("path");

// Configure AWS SDK and Deepgram client
const s3 = new AWS.S3({ region: "ap-south-1" });
const sqs = new AWS.SQS({ region: "ap-south-1" });
const deepgram = createClient("b958f5ffbde0cc72857129fb99e22743ac8e0959");

const queueUrl = "https://sqs.ap-south-1.amazonaws.com/858700757621/Edtech-AI";

async function processVideo(bucket, key) {
  const localFile = `./tmp1/${path.basename(key)}`;
  const outputPath = `./tmp1/processed-${key}/`;

  // Ensure the output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Download the video from S3
  const params = {
    Bucket: bucket,
    Key: key,
  };

  console.log(`Attempting to download ${key} from bucket ${bucket}`);

  try {
    const fileStream = fs.createWriteStream(localFile);
    await new Promise((resolve, reject) => {
      s3.getObject(params)
        .createReadStream()
        .on("error", (err) => {
          console.error(`Error downloading file: ${err.message}`);
          reject(err);
        })
        .pipe(fileStream)
        .on("finish", () => {
          console.log(`Downloaded ${localFile}`);
          resolve();
        });
    });

    // Transcribe the video using Deepgram
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(localFile),
      {
        model: "nova-2",
      }
    );
    // const { result, error } = await deepgram.transcription.preRecorded({
    //   buffer: fs.readFileSync(localFile),
    //   mimetype: "video/mp4",
    //   model: "nova-2",
    //   smart_format: false,
    // });

    if (error) {
      throw new Error(`Error transcribing video: ${error}`);
    }
    console.log(result);
    const transcript = result.results.channels[0].alternatives[0].transcript;
    const jsonData = JSON.stringify(transcript, null, 2);
    const transcriptFilePath = path.join(outputPath, "transcript.txt");
    fs.writeFileSync(transcriptFilePath, jsonData);

    console.log(`Transcript generated and saved to ${transcriptFilePath}`);

    // Upload the processed files to S3
    const uploadFileToS3 = async (filePath, s3Key) => {
      const fileStream = fs.createReadStream(filePath);
      const uploadParams = {
        Bucket: "process-videos-edtechai-247",
        Key: s3Key,
        Body: fileStream,
      };

      return s3.upload(uploadParams).promise();
    };

    try {
      const processedKey = `processed/${path.basename(
        key,
        path.extname(key)
      )}/transcript.txt`;
      await uploadFileToS3(transcriptFilePath, processedKey);

      // Clean up local files
      fs.unlinkSync(localFile);
      fs.unlinkSync(transcriptFilePath);

      console.log("All files uploaded and local files cleaned up.");
    } catch (err) {
      console.error(`Error uploading files: ${err.message}`);
    }
  } catch (err) {
    console.error(`Error processing video: ${err.message}`);
  }
}

let processing = false;

async function pollQueue() {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  };

  try {
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages && data.Messages.length > 0 && !processing) {
      processing = true;

      const message = data.Messages[0];
      const body = JSON.parse(message.Body);
      const s3Bucket = body.Records[0].s3.bucket.name;
      const s3Key = body.Records[0].s3.object.key;

      console.log(`Processing video from bucket ${s3Bucket} with key ${s3Key}`);

      try {
        await processVideo(s3Bucket, s3Key);

        // Delete the message from SQS
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };

        await sqs.deleteMessage(deleteParams).promise();
        console.log("Message deleted successfully");
      } catch (err) {
        console.error(`Error processing video: ${err.message}`);
      } finally {
        processing = false; // Reset processing flag
      }
    }
  } catch (error) {
    console.error(`Error receiving message: ${error.message}`);
  }

  // Continue polling
  setTimeout(pollQueue, 0);
}

pollQueue();

// const AWS = require('aws-sdk');
// const { createClient } = require('@deepgram/sdk');
// const fs = require('fs');
// const path = require('path');

// // Configure AWS SDK
// // AWS.config.update({
// //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //   region: process.env.AWS_REGION,
// // });

// const s3 = new AWS.S3({ region: "ap-south-1" });
// const sqs = new AWS.SQS({ region: "ap-south-1" });
// const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// const queueUrl = "https://sqs.ap-south-1.amazonaws.com/858700757621/Edtech-AI";
// let processing = false;

// async function processVideo(s3Bucket, s3Key) {
//   const localFilePath = `./tmp1/${path.basename(key)}`;
//   const params = {
//     Bucket: s3Bucket,
//     Key: s3Key,
//   };

//   // Download the file from S3
//   const data = await s3.getObject(params).promise();
//   fs.writeFileSync(localFilePath, data.Body);

//   // Transcribe the video
//   const { result, error } = await deepgram.transcription.preRecorded({
//     buffer: fs.readFileSync(localFilePath),
//     mimetype: 'video/mp4',
//     model: 'nova-2',
//     smart_format: false,
//   });

//   if (error) throw error;

//   // Save the transcript to a file
//   const transcript = result.results.channels[0].alternatives[0].transcript;
//   const jsonData = JSON.stringify(transcript, null, 2);
//   fs.writeFileSync('transcript.txt', jsonData);

//   console.log('Transcript generated successfully.');
//   console.dir(result, { depth: null });

//   // Clean up the local file
//   fs.unlinkSync(localFilePath);
// }

// async function deleteMessage(ReceiptHandle) {
//   const deleteParams = {
//     QueueUrl: queueUrl,
//     ReceiptHandle: ReceiptHandle,
//   };

//   try {
//     await sqs.deleteMessage(deleteParams).promise();
//     console.log('Message deleted successfully');
//   } catch (deleteError) {
//     console.error(`Error deleting message: ${deleteError.message}`);
//   }
// }

// async function pollQueue() {
//   const params = {
//     QueueUrl: queueUrl,
//     MaxNumberOfMessages: 1,
//     WaitTimeSeconds: 20,
//   };

//   try {
//     const data = await sqs.receiveMessage(params).promise();

//     if (data.Messages && data.Messages.length > 0 && !processing) {
//       processing = true;

//       const message = data.Messages[0];
//       const body = JSON.parse(message.Body);
//       const s3Bucket = body.Records[0].s3.bucket.name;
//       const s3Key = body.Records[0].s3.object.key;

//       try {
//         await processVideo(s3Bucket, s3Key);
//         await deleteMessage(message.ReceiptHandle);
//       } catch (err) {
//         console.error(`Error processing video: ${err.message}`);
//       } finally {
//         processing = false; // Reset processing flag
//       }
//     }
//   } catch (error) {
//     console.error(`Error receiving message: ${error.message}`);
//   }

//   // Continue polling
//   setTimeout(pollQueue, 0);
// }

// pollQueue();
