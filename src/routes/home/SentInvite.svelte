<script>
	export let invite;
</script>

<style>
	#root {
		min-width: 9rem;
	}
</style>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-3 m-3" id="root">
		<p class="text-center">{invite.invitee.username}</p>
		<button
			disabled=true
			class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
			Pending...
		</button>
	</div>
</main>
