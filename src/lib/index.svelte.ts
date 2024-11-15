type Store<T> = {
	(): T;
	set(value: T): void;
};

function ionize<T>(store: Store<T>): T {
	let variable = $state(store());

	let updatingFromStore = false;
	let updatingFromVariable = false;

	$effect(() => {
		if (!updatingFromVariable) {
			const storeValue = store();
			if (storeValue !== variable) {
				updatingFromStore = true;
				variable = storeValue;
				updatingFromStore = false;
			}
		}
	});

	$effect(() => {
		if (!updatingFromStore) {
			const variableValue = variable;
			if (store() !== variableValue) {
				updatingFromVariable = true;
				store.set(variableValue);
				updatingFromVariable = false;
			}
		}
	});

	return variable;
}

function ion(initialValue: string) {
	let value = $state(initialValue);

	function store() {
		return value;
	}

	store.set = function (newValue: string) {
		value = newValue;
	};

	return store;
}

export { ion, ionize };
