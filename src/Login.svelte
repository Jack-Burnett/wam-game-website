<!-- Login.svelte -->
<script>
	import { mutation } from "svelte-apollo";
    import { SIGNUP, LOGIN } from "./mutations";
    import { currentUser } from "./CurrentUser.js"
    
    const signup = mutation(SIGNUP);
    const login = mutation(LOGIN);
    
    import { getContext } from 'svelte';
    const { close } = getContext('simple-modal');
    
    let username = "";
    let password = "";
    let confirmPassword = "";
    let createNew  = false;

    let response = null

    function toggleMode() {
        createNew = !createNew
    }

    async function submit() {
        if (createNew) {
            try {
                response = signup({ variables: { username, password } });
            } catch (error) {
                // TODO
            }
        } else {
            try {
                response = login({ variables: { username, password } });
                response.then(
                    data => {
                        if (data.data.login.success) {  
                            console.log(data.data.login.token);
                            currentUser.login(username, data.data.login.token)
                            close();
                        }
                    }
                )
            } catch (error) {
                // TODO
            }
        }
    }
</script> 

<div>
    <div class = "flex-row">
        <div class = "flex inline-block">
            <h1 class="text-3xl">
                {#if createNew}
                    Signup
                {:else}
                    Login
                {/if}
            </h1>
        </div>
        <div class = "flex inline-block">
            <p href="#" class="cursor-pointer underline hover:underline" on:click={toggleMode}>
                {#if createNew}
                    Or login
                {:else}
                    Or create a new account
                {/if}
            </p>
        </div>
    </div>
    <div class = "flex-column">
        <label for="username" class="flex-shrink">Username</label>
        <input id="username" bind:value={username} class="w-full rounded-md border-2 border-gray-800">
    </div>
    <div class = "flex-column">
        <label for="password" class="flex-shrink">Password</label>
        <input id="password" type="password" bind:value={password} class="w-full rounded-md border-2  border-gray-800">
    </div>
    <div class = "flex-column">
        {#if createNew}
            <label for="confirm" class="flex-shrink">Confirm</label>
            <input id="confirm" type="password" bind:value={confirmPassword} class="w-full rounded-md border-2 border-gray-800">
        {/if}
    </div>
    <div class="flex flex-row-reverse">
        <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
            {#if createNew}
                Register
            {:else}
                Login
            {/if}
        </button>
    </div>
    {#await response}
        <p>...waiting</p>
    {:then data}
        {#if data}
            {#if data.data.login.success}
                <p>Login Success</p>
            {:else}
                <p>{data.data.login.error}</p>
            {/if}
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
    {/await}
</div>