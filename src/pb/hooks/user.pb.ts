type CUserType = { username: string; name: string; id: string };
routerAdd('GET', '/c/users', (c) => {
	const ids = c.queryParam('ids').split(',');
	const data: CUserType[] = [];
	ids.forEach((id) => {
		const result = new DynamicModel({ username: '', name: '', id: '' });
		$app
			.dao()
			.db()
			.select('username', 'name', 'id')
			.from('users')
			.where($dbx.exp('id = {:id}', { id }))
			.one(result);
		data.push(result as CUserType);
	});
	c.json(200, data.length === 0 ? data[0] : data);
});
