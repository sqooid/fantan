migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('chapters');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'j2dj0egc',
				name: 'views',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: 0,
					max: null,
					noDecimal: true
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('chapters');

		// remove
		collection.schema.removeField('j2dj0egc');

		return dao.saveCollection(collection);
	}
);
