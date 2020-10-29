const puppeteer = require('puppeteer');
const axios = require('axios');
const parser = require('papaparse');

const GOOGLE_SHEET_URL =
	'https://docs.google.com/spreadsheets/d/1pyuPyB8SpTCrnggXphk6hQDWGXBLv34V7b1qHj8bSTY/export?format=csv';

async function SubmitForm(data) {
	const browser = await puppeteer.launch({
		headless: false
	});

	const filteredResponses = data.data.filter(
		item => item['Completed Quests'] >= 5 && item['DSC Tracks Form'] !== 'TRUE'
	);

	await Promise.all(
		filteredResponses.forEach(async (item, index) => {
			const page = await browser.newPage();
			await page.goto('http://bit.ly/dsc-tracks');

			await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

			await InputField({
				page,
				selector: 'div[data-params*="Email"] input',
				value: item['Email Address']
			});

			await InputField({
				page,
				selector: 'div[data-params*="Phone"] input',
				value: item['Phone Number']
			});

			await InputField({
				page,
				selector: 'div[data-params*="Full name"] input',
				value: item['Name']
			});

			await InputField({
				page,
				selector: 'div[data-params*="full Address"] input',
				value: item['Physical Address']
			});

			await InputField({
				page,
				selector: 'div[data-params*="Qwiklabs Profile URL"] input',
				value: item['QwikiLabs Profile URL']
			});

			await SelectChapter(page);
			await SelectCountry(page);

			await page.screenshot({
				path: `screenshots/${item['Name'].toString().trim()}.png`,
				fullPage: true
			});

			return true;
		})
	);
	// await browser.close();
}

async function SelectChapter(page) {
	await page.waitFor(200);
	await page.click('[data-params*="DSC Chapter"]');
	await page.waitForSelector('div[data-value="UAE - Middlesex University"][role="option"] span', {
		visible: true,
		timeout: 3000
	});
	await page.waitFor(500);
	await page.evaluate(() => {
		document
			.querySelector('div[data-value="UAE - Middlesex University"][role="option"] span')
			.click();
	});
}

async function SelectCountry(page) {
	await page.waitFor(500);
	await page.evaluate(() => {
		document
			.querySelector('[data-params*="Country of residence"] div[role="presentation"]')
			.click();
	});
	await page.waitFor(800);
	await page.evaluate(() => {
		document
			.querySelector('div[data-value="United Arab Emirates"][role="option"] span')
			.click();
	});
}

async function InputField({ page, selector, value }) {
	await page.waitForSelector(selector, {
		visible: true,
		timeout: 3000
	});
	await page.focus(selector);
	await page.type(selector, value, { delay: 10 });
}

async function GetData() {
	const { data } = await axios.get(GOOGLE_SHEET_URL);

	const parsed = await parser.parse(data, { header: true });

	return parsed;
}

async function init() {
	const data = await GetData();
	await SubmitForm(data);
}

init();
