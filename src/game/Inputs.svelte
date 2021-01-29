
<script>
    import Input from '../game/Input.svelte'
    
    let moves = [
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" }
    ]

    function submit() {
        console.log(moves[0])
        console.log(moves[3])
    }
    
</script>

<main class="p-2 w-auto inline-flex flex-col">
    {#each moves as move}
        <Input bind:selected_piece = {move.type} bind:selected_action = {move.action}/>
    {/each}
    <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
        Submit Moves
    </button>
</main>