//@ts-nocheck
migrate(
	(db) => {
		const snapshot = [
			{
				id: '_pb_users_auth_',
				created: '2024-09-14 09:47:40.678Z',
				updated: '2024-09-14 09:48:08.584Z',
				name: 'users',
				type: 'auth',
				system: false,
				schema: [
					{
						system: false,
						id: 'users_name',
						name: 'name',
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
						id: 'users_avatar',
						name: 'avatar',
						type: 'file',
						required: false,
						presentable: false,
						unique: false,
						options: {
							mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'],
							thumbs: null,
							maxSelect: 1,
							maxSize: 5242880,
							protected: false
						}
					},
					{
						system: false,
						id: 'gkwqpeuj',
						name: 'history',
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
						id: 'pm0muaqs',
						name: 'discordWebhook',
						type: 'url',
						required: false,
						presentable: false,
						unique: false,
						options: {
							exceptDomains: null,
							onlyDomains: ['discord.com']
						}
					}
				],
				indexes: [],
				listRule: 'id = @request.auth.id',
				viewRule: 'id = @request.auth.id',
				createRule: '',
				updateRule: 'id = @request.auth.id',
				deleteRule: 'id = @request.auth.id',
				options: {
					allowEmailAuth: true,
					allowOAuth2Auth: true,
					allowUsernameAuth: true,
					exceptEmailDomains: null,
					manageRule: null,
					minPasswordLength: 8,
					onlyEmailDomains: null,
					onlyVerified: false,
					requireEmail: false
				}
			},
			{
				id: 'r1p8j27j8thyimn',
				created: '2024-09-14 09:48:08.584Z',
				updated: '2024-09-14 10:42:07.562Z',
				name: 'chapters',
				type: 'base',
				system: false,
				schema: [
					{
						system: false,
						id: 'mqgh7s9w',
						name: 'value',
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
						id: 'ktzcsyzr',
						name: 'title',
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
						id: 'hpzrpp7o',
						name: 'source',
						type: 'url',
						required: false,
						presentable: false,
						unique: false,
						options: {
							exceptDomains: null,
							onlyDomains: null
						}
					},
					{
						system: false,
						id: 'vibsk6jz',
						name: 'novel',
						type: 'relation',
						required: true,
						presentable: false,
						unique: false,
						options: {
							collectionId: '31j9o0g89e4xlxf',
							cascadeDelete: false,
							minSelect: null,
							maxSelect: 1,
							displayFields: null
						}
					},
					{
						system: false,
						id: 'z1qlzm5m',
						name: 'editor',
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
						id: '0zhph3o1',
						name: 'published',
						type: 'bool',
						required: false,
						presentable: false,
						unique: false,
						options: {}
					},
					{
						system: false,
						id: 'n6nsfhvf',
						name: 'content',
						type: 'json',
						required: true,
						presentable: false,
						unique: false,
						options: {
							maxSize: 2000000
						}
					},
					{
						system: false,
						id: 'vvkd5df8',
						name: 'notes',
						type: 'json',
						required: false,
						presentable: false,
						unique: false,
						options: {
							maxSize: 2000000
						}
					}
				],
				indexes: ['CREATE UNIQUE INDEX `idx_yWfa25z` ON `chapters` (\n  `novel`,\n  `value`\n)'],
				listRule: '',
				viewRule: '',
				createRule: '@request.auth.id = novel.owner.id || novel.editors.id ?= @request.auth.id',
				updateRule: '@request.auth.id = novel.owner.id || novel.editors.id ?= @request.auth.id',
				deleteRule: '@request.auth.id = novel.owner.id || novel.editors.id ?= @request.auth.id',
				options: {}
			},
			{
				id: '31j9o0g89e4xlxf',
				created: '2024-09-14 09:48:08.584Z',
				updated: '2024-09-14 10:42:07.564Z',
				name: 'novels',
				type: 'base',
				system: false,
				schema: [
					{
						system: false,
						id: 'gohjyp4i',
						name: 'title',
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
						id: '7ixhicxx',
						name: 'description',
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
						id: '78i7clkm',
						name: 'cover',
						type: 'file',
						required: false,
						presentable: false,
						unique: false,
						options: {
							mimeTypes: [],
							thumbs: [],
							maxSelect: 1,
							maxSize: 5242880,
							protected: false
						}
					},
					{
						system: false,
						id: '81qkkfrn',
						name: 'chaptersCount',
						type: 'number',
						required: false,
						presentable: false,
						unique: false,
						options: {
							min: null,
							max: null,
							noDecimal: false
						}
					},
					{
						system: false,
						id: 'bor8ceiw',
						name: 'owner',
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
						id: 'kfghgogo',
						name: 'editors',
						type: 'relation',
						required: false,
						presentable: false,
						unique: false,
						options: {
							collectionId: '_pb_users_auth_',
							cascadeDelete: false,
							minSelect: null,
							maxSelect: null,
							displayFields: null
						}
					},
					{
						system: false,
						id: 'dnmrotkm',
						name: 'originalAuthor',
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
						id: 'j0ravsig',
						name: 'originalSource',
						type: 'url',
						required: false,
						presentable: false,
						unique: false,
						options: {
							exceptDomains: null,
							onlyDomains: null
						}
					},
					{
						system: false,
						id: 'ilsxdfeh',
						name: 'sourceLanguage',
						type: 'select',
						required: true,
						presentable: false,
						unique: false,
						options: {
							maxSelect: 1,
							values: ['中文', '日本語', 'Other']
						}
					}
				],
				indexes: ['CREATE UNIQUE INDEX `idx_5s7kVUu` ON `novels` (`title`)'],
				listRule: '',
				viewRule: '',
				createRule: '@request.auth.id != "" && owner.id = @request.auth.id',
				updateRule: '@request.auth.id = owner.id',
				deleteRule: '@request.auth.id = owner.id',
				options: {}
			}
		];

		const collections = snapshot.map((item) => new Collection(item));

		return Dao(db).importCollections(collections, true, null);
	},
	(db) => {
		return null;
	}
);
