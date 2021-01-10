<script>
	import { element } from "svelte/internal";
	import Element from '../game/Element.svelte'
	import Promise from './Promise.svelte'
	import Random from "seedrandom";
	var rng = Random('hello..');
	console.log(rng()); 
	// public vars
	export let name = 'Default Value';
	export let src;
	// private var
	let count = 0;
	// Reactive value
	$: doubled = count * 2;
    // reactive funtion :o
	$: { console.log(`the count is ${count}`); }

	let things = [
		{id : 1, name: "Bandit Keith"},
		{id : 2, name: "Jane Doe"},
	]
	
	function handleClick() {
		count += 1;
	}
	
	// proper array updates
	let numbers = [1, 2, 3, 4];
	function addNumber() {
		numbers = [...numbers, numbers.length + 1];
	}

	let obj = {
		'text' : 'third'
	}
</script>

<main>
	<h1>Hello {name} {doubled}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<img src={src} alt="frog">
	<button on:click={handleClick}>{count}</button>
	<button on:click={addNumber}>{numbers.join(' + ')}</button>
	<Promise />
	<Element text='yolo'/>
	<Element text='yolo'/>
	<!-- Lets us pass in many values at once-->
	<Element {...obj}/>
	<ul>
	<!-- Brackets specify what identifies it, useful when removing or updating-->
	{#each things as thing (thing.id)}
	<li>{thing.name}</li>
	{/each}
	</ul>

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>