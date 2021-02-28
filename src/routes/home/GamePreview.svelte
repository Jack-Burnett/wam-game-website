<script>
	import Match from 'routes/game/state.js'
	import Board from "routes/game/Board.svelte";
	import { writable } from 'svelte/store';
	import { Link } from "svelte-routing";

	export let game;

	const actions = writable(JSON.parse(game.data))
	const match = new Match(actions, 200)
</script>

<main>
	<Link to="game/{game.uuid}">
		<div class="flex flex-row rounded-md border border-indigo-600 p-5 m-3 hover:bg-blue-700">
			<Board  match= {match} scale="small" />
			<div class="w-40 ml-5 overflow-hidden">
				<p>{game.player1.username} vs {game.player2.username}</p>
				<p>Turn {game.turn}</p>
				{#if game.state == "WAITING_PLAYER_1"}
					<p>Waiting for {game.player1.username}</p>
				{:else if game.state == "WAITING_PLAYER_2"}
					<p>Waiting for {game.player2.username}</p>
				{:else if game.state == "WAITING_BOTH"}
					<p>Waiting for both players</p>
				{:else if game.state == "FINISHED"}
					<p>Game complete</p>
				{:else}
					<p>{game.state}</p>
				{/if}
			</div>
		</div>
	</Link>
</main>
