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
	} catch (error) {}
	return c.json(200, {});
});
