<script>
	import { query } from "svelte-apollo";
	import { HOME_PAGE } from "queries"
	import Challenge from "./Challenge.svelte";
	import Invite from "./Invite.svelte"
	import SentInvite from "./SentInvite.svelte"
	import GamePreview from "./GamePreview.svelte"
	import { onMount } from 'svelte';
	
	const homeData = query(HOME_PAGE);
	
	// Reload when you switch to this tab (as games may have been accepted or played)
	onMount(() => {
		homeData.refetch()
	});

</script>

<main>
		{#if $homeData.loading}
			Loading...
		{:else if $homeData.error}
			<li>ERROR: {$homeData.error.message}</li>
		{:else}
			{#if $homeData.data.me}
				<h2 class="text-2xl"> Your active games </h2>
				{#if $homeData.data.me.activeGames.length > 0}
					<div class="flex flex-row flex-wrap">
					{#each $homeData.data.me.activeGames as game}
						<GamePreview game = {game} />
					{/each}
				</div>
				{:else}
					You don't have any active games currently!
				{/if}
				{#if $homeData.data.me.receivedInvites.length > 0 || $homeData.data.me.sentInvites.length > 0}
					<h2 class="text-2xl"> Invites </h2>
					<div class="flex flex-row flex-wrap">
						{#each $homeData.data.me.receivedInvites as invite (invite.uuid)}
							<Invite me={$homeData.data.me} {invite} />
						{/each}
						{#each $homeData.data.me.sentInvites as invite (invite.uuid)}
							<SentInvite {invite} />
						{/each}
					</div>
				{/if}
				<h2 class="text-2xl"> Challenge someone </h2>
				<div class="flex flex-row flex-wrap">
					{#each $homeData.data.users as user}
						<Challenge {user} />
					{/each}
				</div>
			{:else}
				<p>You are not logged in!</p>
				<p>You can use the Learn button above to find out how to play or the History button to watch others games.</p>
				<p>When you are ready to play, press the Register / Login button!</p>
			{/if}
		{/if}
</main>
