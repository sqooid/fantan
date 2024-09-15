routerAdd('GET', '/c/chapter-search', (c) => {
	const slug = c.queryParam('slug');
	const volume = c.queryParam('volume');
	const chapter = c.queryParam('chapter');

	try {
		const novelData = new DynamicModel({ id: '' }) as { id: string };
		$app
			.dao()
			.db()
			.select('id')
			.from('novels')
			.where($dbx.exp('slug = {:slug}', { slug }))
			.one(novelData);
		const chapterData = new DynamicModel({ id: '' }) as { id: string };
		$app
			.dao()
			.db()
			.select('id')
			.from('chapters')
			.where(
				$dbx.exp('novel = {:novel} AND volume = {:volume} AND value = {:chapter}', {
					novel: novelData.id,
					volume,
					chapter
				})
			)
			.one(chapterData);
		return { chapterId: chapterData.id };
	} catch (error) {
		return { chapterId: '' };
	}
});
