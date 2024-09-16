routerAdd('POST', '/c/turnstile-verify', (c) => {
	const { token } = JSON.parse(readerToString(c.request().body));
	const ip = c.request().header.get('X-Forwarded-For');
	const { verifyToken } = require(`${__hooks}/auth-functions.pb.js`);
	const jwt = verifyToken(token, ip);
	if (!jwt) {
		return c.json(403, { error: 'Invalid token' });
	}
	return c.json(200, { token: jwt });
});

routerAdd('POST', '/c/turnstile-test', (c) => {
	const { token } = JSON.parse(readerToString(c.request().body));
	const ip = c.request().header.get('X-Forwarded-For');
	const { parseToken } = require(`${__hooks}/auth-functions.pb.js`);
	const valid = parseToken(token, ip);
	if (valid) {
		return c.json(200, {});
	}
	return c.json(403, {});
});

onRecordBeforeCreateRequest((e) => {
	const { turnstileToken: token, password } = $apis.requestInfo(e.httpContext).data;
	if (password) {
		const ip = e.httpContext.request().header.get('X-Forwarded-For');
		const { verifyToken } = require(`${__hooks}/auth-functions.pb.js`);
		const jwt = verifyToken(token, ip);
		if (!jwt) throw new BadRequestError('Invalid token', { status: 403 });
	}
}, 'users');
