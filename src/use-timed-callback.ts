import { useRef, useMemo } from 'react';

/** Timed callback event Object */
export interface UseTimedCallbackEventI<T = unknown> {
	/** First Call */
	readonly first: boolean;
	/** Callback count */
	readonly count: number;
	/** Inital time */
	readonly start: number;
	/** Previous time */
	readonly previous: number;
	/** Now Time */
	readonly now: number;
	/** Duration since last callback */
	readonly duration: number;
	/** Mutatable user defined data */
	userData: T;
}

/** Timed callback function */
export type UseTimedCallback<T = unknown> = (event: UseTimedCallbackEventI<T>) => void;

/**
 * Creates a function that tracks time and other useful things in the callback
 * @param callback References callback
 * @param userDataInit User defined data provied in callback event
 * @returns callback function
 * @example
 * const callback = useTimedCallback(({count}) => {
 *   console.log(count);
 * });
 * useEffect(() => {
 *   setInterval(callback, 1000);
 * }, []);
 */
export function useTimedCallback<T = unknown>(callback: UseTimedCallback<T>, userDataInit = undefined as T): () => void {
	const ref = useRef(callback);
	ref.current = callback;
	const userDataInitRef = useRef(userDataInit);

	return useMemo(() => {
		const start = Date.now();
		let count = 1;
		let previous = start;
		let userData = userDataInitRef.current;

		return () => {
			const now = Date.now();
			const event = {
				first: count === 1,
				count,
				start,
				previous,
				now,
				duration: now - previous,
				userData,
			}

			if (ref.current) {
				ref.current(event);
				userData = event.userData;
				previous = now;
				count += 1;
			}
		}
	}, []);
}