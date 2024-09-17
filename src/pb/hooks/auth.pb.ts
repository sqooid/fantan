routerAdd('POST', '/c/turnstile-verify', (c) => {
	const { token } = JSON.parse(readerToString(c.request().body));
	const { verifyToken } = require(`${__hooks}/auth-functions.pb.js`);
	const jwt = verifyToken(token, c);
	if (!jwt) {
		return c.json(403, { error: 'Invalid token' });
	}
	return c.json(200, { jwt });
});

routerAdd('POST', '/c/turnstile-test', (c) => {
	const { jwt } = JSON.parse(readerToString(c.request().body));
	const { parseToken } = require(`${__hooks}/auth-functions.pb.js`);
	const valid = parseToken(jwt, c);
	if (valid) {
		return c.json(200, {});
	}
	return c.json(403, {});
});

onRecordBeforeCreateRequest((e) => {
	const { turnstileToken: token, password } = $apis.requestInfo(e.httpContext).data;
	if (password) {
		const { verifyToken } = require(`${__hooks}/auth-functions.pb.js`);
		const jwt = verifyToken(token, e.httpContext);
		if (!jwt) throw new BadRequestError('Invalid token', { status: 403 });
	}
}, 'users');
