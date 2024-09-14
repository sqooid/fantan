routerAdd('GET', '/c/test', (c) => {
	const dao = $app.dao();
	const novels = arrayOf(new DynamicModel({ id: '' }));
	dao.db().select('id').from('novels').all(novels);
	$app.logger().info('info', 'novels', novels);
	novels.forEach((novel) => {
		const id = (novel as any).id as string;
		dao.db().update('novels', { slug: id }, $dbx.exp('id = {:id}', { id })).execute();
	});
});
