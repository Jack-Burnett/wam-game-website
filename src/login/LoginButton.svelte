<script>
    import { getContext } from 'svelte';
    import Login from './Login.svelte';
   
    const { open } = getContext('simple-modal');
   
    const showModal = () => {
      open(Login);
    };
  </script> 
   
  <p><button on:click={showModal}  class=" hover:text-gray-50 text-black cursor-pointer">Login / Register</button></p>
   