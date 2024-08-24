const AWS = require("aws-sdk");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const s3 = new AWS.S3({ region: "ap-south-1" });
const sqs = new AWS.SQS({ region: "ap-south-1" });

const queueUrl = "https://sqs.ap-south-1.amazonaws.com/858700757621/Edtech-AI";

async function processVideo(bucket, key) {
  const localFile = `./tmp/${path.basename(key)}`;
  const outputPath = `./tmp/processed-${key}/`;

  // Ensure the output directory exists
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  // Download the video from S3
  const params = {
    Bucket: bucket,
    Key: key,
  };

  console.log(`Downloading ${key} from ${bucket}`);
  const fileStream = fs.createWriteStream(localFile);
  s3.getObject(params).createReadStream().pipe(fileStream);

  fileStream.on("close", () => {
    console.log(`Downloaded ${localFile}`);

    const hlsPath = `${outputPath}index.m3u8`;
    const command = `ffmpeg -i ${localFile} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}segment%03d.ts" -start_number 0 ${hlsPath}`;
    console.log(`Executing command: ${command}`);

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error processing video: ${stderr}`);
        return;
      }

      console.log(`Processed video saved to ${outputPath}`);

      // Upload the processed files to S3
      const uploadFileToS3 = async (filePath, s3Key) => {
        const fileStream = fs.createReadStream(filePath);
        const uploadParams = {
          Bucket: "process-videos-edtechai-247",
          Key: s3Key,
          Body: fileStream,
          ContentType: filePath.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : "video/mp2t",
        };

        return s3.upload(uploadParams).promise();
      };

      try {
        const files = fs.readdirSync(outputPath);

        for (const file of files) {
          const filePath = path.join(outputPath, file);
          const processedKey = `processed/${path.basename(
            key,
            path.extname(key)
          )}/${file}`;
          await uploadFileToS3(filePath, processedKey);
        }

        // Clean up local files
        fs.unlinkSync(localFile);
        files.forEach((file) => {
          // fs.unlink(path.join(outputPath, file));
          fs.unlinkSync(path.join(outputPath, file));
        });
        fs.rm(outputPath, { recursive: false, force: true });
        console.log("All files uploaded and local files cleaned up.");
      } catch (err) {
        console.error(`Error uploading files: ${err.message}`);
      }
    });
  });
}

let processing = false;
async function pollQueue() {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  };

  sqs.receiveMessage(params, (error, data) => {
    if (error) {
      console.error(`Error receiving message: ${error.message}`);
      return;
    }

    if (data.Messages && data.Messages.length > 0 && !processing) {
      processing = true;

      const message = data.Messages[0];
      const body = JSON.parse(message.Body);
      const s3Bucket = body.Records[0].s3.bucket.name;
      const s3Key = body.Records[0].s3.object.key;

      // Process the video
      try {
        processVideo(s3Bucket, s3Key);

        // Delete the message from SQS
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };

        sqs.deleteMessage(deleteParams, (deleteError) => {
          if (deleteError) {
            console.error(`Error deleting message: ${deleteError.message}`);
          } else {
            console.log("Message deleted successfully");
          }
          processing = false;
        });
      } catch (err) {
        console.error(`Error processing video: ${err.message}`);
        processing = false; // Reset processing flag on error
      }
    }

    // Continue polling
    pollQueue();
    // setTimeout(pollQueue, 0);
  });
}

pollQueue();
