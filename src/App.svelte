<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/home/Home.svelte";
	import About from "./old/oldApp.svelte";
	import Game from "./routes/game/Game.svelte";
	
	import UserInfo from './login/UserInfo.svelte';

	import { client} from "./configureApollo.js"
	import { setClient } from "svelte-apollo";
	setClient(client);
	
	export let url = "";
  </script>
  
  <!-- https://github.com/EmilTholin/svelte-routing -->
  <Router url="{url}">
	<div class="container mx-auto bg-purple-300 p-5">
		<nav class="flex justify-between">
			<div>
				<a>Logo</a>
			</div>
			<ul class="flex flex-row">
				<li class="pr-5">
					<Link to="/">Home</Link>
				</li>
				<li class="pr-5">
					<Link to="about">About</Link>
				</li>
				<li class="pr-5">
					<Link to="blog">Blog</Link>
				</li>
			</ul>
			<UserInfo />
		</nav>	
	</div>
	<div class="container mx-auto p-5">
	  <!--<Route path="blog/:id" component="{BlogPost}" />-->
	  <Route path="about" component="{About}" />
	  <Route path="/"><Home /></Route>
	  <Route path="game/:uuid" let:params>
		<Game uuid="{params.uuid}" />
	  </Route>
	</div>
  </Router>

<style global lang="postcss" >
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
