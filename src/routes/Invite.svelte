<script>
	import { SEND_INVITE } from "../mutations";
	import { currentUser} from "../CurrentUser.js"
	import { mutation } from "svelte-apollo";
	
	export let invite;
	const sendInvite = mutation(SEND_INVITE);
	let mutationResult = null;

	function challenge(user) {
		mutationResult = sendInvite({ variables: { inviter: currentUser.getUser().uuid, invitee: user.uuid } } )
	}
</script>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-5 m-3">
		<p class="text-center">{invite.inviter.username}</p>
		<p class="text-center">{invite.invitee.username}</p>
		{#if !mutationResult}
			<button
				on:click="{challenge(invite)}"
				class="w-32 justify-center bg-blue-500 font-bold text-white px-4 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
				Accept
			</button>
		{:else}
			<button
				disabled=true
				class="w-32 justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
				Sent!
			</button>
		{/if}
	</div>
</main>
