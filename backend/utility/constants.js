const messages = {
	serverError: 'Internal Server Error',
	upToDate: 'Up To Date',
	notFound: 'Not Found',
	notAuth: 'Not Authenticated',
	notVtop: 'Not signed in to VTOP',
	notAdmin: 'Not an admin. Admin privileges required for this action',
};

function failJson(msg = messages.serverError) {
	return ({
		success: false,
		message: msg,
	});
}

const userScopes = {
	user: 'user',
	admin: 'admin',
};

const envs = {
	PROD: 'production',
	DEV: 'development',
	STG: 'staging',
};

module.exports = {
	messages,
	failJson,
	userScopes,
	envs,
};
