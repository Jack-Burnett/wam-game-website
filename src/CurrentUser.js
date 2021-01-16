import { writable } from 'svelte/store';

    
const { subscribe, set, update } = writable({
	isLoggedIn: localStorage.getItem("isLoggedIn") || false,
	username: localStorage.getItem("username") || "",
	token: localStorage.getItem("token") || "",
});

export const currentUser = {
	subscribe,
	logout: () => {
		localStorage.setItem("isLoggedIn", false)
		localStorage.setItem("username", "")
		localStorage.setItem("token", "")
		set({
			isLoggedIn: true,
			username: username,
			token: token
		})
	},
	login: (username, token) => {
		localStorage.setItem("isLoggedIn", true)
		localStorage.setItem("username", username)
		localStorage.setItem("token", token)
		set({
			isLoggedIn: true,
			username: username,
			token: token
		})
	}
};
