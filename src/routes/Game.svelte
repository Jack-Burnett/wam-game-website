<script>
	import { query } from "svelte-apollo";
	import { GAME } from "./queries";
	import Inputs from '../game/Inputs.svelte'
	import Board from '../game/Board.svelte'
	import Match from '../game/state.js'
	import { derived } from 'svelte/store';
    import { currentUser } from "../CurrentUser.js"

	export let uuid
	
	const gameData = query(GAME, {
		variables: { uuid },
	});

	const Relationship = {
		PLAYER1: "Player1",
		PLAYER2: "Player2",
		NEITHER: "Neither",
		UNKNOWN: "Unknown"
	}
	
	export const relationship = derived(
		[gameData, currentUser],
		([$gameData, $currentUser]) => {
			if (!$gameData.data) {
				return Relationship.UNKNOWN
			}
			if ($gameData.data.game.player1.uuid == $currentUser.uuid) {
				return Relationship.PLAYER1
			}
			if ($gameData.data.game.player2.uuid == $currentUser.uuid) {
				return Relationship.PLAYER2
			}
			return Relationship.NEITHER
		}
	);

	let match = new Match()

</script>

<main>
	{#if $gameData.loading}
		Loading...
	{:else if $gameData.error}
		<li>ERROR: {$gameData.error.message}</li>
	{:else}
		<h2 class="text-2xl mb-5"> {$gameData.data.game.player1.username} vs {$gameData.data.game.player2.username} </h2>
		<div class = "flex flex-row">
			<Board />
			<Inputs />
		</div>
	{/if}
</main>