import { chromium } from 'playwright-extra';
import { Browser, Page } from 'playwright';
import { saveVideo, PageVideoCapture } from 'playwright-video';
import { CaptureOptions } from 'playwright-video/build/PageVideoCapture';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs-extra';

// Use Stealth
const stealthPlugin = StealthPlugin();
stealthPlugin.enabledEvasions.delete('iframe.contentWindow');
stealthPlugin.enabledEvasions.delete('media.codecs');
chromium.use(stealthPlugin);

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const enterNameField = 'input[type="text"][aria-label="Your name"]';
const askToJoinButton = '//button[.//span[text()="Ask to join"]]';
const leaveButton = `//button[@aria-label="Leave call"]`
const peopleButton = `//button[@aria-label="People"]`
const onePersonRemainingField = '//span[.//div[text()="Contributors"]]//div[text()="1"]'

const randomDelay = (amount: number) => (2*Math.random() - 1) * (amount/10) + amount;

export class MeetingBot {

    browserArgs: string[];
    meetingURL: string;
    readonly settings: { [key: string]: any }

    // Ssves
    browser: Browser;
    page: Page;
    recorder: PageVideoCapture | undefined;


    //
    //
    //
    //
    constructor(meetingURL, botSettings: { [key: string]: any }) {

        this.browserArgs = [
            '--incognito',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-infobars',
            "--use-fake-device-for-media-stream",
            ...(botSettings?.additionalBrowserSettings ?? [])
        ]

        // Pull
        const { name, viewport } = botSettings
        this.settings = botSettings; //store all anyways

        // Set
        this.meetingURL = meetingURL;
    }

    //
    //
    //
    //
    async joinMeeting() {


        // Launch the browser and open a new blank page
        this.browser = await chromium.launch({
            headless: false,
            args: this.browserArgs
        });

        // Define Default View Port Dimensions
        const vp = this.settings.viewport || { width: 1280, height: 720 };

        // Create Browser Context
        const context = await this.browser.newContext({
            permissions: ['camera', 'microphone'],
            userAgent: userAgent,
            viewport: vp,
        }
        );

        // Create Page, Go to
        this.page = await context.newPage();
        await this.page.waitForTimeout(randomDelay(1000));
        
        // Inject anti-detection code using addInitScript
        await this.page.addInitScript(() => {
            // Disable navigator.webdriver to avoid detection
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

            // Override navigator.plugins to simulate real plugins
            Object.defineProperty(navigator, 'plugins', { get: () => [{ name: 'Chrome PDF Plugin' }, { name: 'Chrome PDF Viewer' }] });

            // Override navigator.languages to simulate real languages
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });

            // Override other properties
            Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); // Fake number of CPU cores
            Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 }); // Fake memory size
            Object.defineProperty(window, 'innerWidth', { get: () => 1920 }); // Fake screen resolution
            Object.defineProperty(window, 'innerHeight', { get: () => 1080 });
            Object.defineProperty(window, 'outerWidth', { get: () => 1920 });
            Object.defineProperty(window, 'outerHeight', { get: () => 1080 });
        });
        
        await this.page.mouse.move(10, 672)
        await this.page.mouse.move(102, 872)
        await this.page.mouse.move(114, 1472)
        await this.page.waitForTimeout(300);
        await this.page.mouse.move(114, 100)
        await this.page.mouse.click(100, 100);

        await this.page.goto(this.meetingURL, { waitUntil: 'networkidle' });

        const name = this.settings.name || 'MeetingBot';

        console.log('Waiting for the input field to be visible...');
        await this.page.waitForSelector(enterNameField);

        console.log('Waiting for 1 seconds...');
        await this.page.waitForTimeout(randomDelay(1000));

        console.log('Filling the input field with the name...');
        await this.page.fill(enterNameField, name);

        console.log('Waiting for the "Ask to join" button...');
        await this.page.waitForSelector(askToJoinButton, { timeout: 60000 });

        console.log('Clicking the "Ask to join" button...');
        await this.page.click(askToJoinButton);

        //Should Exit after 1 Minute
        console.log('Awaiting Entry ....')
        await this.page.waitForSelector(leaveButton, { timeout: 60000 })

        console.log('Joined Call.')
        return 0;
    }

    async startRecording() {

        // Set Default Recording Options
        const recordingOptions: CaptureOptions = this.settings.recordingOptions ||
        {
            followPopups: false,
            fps: 25,
        }

        // Save the Recorder
        this.recorder = await saveVideo(this.page, this.settings.recordingPath, recordingOptions);
        return 0;
    }

    async stopRecording() {

        // Error case
        if (!this.recorder) {
            console.log('Cannot stop recording as recording has not been started.')
            return 1;
        }

        // Stop the Recording & Drop Reference
        await this.recorder.stop();
        this.recorder = undefined;

        return 0;
    }


    async meetingActions() {

        // Meeting Join Actions
        console.log('Clicking People Button...')
        await this.page.waitForSelector(peopleButton)
        await this.page.click(peopleButton);

        // Start Recording, Yes by default
        if (this.settings.recordMeeting || true)
            this.startRecording();

        // Define Exit Condition(s)
        const onlyMeInMeeting = this.page.locator(onePersonRemainingField).waitFor()
        // const exitCondition2 = this.page.waitForFunction(() => document.title.includes('Success'));

        // Chill Until an Exit Condition is met
        const result = await Promise.race([onlyMeInMeeting, ]);

        // Exit
        await this.leaveMeeting();
        return 0;
    }

    async leaveMeeting() {

        // Ensure
        this.stopRecording();

        // Try and Find the leave button, press. Otherwise, just delete the browser.
        await this.page.click(leaveButton);
        console.log('Left Call.')

        await this.browser.close();
        console.log('Closed Browser.')

        return 0;
    }
}