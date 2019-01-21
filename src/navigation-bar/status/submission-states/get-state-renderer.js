export default function getStateRenderer (states, ...args) {
	const matching = states
		.filter((state) => {
			if (state.case) { return state.case(...args); }
			if (state.cases) { return state.cases.some(c => c(...args)); }

			return false;
		});

	const match = matching[0];

	return match && match.render;
}
