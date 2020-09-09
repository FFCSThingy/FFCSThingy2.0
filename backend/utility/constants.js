export const messages = {
	serverError: 'Internal Server Error',
	upToDate: 'Up To Date',
	notFound: 'Not Found',
};

export function failJson(msg = messages.serverError) {
	return ({
		success: false,
		message: msg,
	});
}
