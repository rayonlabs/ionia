![Ionia](static/ionia.jpg)

# Ionia
[Ionia Website](https://ionia.dev)

📃 Flexible, Atomic Global State Management for Svelte 5 Rune

### Basic Usage

Define your stores:


```typescript
import { ion } from 'ionia';

export const counter = ion(0);
```

Use them in your components:

```svelte
<script lang="ts">
 	import { counter } from '$stores';
</script>

<p>{counter.$}</p>
<button onclick={() => counter.$++}>Increment Counter</button>
```

### Further Examples

```typescript
// stores.svelte.ts
import { ion, ionReadOnly, ionWithReset, ionWithStorage } from 'ionia';

// Primary Store
export const counter = ion(0);

// Derived Globaly Store
export const counterPlusOne = ion<number>((get) => get(counter) + 1);

// Read Only Store
export const readOnlyCounter = ionReadOnly(counter);

// or Alternatively
export const counterPlusOne = ion<number>((get) => get(counter));

// Resettable
export const counter = ionWithReset(0);

// Local Storage
export const storageCounter = ionWithStorage('counter', 0);
```

Usage in svelte files:

```svelte
<script lang="ts">
 	import { counter, counterPlusOne } from '$stores';
</script>

<p>{counter.$}</p>
<button onclick={() => counter.$++}>Increment Counter</button>
```

or a Derived Example

```svelte
<script lang="ts">
 	import { counterPlusOne, counter } from '$stores';
</script>

<p>{counterPlusOne.$}</p>
<button onclick={() => counter.$++}>Increment Counter</button>
```
