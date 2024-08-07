import { useMemo } from 'react';
import { useConRef } from '@smujdev/react-more-hooks';

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
	/** delta since last callback */
	readonly delta: number;
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
 */
export function useTimedCallback<T = unknown>(callback: UseTimedCallback<T>, userDataInit = undefined as T): () => boolean {
	const ref = useConRef(callback);
	const userDataInitRef = useConRef(userDataInit);

	return useMemo(() => {
		const start = Date.now();
		let count = 1;
		let previous = start;
		let userData = userDataInitRef.current;

		return () => {
			if (!ref.current) return false;

			const now = Date.now();
			const event = {
				first: count === 1,
				count,
				start,
				previous,
				now,
				delta: now - previous,
				userData,
			}

			try {
				ref.current(event);
				userData = event.userData;
				previous = now;
				count += 1;
			} catch (e) {
				return false;
			}
			return true;
		}
	}, []);
}