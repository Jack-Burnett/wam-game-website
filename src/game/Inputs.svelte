
<script>
    import Input from '../game/Input.svelte'
    
    import { SUBMIT_MOVE } from "../mutations";
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
        console.log(game_uuid)
        console.log($relationship)
        mutationResult = await submitMove(
            { variables: {
                game_uuid: game_uuid,
                player: player,
                move: JSON.stringify(moves)
            }  }
        )
        console.log(mutationResult)
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
    <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
        Submit Moves
    </button>
</main>