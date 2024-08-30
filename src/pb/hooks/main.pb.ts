//@ts-nocheck

routerAdd('GET', '/c/test', (c) => {
	const message: string = 'hello';
	return c.json(200, { message });
});
