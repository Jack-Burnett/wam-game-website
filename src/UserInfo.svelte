<script>
	import LoginButton from './LoginButton.svelte';
    import Modal from 'svelte-simple-modal';
    import { currentUser } from "./CurrentUser.js"
</script>

{#if $currentUser.isLoggedIn}
    <p>{$currentUser.username}</p>
{:else}
    <Modal>
        <LoginButton />
    </Modal>
{/if}

