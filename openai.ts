import puppeteer from "puppeteer";
import OpenAI from "openai";

const {htmlToText} = require('html-to-text');

export class OpenaiApi {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI();
    }

    async referenceFromUrl(url: string) {
        const text = await this.webPageToText(url);

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You will be provided with unstructured data for a blog post or an article coming from a web site, ' +
                            'your job is to extract the following information: title, author, summary, description, publishDate. ' +
                            'Do **not** return the response in markdown or any other format — just raw JSON.',
                    },
                    {
                        role: 'user',
                        content: `${text}`,
                    },
                ],
            });

            return JSON.parse(completion.choices[0].message.content as string)
        } catch (e) {
            return {msg: `Unable to parse text with openai: ${e}`};
        }
    }

    private async webPageToText(url: string): Promise<string> {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle0'});

        await page.evaluate(() => {
            const scripts = document.querySelectorAll('link');
            scripts.forEach(script => script.remove());
            const images = document.querySelectorAll('img');
            images.forEach(img => img.remove());
            const anchors = document.querySelectorAll('a');
            anchors.forEach(a => a.remove());  // Remove each script tag
        });

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        await browser.close();

        return htmlToText(bodyHTML);
    }
}