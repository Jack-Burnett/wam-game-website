<script>
    import { getContext } from 'svelte';
    import Login from './Login.svelte';
   
    const { open } = getContext('simple-modal');
   
    const showModal = () => {
      open(Login);
    };
  </script> 
   
  <p><button on:click={showModal}>Login</button></p>
   