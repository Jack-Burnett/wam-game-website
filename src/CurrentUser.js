import { get, writable } from 'svelte/store';
import { getClient } from "svelte-apollo";

    
const { subscribe, set, update } = writable({
	// Stored as string so need to parse to boolean
	isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
	username: localStorage.getItem("username") || "",
	uuid: localStorage.getItem("uuid") || "",
	token: localStorage.getItem("token") || "",
});

export const currentUser = {
	subscribe,
	logout: () => {
		localStorage.setItem("isLoggedIn", false)
		localStorage.setItem("username", "")
		localStorage.setItem("uuid", "")
		localStorage.setItem("token", "")
		set({
			isLoggedIn: false,
			username: "",
			uuid: "",
			token: ""
		})
		// Forces all queries to refetch
		// getClient().resetStore()
	},
	login: (username, uuid, token) => {
		localStorage.setItem("isLoggedIn", true)
		localStorage.setItem("username", username)
		localStorage.setItem("uuid", uuid)
		localStorage.setItem("token", token)
		set({
			isLoggedIn: true,
			username: username,
			uuid: uuid,
			token: token
		})
		//getClient().resetStore()
	},
	getUser: () => get(currentUser)
};