<script>
	import { SEND_INVITE } from "mutations";
	import { currentUser} from "login/CurrentUser.js"
	import { mutation } from "svelte-apollo";
	
	export let user;
	const sendInvite = mutation(SEND_INVITE);
	let mutationResult = null;

	function challenge(user) {
		mutationResult = sendInvite({ variables: { inviter: currentUser.getUser().uuid, invitee: user.uuid } } )
	}
</script>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-3 m-3 w-36">
		<p class="text-center">{user.username}</p>
		{#if !mutationResult}
			<button
				on:click="{challenge(user)}"
				class="w-full justify-center bg-blue-500 font-bold text-white px-4 py-1 rounded transition duration-300 ease-in-out hover:bg-blue-700">
				Challenge
			</button>
		{:else}
			<button
				disabled=true
				class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
				Sent!
			</button>
		{/if}
	</div>
</main>
