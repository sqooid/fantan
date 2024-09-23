migrate(
	(db) => {
		const collection = new Collection({
			id: '1z8kpa02w8jrbos',
			name: 'chapterCommentReactions',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'kijh7ahh',
					name: 'comment',
					type: 'relation',
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: '58rmcrqdwj5kvwq',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: '60dhyagh',
					name: 'user',
					type: 'relation',
					required: false,
					presentable: false,
					unique: false,
					options: {
						collectionId: '_pb_users_auth_',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: 'qkrr336e',
					name: 'reaction',
					type: 'text',
					required: false,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				}
			] as any,
			indexes: [
				'CREATE UNIQUE INDEX `idx_INgKRSX` ON `chapterCommentReactions` (\n  `comment`,\n  `user`,\n  `reaction`\n)'
			] as any,
			listRule: '@request.auth.id!=""',
			viewRule: '@request.auth.id!=""',
			createRule: '@request.auth.id!="" && @request.auth.id=@request.data.user.id',
			updateRule: '@request.auth.id!="" && @request.auth.id=@request.data.user.id',
			deleteRule: '@request.auth.id!="" && @request.auth.id=@request.data.user.id'
		});

		return new Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('1z8kpa02w8jrbos');

		return dao.deleteCollection(collection);
	}
);
