<script>
import { select_option } from "svelte/internal";


	async function getRandomNumber() {
		const res = await fetch(`https://svelte.dev/tutorial/random-number`);
		const text = await res.text();

		if (res.ok) {
			return text;
		} else {
			throw new Error(text);
		}
	}

	let promise = getRandomNumber();

	function handleClick() {
		promise = getRandomNumber();
	}
</script>

<main>
	<button on:click={handleClick}>
		generate random number
	</button>
	{#await promise}
		<p>...waiting</p>
	{:then number}
		<p>The number is {number}</p>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>