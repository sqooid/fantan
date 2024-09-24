migrate(
	(db) => {
		const dao = new Dao(db);
		const chaptersCollection = dao.findCollectionByNameOrId('r1p8j27j8thyimn');

		chaptersCollection.createRule =
			'(@request.auth.id=novel.owner.id || novel.editors.id?=@request.auth.id) && @request.data.views:isset=false';
		chaptersCollection.updateRule =
			'(@request.auth.id=novel.owner.id || novel.editors.id?=@request.auth.id) && @request.data.views:isset=false';

		dao.saveCollection(chaptersCollection);
		const novelsCollection = dao.findCollectionByNameOrId('31j9o0g89e4xlxf');

		novelsCollection.createRule =
			'@request.auth.id!="" && owner.id=@request.auth.id && @request.data.views:isset=false';
		novelsCollection.updateRule = '@request.auth.id=owner.id && @request.data.views:isset=false';
		return dao.saveCollection(novelsCollection);
	},
	(db) => {
		const dao = new Dao(db);
		const chaptersCollection = dao.findCollectionByNameOrId('r1p8j27j8thyimn');

		chaptersCollection.createRule =
			'@request.auth.id=novel.owner.id || novel.editors.id?=@request.auth.id';
		chaptersCollection.updateRule =
			'@request.auth.id=novel.owner.id || novel.editors.id?=@request.auth.id';

		dao.saveCollection(chaptersCollection);
		const novelsCollection = dao.findCollectionByNameOrId('31j9o0g89e4xlxf');

		novelsCollection.createRule = '@request.auth.id != "" && owner.id = @request.auth.id';
		novelsCollection.updateRule = '@request.auth.id = owner.id';

		return dao.saveCollection(novelsCollection);
	}
);
