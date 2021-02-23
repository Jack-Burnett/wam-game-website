
<script>
    import Input from './Input.svelte'
    
    import { SUBMIT_MOVE } from "mutations";
    import { mutation } from "svelte-apollo";
    
	const Relationship = {
		PLAYER1: "Player1",
		PLAYER2: "Player2",
		NEITHER: "Neither",
		UNKNOWN: "Unknown"
	}
	
    export let game_uuid;
    export let relationship;
	const submitMove = mutation(SUBMIT_MOVE);
	let mutationResult = null;

    async function submit() {
        let player = 0
        if ($relationship == Relationship.PLAYER1) {
            player = 1
        }
        if ($relationship == Relationship.PLAYER2) {
            player = 2
        }
        mutationResult = submitMove(
            { 
                variables: {
                    game_uuid: game_uuid,
                    player: player,
                    move: JSON.stringify(moves)
                },
                // Replace the active game in the apollo cache with the changed game
                update(cache, { data }) {
                    if(data.submitMove.game) {
                        cache.modify({
                            fields: {
                                game(currentGame = {}) {
                                    return data.submitMove.game
                                }
                            }
                        })
                    }
                }
            }
        )
        mutationResult.then(response => {
            // reset selections on submit (to prevent accidental repeat submissions)
                if (response.data.submitMove.success) {
                    moves = [
                        { type: "Warrior", action: "MOVE_DOWN" },
                        { type: "Warrior", action: "MOVE_DOWN" },
                        { type: "Warrior", action: "MOVE_DOWN" },
                        { type: "Warrior", action: "MOVE_DOWN" }
                    ]
                }
            }
        )
    }
    
    let moves = [
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" },
        { type: "Warrior", action: "MOVE_DOWN" }
    ]
    
</script>

<main class="p-2 w-auto inline-flex flex-col">
    {#each moves as move}
        <Input bind:selected_piece = {move.type} bind:selected_action = {move.action}/>
    {/each}
    {#if !mutationResult}
        <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
            Submit Moves
        </button>
    {:else}
        {#await mutationResult}
            <button
                disabled=true
                class="mt-3 justify-center font-bold text-white px-4 py-3 rounded bg-blue-700 cursor-default">
                Submitting...
            </button>
        {:then result}
            <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
                Submit Moves
            </button>
            {#if result.data.submitMove.success}
                <p class="text-green-500">Moves submitted</p>
            {:else}
                <p class="text-red-500">{result.data.submitMove.error}</p>
            {/if}
        {:catch error}
            <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
                Submit Moves
            </button>
            <p class="text-red-500">{error.message}</p>
        {/await}
    {/if}
</main>