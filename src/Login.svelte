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

    // Follows structure of server errrors to allow identical handling
    function localError(message) {
        return Promise.resolve(
            {
                data: {
                    login: {
                        success: false,
                        error: message
                    }
                }
            }
        )
    }

    function keyDown(event) {
        if (event.keyCode == 13) {
            submit();
        }
    }

    async function submit() {
        console.log(createNew)
        if (createNew) {
            console.log(password)
            console.log(confirmPassword)
            console.log(password != confirmPassword)
            if (password != confirmPassword) {
                response = localError("Password and confirm are not equal")
                return
            }
            try {
                response = signup({ variables: { username, password } });
            } catch (error) {
                response = localError(error)
            }
        } else {
            try {
                response = login({ variables: { username, password } });
            } catch (error) {
                response = localError(error)
            }
        }
        // If you login/register, close the login dialog and update current user
        response.then(
            data => {
                if (data.data.login.success) {  
                    currentUser.login(username, data.data.login.user.uuid, data.data.login.token)
                    close();
                }
            }
        )
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
        <input id="username" bind:value={username} class="w-full rounded-md border-2 border-gray-800" on:keydown={keyDown}>
    </div>
    <div class = "flex-column">
        <label for="password" class="flex-shrink">Password</label>
        <input id="password" type="password" bind:value={password} class="w-full rounded-md border-2  border-gray-800" on:keydown={keyDown}>
    </div>
    <div class = "flex-column">
        {#if createNew}
            <label for="confirm" class="flex-shrink">Confirm</label>
            <input id="confirm" type="password" bind:value={confirmPassword} class="w-full rounded-md border-2 border-gray-800" on:keydown={keyDown}>
        {/if}
    </div>
    <div class="flex flex-row items-end">
        {#await response}
            <p>...waiting</p>
        {:then data}
            {#if data}
                {#if data.data.login.success}
                    <p class="text-green-500">{#if createNew}Registration Success{:else}Login Success{/if}</p>
                {:else}
                    <p class="text-red-500">{data.data.login.error}</p>
                {/if}
            {/if}
        {:catch error}
            <p class="text-red-500">{error.message}</p>
        {/await}
        <!-- This is a spacer-->
        <div class="flex-grow"></div>
        <button on:click="{submit}" class="mt-3 justify-center bg-blue-500 font-bold text-white px-4 py-3 rounded transition duration-300 ease-in-out hover:bg-blue-600">
            {#if createNew}
                Register
            {:else}
                Login
            {/if}
        </button>
    </div>
</div>