<script>
	import LoginButton from './LoginButton.svelte';
    import Modal from 'svelte-simple-modal';
    import { currentUser } from "./CurrentUser.js"

    function logout() {currentUser
        currentUser.logout()
    }
</script>

{#if $currentUser.isLoggedIn}
    <p>{$currentUser.username}</p>
    <button on:click = "{logout}">Logout</button>
{:else}
    <Modal>
        <LoginButton />
    </Modal>
{/if}

