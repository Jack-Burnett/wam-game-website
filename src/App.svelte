<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/home/Home.svelte";
	import Learn from "./routes/learn/Learn.svelte";
	import History from "./routes/history/History.svelte";
	import Game from "./routes/game/Game.svelte";
	
	import UserInfo from './login/UserInfo.svelte';

	import { client} from "./configureApollo.js"
	import { setClient } from "svelte-apollo";
	setClient(client);
	
	export let url = "";
  </script>
  
  <!-- https://github.com/EmilTholin/svelte-routing -->
  <Router url="{url}">
	<div class="bg-blue-300">
		<nav class="container mx-auto flex p-5 justify-between">
			<ul class="flex flex-row">
				<li class="pr-5 text-lg">
					<Link to="/" class=" hover:text-gray-50 text-black">🏠 Home</Link>
				</li>
				<li class="pr-5 text-lg">
					<Link to="learn" class="hover:text-gray-50 text-black">🎓 Learn</Link>
				</li>
				<li class="pr-5 text-lg">
					<Link to="history" class="hover:text-gray-50 text-black">📜 History</Link>
				</li>
			</ul>
			<UserInfo />
		</nav>	
	</div>
	<div class="container mx-auto p-5">
		<Route path="/">
			<Home/>
		</Route>
		<Route path="learn">
			<Learn/>
		</Route>
		<Route path="history">
			<History/>
		</Route>
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
