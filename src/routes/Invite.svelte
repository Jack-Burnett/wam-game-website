<script>
	import { RESPOND_TO_INVITE } from "../mutations";
	import { mutation } from "svelte-apollo";
	
	export let invite;
	const respond = mutation(RESPOND_TO_INVITE);
	let mutationResult = null;

	function sendResponse(accepted) {
		console.log("SEND RESPONSE")
		mutationResult = respond({ variables: { inviteUuid: invite.uuid, accepted: accepted } } )
	}
</script>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-5 m-3">
		<p class="text-center">{invite.inviter.username}</p>
		<p class="text-center">{invite.invitee.username}</p>
		{#if !mutationResult}
			<button
				on:click="{() => sendResponse(true)}"
				class="w-8 justify-center bg-blue-500 font-bold text-white px-1 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
				✔️
			</button>
			<button
				on:click="{() => sendResponse(false)}"
				class="w-8 justify-center bg-blue-500 font-bold text-white px-1 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
				❌
			</button>
		{:else}
			{#await mutationResult}
				<button
					disabled=true
					class="w-32 justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
					Sending...
				</button>
			{:then result}
				{#if result.data.respondToInvite.success}
					<button
						disabled=true
						class="w-32 justify-center font-bold text-white px-4 py-1 rounded bg-red-700 cursor-default">
						Failed
					</button>
				{:else}
					<button
						disabled=true
						class="w-32 justify-center font-bold text-white px-4 py-1 rounded bg-red-700 cursor-default">
						Failed
					</button>
				{/if}
			{:catch error}
				<button
					disabled=true
					class="w-32 justify-center font-bold text-white px-4 py-1 rounded bg-red-700 cursor-default">
					Failed
				</button>
			{/await}
		{/if}
	</div>
</main>
