function NewScrapCompletedQuests() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
	const sheetData = sheet.getDataRange().getValues();
	const SheetHeader = sheetData[0];
	const getQuestNameRegex = new RegExp(/(Completion Status )(\[)(.*?)(\])/m);

	let QwikLabsURLSheetIndex = null;
	let QuestsNames = [];

	SheetHeader.forEach((item, pos) => {
		const NameRegexResult = getQuestNameRegex.exec(item);
		if (NameRegexResult && NameRegexResult[3]) {
			QuestsNames.push({
				index: pos,
				name: NameRegexResult[3]
			});
		} else if (item === 'QwikLabs Profile URL') {
			QwikLabsURLSheetIndex = pos;
		}
	});

	sheetData.map(async (item, position) => {
		if (position === 0) {
			return false;
		} else {
			const url = item[QwikLabsURLSheetIndex];

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
