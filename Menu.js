function onOpen() {
	const ui = SpreadsheetApp.getUi();

	ui.createMenu('Quests Functions')
		.addItem('Retrieve Completed Quests', 'NewScrapCompletedQuests')
		.addToUi();

	ui.createMenu('WhatsApp Messages')
		.addItem('Registration Confirmations', 'SendWhatsAppEntryMessages')
		.addItem('Quests Reminder', 'SendWhatsAppReminders')
		.addItem('Monthly Subscription Instructions', 'SendWhatsAppMonthlySubscriptionDetails')
		.addToUi();
}
