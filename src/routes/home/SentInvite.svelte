<script>
	export let invite;
</script>

<main>
	<div class="flex-column rounded-md border border-indigo-600 p-3 m-3 w-36">
		<p class="text-center">{invite.invitee.username}</p>
		<button
			disabled=true
			class="w-full justify-center font-bold text-white px-4 py-1 rounded bg-blue-700 cursor-default">
			Pending...
		</button>
	</div>
</main>
