//@ts-nocheck

const findChapterCount = (dao: Dao, novelId: string) => {
	return;
};

onRecordAfterCreateRequest((e) => {
	if (e.collection?.name === 'chapters' && e.record) {
		const record = e.record;
		const novelId = record.get('novel') as string;

		const result = arrayOf(DynamicModel({ id: '' }));
		$app
			.dao()
			.db()
			.select('id')
			.from('chapters')
			.where($dbx.exp('novel = {:id}', { id: novelId }))
			.all(result);
		const chapterCount = result.length;

		const novel = $app.dao().findRecordById('novels', novelId);
		const form = new RecordUpsertForm($app, novel);
		form.loadData({
			chaptersCount: chapterCount
		});
		form.submit();
	}
});

onRecordAfterDeleteRequest((e) => {
	if (e.collection?.name === 'chapters' && e.record) {
		const record = e.record;
		const novelId = record.get('novel') as string;

		const result = arrayOf(DynamicModel({ id: '' }));
		$app
			.dao()
			.db()
			.select('id')
			.from('chapters')
			.where($dbx.exp('novel = {:id}', { id: novelId }))
			.all(result);
		const chapterCount = result.length;

		const novel = $app.dao().findRecordById('novels', novelId);
		const form = new RecordUpsertForm($app, novel);
		form.loadData({
			chaptersCount: chapterCount
		});
		form.submit();
	}
});
