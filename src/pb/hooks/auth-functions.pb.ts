export const verifyToken = (token: string, ip: string): string | null => {
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
	const jwt = $security.createJWT({ ip } as any, key, 60 * 60 * 24 * 7);
	return jwt;
};

export const parseToken = (token: string, ip: string): boolean => {
	try {
		const { ip: tokenIp } = $security.parseJWT(token, $app.store().get('turnstileTokenKey'));
		return ip === tokenIp;
	} catch (error) {
		return false;
	}
};
