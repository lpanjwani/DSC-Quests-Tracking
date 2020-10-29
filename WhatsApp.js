const WhatsAppAPIBase = 'https://baf03189e563.ngrok.io';

function SendWhatsAppEntryMessages() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	const sheetData = sheet.getDataRange().getValues();

	sheetData.forEach(async (item, position) => {
		if (position !== 0) {
			if (!Boolean(item[letterValue('m')])) {
				const phoneNumber = item[letterValue('f')];
				const name = item[letterValue('b')];
				const message = `Hi ${name}, Your Registration at DSC MDX for QwikLabs is recieved! You will be eligible for gifts upon completion of 5 quests!\n\nThis is automated message so no response is needed!`;

				const url = `${WhatsAppAPIBase}\/chat\/sendmessage/${phoneNumber}`;
				const options = {
					method: 'POST',
					payload: {
						message: message
					}
				};
				UrlFetchApp.fetch(url, options);
				sheet.getRange(position + 1, letterValue('m') + 1).setValue(true);
			}
		}
	});
}

function SendWhatsAppMonthlySubscriptionDetails() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	const sheetData = sheet.getDataRange().getValues();

	sheetData.forEach(async (item, position) => {
		if (position !== 0) {
			if (!Boolean(item[letterValue('m')])) {
				const phoneNumber = item[letterValue('f')];
				const name = item[letterValue('b')];
				const message = `Hi ${name},

The Machine Learning Track will be done QwikLabs which requests a subscription. Please make sure you complete these instruction on the timeframe mentioned below!
These instructions are on how to avail the QwikLabs Monthly Subscription. You do not need to do this if you have already the subscription. REMINDER: THE LINK WILL BE ONLY BE ACTIVE TOMORROW (9th october 2020). IT WILL NOT WORK TODAY OR DAY AFTER!

I highly recommend to check out to view our onboarding info session recording at https://www.youtube.com/watch?v=OcPXvMVRsPs. The session covers information about DSC and how to avail the monthly subscription in detail. 

1. If already enrolled in the quest, please Un-enroll from the quest and then Enroll again using the steps given below.
2. Open the link in an incognito window:  https://google.qwiklabs.com/quests/34?qlcampaign=1s-dubai-2236
3. Click “Enroll”.
4. Sign in into the Qwiklabs by using "Sign In With Google".
5. Then, click on the Enroll Quest button for the Quest, they will get the 5 credits.
6. Go to the first lab of the enrolled Quest and click on the start lab button. Use the credits you have in your account to take any labs. (Use "Start with One Credit" Button).  
7. Please spend a minimum of 5 minutes in the lab and end it. Once you click on the end lab button, you will be granted a one month pass.
8. To see the one month pass and credits in your account, check the "Credits and Subscriptions" section of your account.

Visit the Quest Tracking Form and update your QwikLabs Profile Link in the form (https://forms.gle/gmh9qTe8duUFJHJH8). 
Once your done with everything above, please respond with "completed" on this message. 

If your unsure about the instructions, please refer to the onboarding information session at https://youtu.be/OcPXvMVRsPs?t=334 or ask someone for assistance on the DSC group.`;

				const url = `${WhatsAppAPIBase}\/chat\/sendmessage/${phoneNumber}`;
				const options = {
					method: 'POST',
					payload: {
						message: message
					}
				};
				UrlFetchApp.fetch(url, options);
			}
		}
	});
}

function SendWhatsAppReminders() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	const sheetData = sheet.getDataRange().getValues();
	const getQuestNameRegex = new RegExp(/(Completion Status )(\[)(.*?)(\])/m);

	let QuestsNames = [];

	sheetData.forEach(async (item, position) => {
		if (position === 0) {
			QuestsNames.push({
				index: letterValue('h'),
				name: getQuestNameRegex.exec(item[letterValue('h')])[3]
			});
			QuestsNames.push({
				index: letterValue('i'),
				name: getQuestNameRegex.exec(item[letterValue('i')])[3]
			});
			QuestsNames.push({
				index: letterValue('j'),
				name: getQuestNameRegex.exec(item[letterValue('j')])[3]
			});
			QuestsNames.push({
				index: letterValue('k'),
				name: getQuestNameRegex.exec(item[letterValue('k')])[3]
			});
			QuestsNames.push({
				index: letterValue('l'),
				name: getQuestNameRegex.exec(item[letterValue('l')])[3]
			});
		} else {
			const url = item[letterValue('g')];

			const isValidURL = url ? true : false;

			if (isValidURL) {
				const phoneNumber = item[letterValue('f')];
				const name = item[letterValue('b')];
				const completedQuests = item[letterValue('c')];
				let message = `Hi ${name}, You have finished *${
					item[letterValue('c')]
				} Quests* in Total!\n\nQuests Breakdown:\n`;

				QuestsNames.forEach(quest => {
					const questName = quest.name;
					const isCompleted = item[quest.index];
					message += `*${questName}*: _${isCompleted ? 'Complete' : 'Not Completed'}_\n`;
				});

				if (completedQuests >= 5) {
					message +=
						"\nCongratulations, You have are eligible for gifts! You've earned it!";
					if (!item[letterValue('o')]) {
						message += '\n*Status: Please Provide your T-Shirt Size ASAP!*\n';
					}
					if (item[letterValue('n')] == true) {
						message +=
							'\n*Status: Your Information is already sent to Google for shipping out your gift box!*\n';
					}
					message +=
						'\nPlease keep an eye on your email for any DSC related communication!\n';
				} else if (completedQuests >= 1 && completedQuests <= 4) {
					message += `\nYou have ${
						5 - completedQuests
					} remaining quests to be eligible for gifts.\n`;
				} else {
					message += `\nReminder: If you do not finish the 5 Quests selected for this month, you account will be cancelled for next month\n`;
				}

				message += `\nThis is an automated message for tracking purposes.`;

				const url = `${WhatsAppAPIBase}\/chat\/sendmessage/${phoneNumber}`;
				const options = {
					method: 'POST',
					payload: {
						message: message
					}
				};
				UrlFetchApp.fetch(url, options);
				sheet.getRange(position + 1, letterValue('m') + 1).setValue(true);
			}
		}
	});
}
