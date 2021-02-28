<script>
	import LoginButton from './LoginButton.svelte';
    import Modal from 'svelte-simple-modal';
    import { currentUser } from "./CurrentUser.js"
    import { getClient } from "svelte-apollo";

    const client = getClient();

    function logout() {
        currentUser.logout()
		// Forces all queries to refetch
		client.resetStore()
    }
</script>

{#if $currentUser.isLoggedIn}
    <a id="logout" on:click = "{logout}" class=" hover:text-gray-50 text-black cursor-pointer">
        {$currentUser.username}
        
    </a>
{:else}
    <Modal>
        <LoginButton/>
    </Modal>
{/if}

<style>
    #logout:hover::before {
        content:"Logout ";
        cursor: "pointer";
    }
</style>