export type Getter = <T>(store: { $: T }) => T;
type DerivedFn<T> = (get: Getter) => T;
type ValueOrFn<T> = T | DerivedFn<T>;

interface WritableIon<T> {
	$: T;
}

interface ReadonlyIon<T> {
	readonly $: T;
}

function ion<T>(value: T): WritableIon<T>;
function ion<R>(fn: (get: Getter) => R): ReadonlyIon<R>;
function ion<T>(valueOrFn: ValueOrFn<T>): WritableIon<T> | ReadonlyIon<T> {
	const get: Getter = (store) => store.$;

	if (typeof valueOrFn === 'function') {
		const derivedFn = valueOrFn as (get: Getter) => T;
		const state = $derived(derivedFn(get));

		return {
			get $() {
				return state;
			}
		} as ReadonlyIon<T>;
	}

	let state = $state(valueOrFn);

	const store = {} as WritableIon<T>;
	Object.defineProperty(store, '$', {
		get() {
			return state;
		},
		set(value: T) {
			state = value;
		},
		configurable: true,
		enumerable: true
	});

	return store;
}

const ionWithReset = <T>(value: T) => {
	const initial = value;
	let state = $state(value);

	return {
		get $() {
			return state;
		},
		set $(val: T) {
			state = val;
		},
		reset() {
			state = initial;
		}
	};
};

interface ReadOnlyState<T> {
	$: T;
}

const ionReadOnly = <T>(value: T): { get $(): T } => {
	const state = $state(value) as ReadOnlyState<T>;

	return {
		get $() {
			return state.$;
		}
	};
};

const ionWithStorage = <T>(key: string, initialValue: T) => {
	const getStoredValue = () => {
		if (typeof window === 'undefined') return null;
		try {
			const item = localStorage.getItem(key);
			return item;
		} catch (err) {
			return console.error('Error reading from localStorage:', err);
		}
	};

	const stored = getStoredValue();
	let state = $state(stored ? JSON.parse(stored) : initialValue);

	const cleanup = $effect.root(() => {
		$effect(() => {
			if (typeof window !== 'undefined') {
				try {
					localStorage.setItem(key, JSON.stringify(state));
				} catch (err) {
					console.error('Error writing to localStorage:', err);
				}
			}
		});

		return () => {
			console.log('Storage effect cleaned up for', key);
		};
	});

	return {
		get $() {
			return state;
		},
		set $(val: T) {
			state = val;
		},
		cleanup
	};
};

export { ion, ionWithStorage, ionWithReset, ionReadOnly };
