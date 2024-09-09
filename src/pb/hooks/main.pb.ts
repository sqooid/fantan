routerAdd('GET', '/c/test', (c) => {
	const message: string = 'hel';
	return c.json(200, { message });
});
