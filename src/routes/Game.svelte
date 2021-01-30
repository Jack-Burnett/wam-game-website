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
    	pollInterval: 500
	});

	const Relationship = {
		PLAYER1: "Player1",
		PLAYER2: "Player2",
		NEITHER: "Neither",
		UNKNOWN: "Unknown"
	}

	const PersonalState = {
		AWAITING_YOU: "You",
		AWAITING_THEM: "Them",
		FINISHED: "Finished",
		NOT_INVOLVED: "Irrelevant",
		UNKNOWN: "Unknown"
	}
	
	const relationship = derived(
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
	
	const personalState = derived(
		[gameData, relationship],
		([$gameData, $relationship]) => {
			console.log(":)")
			if (!$gameData.data || $relationship == Relationship.UNKNOWN) {
				return PersonalState.UNKNOWN
			}
			const state = $gameData.data.game.state
			if ( $relationship == Relationship.PLAYER1) {
				if (state == "WAITING_PLAYER_1" || state == "WAITING_BOTH") {
					return PersonalState.AWAITING_YOU
				} else if (state == "WAITING_PLAYER_2") {
					return PersonalState.AWAITING_THEM
				} else if (state == "FINISHED") {
					return PersonalState.FINISHED
				}
			}
			if ( $relationship == Relationship.PLAYER2) {
				if (state == "WAITING_PLAYER_2" || state == "WAITING_BOTH") {
					return PersonalState.AWAITING_YOU
				} else if (state == "WAITING_PLAYER_1") {
					return PersonalState.AWAITING_THEM
				} else if (state == "FINISHED") {
					return PersonalState.FINISHED
				}
			}
			if ( $relationship == Relationship.NEITHER) {
				if (state == "FINISHED") {
					return PersonalState.FINISHED
				} else {
					return PersonalState.NOT_INVOLVED
				}
			}
		}
	);
	
	const actions = derived(
		[gameData],
		([$gameData]) => {
			if (!$gameData.data) {
				return []
			}
			return JSON.parse($gameData.data.game.data)
		}
	);

	let match = new Match(actions)

</script>

<main>
	{#if $gameData.loading}
		Loading...
	{:else if $gameData.error}
		<li>ERROR: {$gameData.error.message}</li>
	{:else}
		<h2 class="text-2xl mb-5"> {$gameData.data.game.player1.username} vs {$gameData.data.game.player2.username} </h2>
		<div class = "flex flex-row">
			<Board match={match} />
			{#if $personalState == PersonalState.AWAITING_YOU}
				<Inputs />
			{:else if $personalState == PersonalState.AWAITING_THEM}
				<p>Waiting for your opponent to take their turn...</p>
			{:else if $personalState == PersonalState.FINISHED}
				<p>The game is over!</p>
			{:else if $personalState == PersonalState.NOT_INVOLVED}
				<p>You are not in this game. The game is waiting for player input.</p>
			{/if}
		</div>
	{/if}
</main>