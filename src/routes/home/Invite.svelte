<script>
	import { RESPOND_TO_INVITE } from "mutations";
	import { mutation } from "svelte-apollo";
	import { Link } from "svelte-routing";
	
	export let invite;
	const respond = mutation(RESPOND_TO_INVITE);
	let mutationResult = null;

	function sendResponse(accepted) {
		mutationResult = respond({ variables: { inviteUuid: invite.uuid, accepted: accepted } } )
	}
</script>

<style>
	#root {
		min-width: 9rem;
	}
</style>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-3 m-3" id="root">
		<p class="text-center">{invite.inviter.username}</p>
		{#if !mutationResult}
			<div class="grid grid-cols-2 gap-2">
				<button
					on:click="{() => sendResponse(true)}"
					class="justify-center bg-blue-500 font-bold text-white px-1 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
					✔️
				</button>
				<button
					on:click="{() => sendResponse(false)}"
					class="justify-center bg-blue-500 font-bold text-white px-1 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
					❌
				</button>
			</div>
		{:else}
			{#await mutationResult}
				<button
					disabled=true
					class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
					Sending...
				</button>
			{:then result}
				{#if result.data.respondToInvite.success}
					{#if result.data.respondToInvite.game}
						<Link to="game/{result.data.respondToInvite.game.uuid}">	
							<button
								class="w-full justify-center bg-blue-500 font-bold text-white px-1 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
								Start Game!
							</button>
						</Link>
					{:else}
						Rejected TODO just delete form UI
					{/if}
				{:else}
					<button
						disabled=true
						class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-red-700 cursor-default">
						Failed
					</button>
				{/if}
			{:catch error}
				<button
					disabled=true
					class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-red-700 cursor-default">
					Failed
				</button>
			{/await}
		{/if}
	</div>

</main>