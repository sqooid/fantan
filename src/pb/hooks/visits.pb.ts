routerAdd('POST', '/c/chapter-visit', (c) => {
	const { chapterId, jwt } = JSON.parse(readerToString(c.request().body));
	const { parseToken } = require(`${__hooks}/auth-functions.pb.js`);
	const result = parseToken(jwt, c);
	if (!result) {
		return c.json(403, {});
	}
	const visitsCol = $app.dao().findCollectionByNameOrId('chapterVisits');
	const record = new Record(visitsCol);
	const form = new RecordUpsertForm($app, record);
	form.loadData({ chapter: chapterId, idHash: result.id });
	try {
		form.submit();
	} catch (error) {
		// already visited, throws unique constraint error
		return c.json(200, {});
	}

	// Increment view counts
	const chapterRecord = $app.dao().findRecordById('chapters', chapterId);
	const chapterViews = chapterRecord.getInt('views') + 1;

	// TODO: move to cron if performance is an issue
	const novelRecord = $app.dao().findRecordById('novels', chapterRecord.get('novel'));
	if (novelRecord.getInt('views') < chapterViews) {
		const novelForm = new RecordUpsertForm($app, novelRecord);
		novelForm.loadData({
			views: chapterViews
		});
		novelForm.submit();
	}

	const chapterForm = new RecordUpsertForm($app, chapterRecord);
	chapterForm.loadData({
		views: chapterViews
	});
	chapterForm.submit();

	return c.json(200, {});
});

cronAdd('visitCountClean', '0 * * * *', () => {
	// delete all chapterVisists records
	$app.dao().db().delete('chapterVisits', $dbx.exp('')).execute();
});
