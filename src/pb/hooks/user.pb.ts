//@ts-ignore
routerAdd('GET', '/c/user', (c) => {
	const id = c.queryParam('id');
	const result = new DynamicModel({ username: '', name: '' });
	$app
		.dao()
		.db()
		.select('username', 'name')
		.from('users')
		.where($dbx.exp('id = {:id}', { id }))
		.one(result);
	c.json(200, result);
});
