import { ClientResponseError } from 'pocketbase';

export const clearErrors = (errors: Record<string, string>) => {
	Object.keys(errors).forEach((x) => (errors[x] = ''));
};

export const parsePbError = (error: unknown) => {
	if (!(error instanceof ClientResponseError)) {
		return null;
	}
	let errors: Record<string, string> = {};
	let found = false;
	Object.keys(error.response.data ?? []).forEach((k) => {
		found = true;
		errors[k] = error.response.data[k].message;
	});
	return found ? errors : null;
};
