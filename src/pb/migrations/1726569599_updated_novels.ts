migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('novels');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ql9fwjow',
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
		const collection = dao.findCollectionByNameOrId('novels');

		// remove
		collection.schema.removeField('ql9fwjow');

		return dao.saveCollection(collection);
	}
);
