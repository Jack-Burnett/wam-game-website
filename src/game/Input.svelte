<script>
    let options = [
        { symbol: "⬆️", action: "MOVE_UP" },
        { symbol: "↗️", action: "MOVE_UP_RIGHT" },
        { symbol: "➡️", action: "MOVE_RIGHT" },
        { symbol: "↘️", action: "MOVE_DOWN_RIGHT" },
        { symbol: "⬇️", action: "MOVE_DOWN" },
        { symbol: "↙️", action: "MOVE_DOWN_LEFT" },
        { symbol: "⬅️", action: "MOVE_LEFT" },
        { symbol: "↖️", action: "MOVE_UP_LEFT" },
        { symbol: "↪️", action: "ROTATE_LEFT" },
        { symbol: "↩️", action: "ROTATE_RIGHT" },
        { symbol: "🏹", action: "SHOOT" },
        { symbol: "✨⬆️", action: "PUSH_UP" },
        { symbol: "✨↗️", action: "PUSH_UP_RIGHT" },
        { symbol: "✨➡️", action: "PUSH_RIGHT" },
        { symbol: "✨↘️", action: "PUSH_DOWN_RIGHT" },
        { symbol: "✨⬇️", action: "PUSH_DOWN" },
        { symbol: "✨↙️", action: "PUSH_DOWN_LEFT" },
        { symbol: "✨⬅️", action: "PUSH_LEFT" },
        { symbol: "✨↖️", action: "PUSH_UP_LEFT" }

    ]

    let character_options = [
        { symbol: "💂", action: "WARRIOR" },
        { symbol: "🧝", action: "ROGUE" },
        { symbol: "🧙‍♂️", action: "MAGE" }
    ]

    export let selected_piece;
    export let selected_action;

</script>

<main class="p-2">
	<select bind:value={selected_piece} class="text-3xl border-2 rounded-md border-gray-500">
		{#each character_options as action}
			<option value={action.action}>
				{action.symbol}
			</option>
		{/each}
	</select>
	<select bind:value={selected_action} class="text-3xl border-2 rounded-md border-gray-500">
		{#each options as action}
			<option value={action.action}>
				{action.symbol}
			</option>
		{/each}
	</select>
</main>