migrate(
	(db) => {
		const collection = new Collection({
			id: 'j9zejo99gnm8pgr',
			name: 'chapterVisits',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'it2pqklm',
					name: 'idHash',
					type: 'text',
					required: false,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'm98l9tzh',
					name: 'chapter',
					type: 'relation',
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: 'r1p8j27j8thyimn',
						cascadeDelete: true,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				}
			] as any,
			indexes: [
				'CREATE UNIQUE INDEX `idx_ABeEbnn` ON `chapterVisits` (\n  `idHash`,\n  `chapter`\n)'
			] as any
		});

		return new Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('j9zejo99gnm8pgr');

		return dao.deleteCollection(collection);
	}
);
