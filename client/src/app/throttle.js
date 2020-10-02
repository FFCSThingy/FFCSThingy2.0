export default function throttle(callback, limit) {
	let waiting = false; // Initially, we're not waiting
	let latestCallThis = null;
	let latestCallArgs = null;
	const throttledFunction = function throttledFunction(...args) {
		if (waiting) {
			// save latest call infos
			latestCallThis = this;
			latestCallArgs = args;
		} else {
			callback.apply(this, args);
			waiting = true;
			setTimeout(() => {
				waiting = false;
				// check for latest call infos
				if (latestCallThis !== null) {
					throttledFunction.apply(latestCallThis, latestCallArgs);
					latestCallThis = null;
					latestCallThis = null;
				}
			}, limit);
		}
	};
	return throttledFunction;
}
