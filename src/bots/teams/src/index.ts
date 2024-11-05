import fs from "fs";
import puppeteer from "puppeteer";
import { launch, getStream, wss } from "puppeteer-stream";

const url =
  "https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWUwMmNiNTMtMDlmMC00ZjFmLTk2OGYtODJjNmY1MWM3MTEw%40thread.v2/0?context=%7b%22Tid%22%3a%2244376307-b429-42ad-8c25-28cd496f4772%22%2c%22Oid%22%3a%22b20c6c81-06de-4c6f-9e22-160a16855a74%22%7d";

const parseTeamsUrl = (input: string): string => {
  const fullPath = input.replace("https://teams.microsoft.com", "");

  const [path, query] = fullPath.split("?");

  return `https://teams.microsoft.com/v2/?meetingjoin=true#${decodeURIComponent(
    path
  )}?${query}&anon=true`;
};

const file = fs.createWriteStream(__dirname + "/test.webm");

(async () => {
  // Launch the browser and open a new blank page
  const browser = await launch({
    executablePath: puppeteer.executablePath(),
    headless: false,
    slowMo: 250,
    // args: ["--use-fake-ui-for-media-stream"],
  });
  const urlObj = new URL(parseTeamsUrl(url));

  const context = browser.defaultBrowserContext();
  context.clearPermissionOverrides();
  context.overridePermissions(urlObj.origin, ["camera", "microphone"]);

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(urlObj.href);

  await page
    .locator(`[data-tid="prejoin-display-name-input"]`)
    .fill("Meeting Bot");

  // mute microphone before joining
  await page.locator(`[data-tid="toggle-mute"]`).click();

  await page.locator(`[data-tid="prejoin-join-button"]`).click();

  page.locator(`aria-label="People"`).on("DOMSubtreeModified", async (e) => {
    console.log("People changed");
    console.log(e);
  });

  const stream = await getStream(page, { audio: true, video: true });

  console.log("Recording...");
  stream.pipe(file);

  // First wait for the leave button to appear (meaning we've joined the meeting)
  await page.waitForSelector('button[aria-label="Leave (Ctrl+Shift+H)"]', {
    timeout: 30000,
  });
  console.log("Successfully joined meeting");

  // Then wait for meeting to end by watching for the "Leave" button to disappear
  await page.waitForFunction(
    () => {
      const leaveButton = document.querySelector(
        'button[aria-label="Leave (Ctrl+Shift+H)"]'
      );
      return !leaveButton;
    },
    { timeout: 0 }
  );

  console.log("Meeting ended");
  await stream.destroy();
  file.close();
  console.log("finished");

  await browser.close();
  (await wss).close();
})();
