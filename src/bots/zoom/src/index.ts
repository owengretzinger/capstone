import fs from "fs";
import puppeteer from "puppeteer";
import { launch, getStream, wss } from "puppeteer-stream";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Url from Zoom meeting
const url =
    "https://us05web.zoom.us/j/87661417895?pwd=tjA3MYFChR5bPACMv6LYZ6kMghFRbG.1";

// Parse the url to get the web meeting url
const parseZoomUrl = (input: string): string => {
  const urlObj = new URL(input);
  const meetingId = urlObj.pathname.split('/')[2];
  const params = new URLSearchParams(urlObj.search);
  const pwd = params.get('pwd');
  return `https://app.zoom.us/wc/${meetingId}/join?fromPWA=1&pwd=${pwd}`;
};

console.log(parseZoomUrl(url));

if (
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_BUCKET_NAME ||
    !process.env.AWS_REGION
  ) {
    throw new Error("Missing environment variables");
  }
  
  // Initialize S3 client
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  const recordingPath = __dirname + "/recording.webm";
  const file = fs.createWriteStream(recordingPath);

// Launch a browser and open the meeting
(async () => {
  const browser = await launch({
    executablePath: puppeteer.executablePath(),
    headless: "new",
    // slowMo: 10,
    args: [
        "--no-sandbox",
    //     "--disable-setuid-sandbox",
    //     "--disable-dev-shm-usage",
    //     "--disable-gpu",
        // "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        "--window-size=1920,1080",
    //     "--disable-web-security",
    //     "--allow-running-insecure-content",
    //     "--autoplay-policy=no-user-gesture-required",
    ],
    // ignoreDefaultArgs: ["--mute-audio"],
  });
  const urlObj = new URL(parseZoomUrl(url));

  const context = browser.defaultBrowserContext();
  context.clearPermissionOverrides();
  context.overridePermissions(urlObj.origin, ["camera", "microphone"]);

  // Opens a new page
  const page = await browser.newPage();

  // Navigates to the url
  await page.goto(urlObj.href);

  // Waits for the page's iframe to load
  const iframe = await page.waitForSelector('.pwa-webclient__iframe');
  const frame = await iframe?.contentFrame();

  if (frame) {
    // Waits for the input field and types the name
    await frame.waitForSelector("#input-for-name");
    await frame.type("#input-for-name", "Meeting Bot");
    console.log("Typed name");

    // Wait for join button to be clickable
    await new Promise(resolve => setTimeout(resolve, 700));

    // Clicks the join audio button
    await frame.waitForSelector('button[aria-label="Join Audio"]');
    await frame.click('button[aria-label="Join Audio"]')
    console.log("Joined audio");

    // Waits for mute button to be clickable and clicks it
    await new Promise(resolve => setTimeout(resolve, 700));
    await frame.waitForSelector('button[aria-label="Mute"]');
    await frame.click('button[aria-label="Mute"]');
    console.log("Muted");

    // Clicks the join button
    await frame.waitForSelector("button.zm-btn.preview-join-button");
    await frame.click("button.zm-btn.preview-join-button");
    
    // Wait for the leave button to appear and be properly labeled before starting recording
    await new Promise(resolve => setTimeout(resolve, 700)); // Needed to wait for the aria-label to be properly attached
    await frame.waitForSelector('button[aria-label="Leave"]');
    console.log("Leave button found and labeled, ready to start recording");
  }

  // Start the recording
  const stream = await getStream(page, { audio: true, video: true });
  console.log("Recording...");

  // Pipe the stream to the file
  stream.pipe(file);

  // Constantly check if the meeting has ended every second
  const checkMeetingEnd = async () => {
    // Wait for the "Ok" button to appear which indicates the meeting is over
    const okButton = await frame?.waitForSelector(
      'button.zm-btn.zm-btn-legacy.zm-btn--primary.zm-btn__outline--blue',
      { timeout: 3600000 }
    );

    if (okButton) {
      console.log("Meeting ended");
      // Click the button to leave the meeting
      await okButton.click();

      // End the recording and close the file
      stream.destroy();
      file.close();
      console.log("Recording saved");

      // Upload recording to S3
  console.log("Uploading recording to S3...");
  const fileContent = await fs.promises.readFile(recordingPath);
  const uuid = crypto.randomUUID();
  const key = `recordings/${uuid}-teams-recording.webm`;

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: "video/webm",
      })
    );
    console.log(`Successfully uploaded recording to S3: ${key}`);

    // Clean up local file
    await fs.promises.unlink(recordingPath);
  } catch (error) {
    console.error("Error uploading to S3:", error);
  }


      // Close the browser
      await browser.close();
      (await wss).close();
    } else {
      setTimeout(checkMeetingEnd, 1000); // Check every second
    }
  };

  // Start the meeting end check
  checkMeetingEnd();
})();