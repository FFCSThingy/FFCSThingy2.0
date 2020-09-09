export const messages = {
	serverError: 'Internal Server Error',
	upToDate: 'Up To Date',
	notFound: 'Not Found',
	notAuth: 'Not Authenticated',
	notVtop: 'Not signed in to VTOP',
};

export function failJson(msg = messages.serverError) {
	return ({
		success: false,
		message: msg,
	});
}
