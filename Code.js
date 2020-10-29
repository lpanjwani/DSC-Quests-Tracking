function NewScrapCompletedQuests() {
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
				const websiteContent = await UrlFetchApp.fetch(url).getContentText();

				QuestsNames.forEach(quest => {
					const isCompleted = websiteContent.includes(quest.name);
					sheet.getRange(position + 1, quest.index + 1).setValue(isCompleted);
				});
			} else {
				QuestsNames.forEach(quest => {
					sheet.getRange(position + 1, quest.index + 1).setValue(false);
				});
			}
		}
	});
}
