const puppeteer = require('puppeteer');
const csv = require('fast-csv');
const fs = require('fs');
require('dotenv').config();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dataSystem = {
    browser: null,
    page: null,

    init: async () => {
        const auth_token = process.env.AUTH_TOKEN;
        const chrome_path = process.env.CHROME_PATH;
        const chrome_user = process.env.CHROME_USER;

        try {
            dataSystem.browser = await puppeteer.launch({
                userDataDir: `${chrome_user}`,
                executablePath: `${chrome_path}`,
                headless: false,
            });
            dataSystem.page = await dataSystem.browser.newPage();

            const cookieString = `guest_id_marketing=v1%3A169003364965754204; guest_id_ads=v1%3A169003364965754204; guest_id=v1%3A169003364965754204; _ga=GA1.2.202475205.1706446635; g_state={\"i_l\":0}; ct0=f1536e5aab1c36462dbd465fbde2d394869df71a7c7dd4ea0bfd1751cd75133ca1167acb2975c6d3fc7db266f98da238467e1bb8e227ab6a40f0e6aa2d35a2b5052647aabad1eb05877873bebf866ca0; twid=u%3D1755760351004831744; lang=en; _gid=GA1.2.736843675.1710486271; personalization_id=\"v1_4QlZR8mkSCxgoXzUQXlITA==\"; auth_token=${auth_token}`;

            const cookiesArray = cookieString.split('; ').map(cookie => {
                const [name, value] = cookie.split('=');
                return { name, value, domain: "twitter.com", path: "/" };
            });

            for (const cookie of cookiesArray) {
                await dataSystem.page.setCookie(cookie);
            }

        } catch (err) {
            console.log("Error: ", err)
        }
    },

    start: async () => {
        const query = process.env.QUERY;
        const limit = parseInt(process.env.MAX_TWEETS);
        
        try {
            await dataSystem.page.goto(`https://twitter.com/search?q=${query}`);
            await dataSystem.page.waitForSelector('div[data-testid="cellInnerDiv"]');

            let tweets = [];

            // Function to scroll down the page
            const scrollDown = async () => {
                await dataSystem.page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight);
                });
                await sleep(3000); // Wait for some time after scrolling
            };
            // Loop until we have 50 tweets or no new tweets are loaded
while (tweets.length < limit) {

    await scrollDown(); // Scroll down to load more tweets
    await sleep(2000) // Wait for 2 seconds for new content to load

    const newTweets = await dataSystem.page.evaluate(() => {
        const tweetElements = document.querySelectorAll('div[data-testid="cellInnerDiv"] div > article');
        const data = [];

tweetElements.forEach(tweetElement => {
    const accountNameElement = tweetElement.querySelector('div[data-testid="User-Name"] a');
    const accountNameInnerText = accountNameElement ? accountNameElement.innerText : null;
    const usernameElement = accountNameElement ? accountNameElement.getAttribute('href') : null;
    const tweetTextElement = tweetElement.querySelector('div[data-testid="tweetText"]').innerText.split("\n").join("");
    const timestampElement = tweetElement.querySelector('time');

    const name = accountNameInnerText ? accountNameInnerText : 'Undefined';
    const username = usernameElement ? `@${usernameElement}` : 'Anonymous';
    const tweetText = tweetTextElement ? tweetTextElement : '';
    const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';

    data.push({ name, username, tweetText, timestamp });
});


        return data;
    });

    // Filter out duplicate tweets before adding them to the array
    newTweets.forEach(newTweet => {
        const isDuplicate = tweets.some(existingTweet =>
            existingTweet.name === newTweet.name &&
            existingTweet.username === newTweet.username &&
            existingTweet.tweetText === newTweet.tweetText &&
            existingTweet.timestamp === newTweet.timestamp
        );
        // const hasNonAlphabets = /[^\x00-\x7F]/.test(newTweet.tweetText);

        if (!isDuplicate) {
            tweets.push(newTweet);
        }
    });

    if (tweets.length >= limit) {
        break; // Break the loop if we already have 50 tweets
    }
}
            const ws = fs.createWriteStream("./results.csv");

            // Write data to CSV
            csv
                .write(tweets, { headers: true })
                .pipe(ws);

            await dataSystem.browser.close();
        } catch (error) {
            console.error(error);
        }
    }
};

dataSystem.init()
    .then(() => dataSystem.start())
    .catch(error => console.error(error));