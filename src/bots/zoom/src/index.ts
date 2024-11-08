import fs from "fs";
import puppeteer from "puppeteer";
import { launch, getStream, wss } from "puppeteer-stream";

const url =
    "https://us05web.zoom.us/j/84281441381?pwd=N0BHnE1vCY82oom4tnbvVajXRAlrmS.1";

const parseZoomUrl = (input: string): string => {
  const urlObj = new URL(input);
  const meetingId = urlObj.pathname.split('/')[2];
  const params = new URLSearchParams(urlObj.search);
  const pwd = params.get('pwd');
  return `https://app.zoom.us/wc/${meetingId}/join?fromPWA=1&pwd=${pwd}`;
};

console.log(parseZoomUrl(url));

const file = fs.createWriteStream(__dirname + "/test.webm");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await launch({
    executablePath: puppeteer.executablePath(),
    headless: false,
    // slowMo: 10,
    // args: ["--use-fake-ui-for-media-stream"],
  });
  const urlObj = new URL(parseZoomUrl(url));

  const context = browser.defaultBrowserContext();
  context.clearPermissionOverrides();
  context.overridePermissions(urlObj.origin, ["camera", "microphone"]);

  const page = await browser.newPage();

  await page.goto(urlObj.href);

  const iframe = await page.waitForSelector('.pwa-webclient__iframe');
  const frame = await iframe?.contentFrame();

  if (frame) {
    await frame.waitForSelector("#input-for-name");
    await frame.type("#input-for-name", "Meeting Bot");

    await frame.waitForSelector("button.zm-btn.preview-join-button");
    await frame.click("button.zm-btn.preview-join-button");
    
    await frame.waitForSelector("button.join-audio-by-voip__join-btn", {timeout: 60000});
    await new Promise(resolve => setTimeout(resolve, 1000));
    await frame.click("button.join-audio-by-voip__join-btn");
  }

  const stream = await getStream(page, { audio: true, video: true });

  console.log("Recording...");

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log("finished");

    await browser.close();
    (await wss).close();
  }, 1000 * 10);

  // await browser.close();
})();