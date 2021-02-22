function stateMatches(state, args) {
	if (state.case) {
		return state.case(...args);
	}
	if (state.cases) {
		return state.cases.some(c => c(...args));
	}

	return false;
}

export default function getStateRenderer(states, ...args) {
	for (let state of states) {
		if (stateMatches(state, args)) {
			return state.render;
		}
	}

	return null;
}
