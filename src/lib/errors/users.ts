import type { ClientResponseError } from 'pocketbase';

export const parseUserError = (error: ClientResponseError) => {
	error.data;
};
