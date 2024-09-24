migrate(
	(db) => {
		const collection = new Collection({
			id: '58rmcrqdwj5kvwq',
			name: 'chapterComments',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'y0et5e3l',
					name: 'chapter',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: 'r1p8j27j8thyimn',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null
					}
				},
				{
					system: false,
					id: 'ytmy7ema',
					name: 'user',
					type: 'relation',
					required: true,
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
					id: '40kpgbkx',
					name: 'content',
					type: 'text',
					required: true,
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
					id: 'eb6t3tmu',
					name: 'reactions',
					type: 'json',
					required: false,
					presentable: false,
					unique: false,
					options: {
						maxSize: 2000000
					}
				},
				{
					system: false,
					id: 'fz3sacox',
					name: 'contentUpdated',
					type: 'date',
					required: false,
					presentable: false,
					unique: false,
					options: {
						min: '',
						max: ''
					}
				},
				{
					system: false,
					id: 'fdblizc2',
					name: 'deleted',
					type: 'bool',
					required: false,
					presentable: false,
					unique: false,
					options: {}
				}
			] as any,
			listRule: '',
			viewRule: '',
			createRule: '@request.auth.id=@request.data.user.id && @request.data.reactions:isset=false',
			updateRule: '@request.auth.id=@request.data.user.id && @request.data.reactions:isset=false',
			deleteRule: '@request.auth.id=@request.data.user.id'
		});

		return new Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('58rmcrqdwj5kvwq');

		return dao.deleteCollection(collection);
	}
);
