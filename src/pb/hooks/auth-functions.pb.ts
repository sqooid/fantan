export const verifyToken = (token: string, c: echo.Context): string | null => {
	const ip = c.request().header.get('X-Forwarded-For');
	const userAgent = c.request().header.get('User-Agent');
	const res = $http.send({
		method: 'POST',
		url: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		body: JSON.stringify({
			response: token,
			remoteip: ip,
			secret: $os.getenv('TURNSTILE_SECRET_KEY')
		}),
		headers: {
			'Content-Type': 'application/json'
		},
		timeout: 10
	});
	if (res.statusCode !== 200 || !res.json.success) {
		return null;
	}
	let key = $app.store().get('turnstileTokenKey');
	if (!key) {
		key = $security.randomString(32);
		$app.store().set('turnstileTokenKey', key);
	}
	const id = $security.sha256(`${ip}${userAgent}`);
	const jwt = $security.createJWT({ id } as any, key, 60 * 60 * 24 * 7);
	return jwt;
};

export const parseToken = (jwt: string, c: echo.Context) => {
	try {
		const ip = c.request().header.get('X-Forwarded-For');
		const userAgent = c.request().header.get('User-Agent');
		const { id } = $security.parseJWT(jwt, $app.store().get('turnstileTokenKey'));
		const currentId = $security.sha256(`${ip}${userAgent}`);
		if (id !== currentId) {
			return null;
		}
		return { id };
	} catch (error) {
		return null;
	}
};
