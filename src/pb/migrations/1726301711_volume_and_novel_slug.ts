migrate(
	(db) => {
		const dao = new Dao(db);

		// add volumes field
		const chaptersCol = dao.findCollectionByNameOrId('chapters');
		//@ts-ignore
		chaptersCol.indexes = [
			'CREATE UNIQUE INDEX `idx_yWfa25z` ON `chapters` (\n  `novel`,\n  `value`,\n  `volume`\n)'
		];
		chaptersCol.schema.addField(
			new SchemaField({
				system: false,
				id: 'chapter_volume',
				name: 'volume',
				type: 'number',
				required: true,
				presentable: false,
				unique: false,
				options: {
					min: 1,
					max: null,
					noDecimal: true
				}
			})
		);
		dao.saveCollection(chaptersCol);
		dao.db().update('chapters', { volume: 1 }, $dbx.exp('volume = 0')).execute();

		// add slug field
		const novelsCol = dao.findCollectionByNameOrId('novels');
		novelsCol.schema.addField(
			new SchemaField({
				system: false,
				id: 'novel_slug',
				name: 'slug',
				type: 'text',
				required: true,
				presentable: false,
				unique: false,
				options: {
					min: 3,
					max: null,
					pattern: '^[\\w\\d\\-]+$'
				}
			})
		);
		dao.saveCollection(novelsCol);
		const novels = arrayOf(new DynamicModel({ id: '' }));
		dao.db().select('id').from('novels').all(novels);
		novels.forEach((novel) => {
			const id = (novel as any).id as string;
			dao.db().update('novels', { slug: id }, $dbx.exp('id = {:id}', { id })).execute();
		});
		//@ts-ignore
		novelsCol.indexes = [
			'CREATE UNIQUE INDEX `idx_5s7kVUu` ON `novels` (\n  `title`\n)',
			'CREATE UNIQUE INDEX `novel_slug` ON `novels` (\n  `slug`\n)'
		];
		dao.saveCollection(novelsCol);
	},
	(db) => {
		const dao = new Dao(db);

		// remove volume field
		const chaptersCol = dao.findCollectionByNameOrId('chapters');
		//@ts-ignore
		chaptersCol.indexes = [
			'CREATE UNIQUE INDEX `idx_yWfa25z` ON `chapters` (\n  `novel`,\n  `value`\n)'
		];
		chaptersCol.schema.removeField('chapter_volume');
		dao.saveCollection(chaptersCol);

		// remove slug field
		const novelsCol = dao.findCollectionByNameOrId('novels');
		//@ts-ignore
		// novelsCol.indexes = ['CREATE UNIQUE INDEX `idx_5s7kVUu` ON `novels` (\n  `title`\n)'];
		novelsCol.schema.removeField('novel_slug');
		dao.saveCollection(novelsCol);
	}
);
