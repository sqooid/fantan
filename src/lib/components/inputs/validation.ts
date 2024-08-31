export const clearErrors = (errors: Record<string, string>) => {
	Object.keys(errors).forEach((x) => (errors[x] = ''));
};
