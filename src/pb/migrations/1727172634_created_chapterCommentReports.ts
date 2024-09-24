migrate(
	(db) => {
		const collection = new Collection({
			id: 't5lbqrqk0j6u882',
			name: 'chapterCommentReports',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'emj23v4i',
					name: 'comment',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: '58rmcrqdwj5kvwq',
						cascadeDelete: true,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: 'hswznteb',
					name: 'user',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: '_pb_users_auth_',
						cascadeDelete: true,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				}
			] as any,
			indexes: [
				'CREATE UNIQUE INDEX `idx_jxISZ6G` ON `chapterCommentReports` (\n  `comment`,\n  `user`\n)'
			] as any,
			createRule: '@request.auth.id!="" && @request.auth.id=@request.data.user.id',
			options: {} as any
		});

		return new Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('t5lbqrqk0j6u882');

		return dao.deleteCollection(collection);
	}
);
