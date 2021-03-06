
<script>
    import Input from './Input.svelte'
    
    import { SUBMIT_MOVE } from "mutations";
    import { mutation } from "svelte-apollo";
    import { MoveType } from 'server/game.js'
    
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
    
    function invertAction(action) {
        switch (action) {
            case MoveType.MOVE_UP: return MoveType.MOVE_DOWN;
            case MoveType.MOVE_DOWN: return MoveType.MOVE_UP;
            case MoveType.MOVE_LEFT: return MoveType.MOVE_RIGHT;
            case MoveType.MOVE_RIGHT: return MoveType.MOVE_LEFT;
            case MoveType.MOVE_DOWN_LEFT: return MoveType.MOVE_UP_RIGHT;
            case MoveType.MOVE_UP_RIGHT: return MoveType.MOVE_DOWN_LEFT;
            case MoveType.MOVE_UP_LEFT: return MoveType.MOVE_DOWN_RIGHT;
            case MoveType.MOVE_DOWN_RIGHT: return MoveType.MOVE_UP_LEFT;
            
            case MoveType.PUSH_UP: return MoveType.PUSH_DOWN;
            case MoveType.PUSH_DOWN: return MoveType.PUSH_UP;
            case MoveType.PUSH_LEFT: return MoveType.PUSH_RIGHT;
            case MoveType.PUSH_RIGHT: return MoveType.PUSH_LEFT;
            case MoveType.PUSH_DOWN_LEFT: return MoveType.PUSH_UP_RIGHT;
            case MoveType.PUSH_UP_RIGHT: return MoveType.PUSH_DOWN_LEFT;
            case MoveType.PUSH_UP_LEFT: return MoveType.PUSH_DOWN_RIGHT;
            case MoveType.PUSH_DOWN_RIGHT: return MoveType.PUSH_UP_LEFT;
            default: return action;
        }
    }

    async function submit() {
        let moveCopy = JSON.parse(JSON.stringify(moves))
        let player = 0
        // Board is shown flipped for player 1 (so you are always bottom)
        // This means we need to flip the moves on submit too!
        if ($relationship == Relationship.PLAYER1) {
            player = 1
            moveCopy.forEach(
                move => {
                    move.action = invertAction(move.action)
                }
            )
        }
        console.log(moves)
        console.log(moveCopy)
        if ($relationship == Relationship.PLAYER2) {
            player = 2
        }
        mutationResult = submitMove(
            { 
                variables: {
                    game_uuid: game_uuid,
                    player: player,
                    move: JSON.stringify(moveCopy)
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
                        { type: "Warrior", action: MoveType.MOVE_UP },
                        { type: "Warrior", action: MoveType.MOVE_UP },
                        { type: "Warrior", action: MoveType.MOVE_UP },
                        { type: "Warrior", action: MoveType.MOVE_UP }
                    ]
                }
            }
        )
    }
    
    let moves = [
        { type: "Warrior", action: MoveType.MOVE_UP },
        { type: "Warrior", action: MoveType.MOVE_UP },
        { type: "Warrior", action: MoveType.MOVE_UP },
        { type: "Warrior", action: MoveType.MOVE_UP }
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