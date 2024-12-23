export async function load(event) {
	return {
		role: event.locals.role,
		cool: true
	};
}
