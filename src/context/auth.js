import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const authContext = createContext();
export function AuthProvider({ children }) {
	const auth = useAuthProvider()
	return <authContext.Provider value={auth}> { children } </authContext.Provider>
}

export const useAuth = () => useContext(authContext);

function useAuthProvider() {
	const [user, setUser] = useState(null);
	
	// sign in
	const signin = async (credentials, callback) => {
		let jsonData = credentials;
		jsonData.action = "login";
		
		const response = await axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",JSON.stringify(jsonData), {
			headers: { "Content-Type": "application/json" },
			withCredentials: true
		});

		// set user data
		let result = (response.data?.data) ? JSON.parse(response.data?.data) : response.data; 
		let userData = {"token": result.token, "data": response.data?.user};
		if (!result.error) {
			setUser(userData);
			localStorage.setItem("user",JSON.stringify(userData));
		}
		if (callback) callback(result);
	}

	// sign out
	const signout = async (callback) => {
		let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {};
		let jsonData = { action: "logout" };
		const response = await axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",JSON.stringify(jsonData), {
			headers: {
				"Auth": user.token,
				"Content-Type": "application/json" 
			},
			withCredentials: true
		});

		// clear user data
		setUser(null);
		localStorage.clear();
		if (callback) callback(response);
	}

	//check authentication
	useEffect(() => {
		// validate access token on page load
		if (localStorage.getItem("user")) {
			let user_data = JSON.parse(localStorage.getItem("user"));
			let token = user_data.token;
			let jsonData = { action: "checkAuth" };
			const response = axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",JSON.stringify(jsonData), {
				headers: {
					"Auth": token,
					"Content-Type": "application/json" 
				},
				withCredentials: true
			});
			// invalid/expired token
			if (response.error) {
				console.log('response',response);
				// clear user data and redirect user to login screen
				setUser(null);
				localStorage.clear();
				window.location.replace("/my-business/login");
			}
		}
	}, [])

	return {
		user,
		signin,
		signout
	}
}