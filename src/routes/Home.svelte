<script>
	import { query } from "svelte-apollo";
	import { HOME_PAGE } from "./queries";
	import Challenge from "./Challenge.svelte";
	import Invite from "./Invite.svelte";
	import { Link } from "svelte-routing";
	
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
						<div class="flex flex-row rounded-md border border-indigo-600 p-5 m-3">
							<div class="w-40 h-40 rounded-md border border-indigo-600" ></div>
							<div class="w-40 ml-5">
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
									<Link to="game/{game.uuid}">
										<svg  class="w-16 h-16 float-right" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</Link>
									
							</div>
						</div>
					{/each}
				</div>
				{:else}
					You don't have any active games currently!
				{/if}
				{#if $homeData.data.me.invites.length > 0}
					<h2 class="text-2xl"> Invites </h2>
					<div class="flex flex-row flex-wrap">
						{#each $homeData.data.me.invites as invite}
							<Invite {invite} />
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
