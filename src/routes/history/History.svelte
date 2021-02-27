<script>
	import { query } from "svelte-apollo";
	import { HISTORY } from "queries"
	import GamePreview from "../home/GamePreview.svelte"
    import { currentUser } from "login/CurrentUser.js"

	let includeOngoing = true
	let includeFinished = true
	let onlyMyGames = false
	
	$: users = onlyMyGames ? [currentUser.getUser().uuid] : null;
	
	const historyData = query(HISTORY, {
		variables: { users, includeOngoing, includeFinished }
	});
	
	$: historyData.refetch({users, includeOngoing, includeFinished });
</script>

<main>
	<div class="rounded-md border border-indigo-600 p-5 m-3 w-72">
		<h1 class="text-xl">Filters</h1>
		<div class="pl-5 ">
			<input id="include_ongoing" type=checkbox bind:checked={includeOngoing}>
			<label for="include_ongoing">Include Ongoing Games</label>
		</div>
		<div class="pl-5">
			<input id="include_finished" type=checkbox bind:checked={includeFinished}>
			<label for="include_finished">Include Finished Games</label>
		</div>
		{#if $currentUser.isLoggedIn}
			<div class="pl-5">
				<input id="only_my_games" type=checkbox bind:checked={onlyMyGames}>
				<label for="only_my_games">Only my games</label>
			</div>
		{/if}
	</div>
	{#if $historyData.loading}
		<p>Loading...</p>
	{:else if $historyData.error}
		<p>ERROR: {$historyData.error.message}</p>
	{:else}
		{#if $historyData.data.games.length > 0}
			<div class="flex flex-row flex-wrap">
				{#each $historyData.data.games as game}
					<GamePreview game = {game} />
				{/each}
			</div>
		{:else}
			<p>No Games Found</p>
		{/if}
	{/if}
</main>
