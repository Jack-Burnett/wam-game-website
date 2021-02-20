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
    	// pollInterval: 5000
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
			if (!$gameData.data || !$gameData.data.game) {
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
			if (!$gameData.data || !$gameData.data.game || $relationship == Relationship.UNKNOWN) {
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
			if (!$gameData.data || !$gameData.data.game) {
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
		<p>ERROR: {$gameData.error.message}</p>
	{:else}
		{#if $gameData.data.game}
			<h2 class="text-2xl mb-5"> <span class="text-red-600">{$gameData.data.game.player1.username}</span> vs <span class="text-blue-600">{$gameData.data.game.player2.username}</span> </h2>
			<div class = "flex flex-row flex-wrap">
				<Board match={match} />
				{#if $personalState == PersonalState.AWAITING_YOU}
					<Inputs game_uuid = {uuid} relationship = {relationship} />
				{:else if $personalState == PersonalState.AWAITING_THEM}
					<p>Waiting for your opponent to take their turn...</p>
				{:else if $personalState == PersonalState.FINISHED}
					<p>The game is over!</p>
				{:else if $personalState == PersonalState.NOT_INVOLVED}
					<p>You are not in this game. The game is waiting for player input.</p>
				{/if}
			</div>
		{:else}
			<p>This game does not exist</p>
		{/if}
	{/if}
</main>