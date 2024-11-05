import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs-extra';

const stealthPlugin = StealthPlugin();
stealthPlugin.enabledEvasions.delete('iframe.contentWindow');
stealthPlugin.enabledEvasions.delete('media.codecs');
chromium.use(stealthPlugin);

const url = "https://meet.google.com/wvx-raiz-zee";

// const file = fs.createWriteStream(__dirname + "/test.webm");

(async () => {

  const browserArgs = [
    '--incognito',
    '--disable-features=IsolateOrigins,site-per-process',
    '--disable-infobars',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    "--use-fake-device-for-media-stream"
  ]

  // Launch the browser and open a new blank page
  const browser = await chromium.launch({
    headless: false,
    args: browserArgs
  });

  
  // Create Browser Context
  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  }
  );

  const fullName = 'Meeting Bot';

  // Create Page
  const page = await context.newPage();

  console.log('Navigating to Google Meet URL...');
  await page.goto(url, { waitUntil: 'networkidle' });

  console.log('Waiting for the input field to be visible...');
  await page.waitForSelector('input[type="text"][aria-label="Your name"]');
  
  console.log('Waiting for 10 seconds...');
  await page.waitForTimeout(10000);

  console.log('Filling the input field with the name...');
  await page.fill('input[type="text"][aria-label="Your name"]', fullName);

  console.log('Waiting for the "Ask to join" button...');
  await page.waitForSelector('//button[.//span[text()="Ask to join"]]', { timeout: 60000 });

  console.log('Clicking the "Ask to join" button...');
  await page.click('//button[.//span[text()="Ask to join"]]');


  //
  const leaveButton = `//button[@aria-label="Leave call"]`
  const peopleButton = `//button[@aria-label="People"]`


  //Should Exit after 1 Minute
  console.log('Awaiting Entry ....')
  await page.waitForSelector(leaveButton, { timeout: 60000 })
  

  console.log('Joined Call.')
  console.log('Finding People Button..')
  await page.waitForSelector(peopleButton)
  await page.click(peopleButton);
  console.log('Clicked People Button.')
  
  
  //Start Recording


  // Detect All but Me Person Leave
  await page.locator('//span[.//div[text()="Contributors"]]//div[text()="1"]').waitFor()
  console.log('Detected 1 Person in the call -- exiting ...');  

  // End Recording

  // Leave Meeting
  // Close Browser
  await page.click(leaveButton);
  console.log('Left Call.')

  await browser.close();
  console.log('Closed Browser.')


})();
