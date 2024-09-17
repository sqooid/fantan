migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('r1p8j27j8thyimn');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'j2dj0egc',
				name: 'views',
				type: 'number',
				required: true,
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
		const collection = dao.findCollectionByNameOrId('r1p8j27j8thyimn');

		// remove
		collection.schema.removeField('j2dj0egc');

		return dao.saveCollection(collection);
	}
);
