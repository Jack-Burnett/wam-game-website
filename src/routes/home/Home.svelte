<script>
	import { query } from "svelte-apollo";
	import { HOME_PAGE } from "queries"
	import Challenge from "./Challenge.svelte";
	import Invite from "./Invite.svelte"
	import SentInvite from "./SentInvite.svelte"
	import GamePreview from "./GamePreview.svelte"
	
	const homeData = query(HOME_PAGE);
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
						{#each $homeData.data.me.receivedInvites as invite}
							<Invite {invite} />
						{/each}
						{#each $homeData.data.me.sentInvites as invite}
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
				<p>You are not logged in</p>
			{/if}
		{/if}
</main>
