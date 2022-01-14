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
	const signin = (credentials, callback) => {
	console.log('in sign in', credentials);
		let formData = { 
			"jsonData": credentials,
			"XPR_PostbackAction": "XPRS/Ajax Handler",
			"action": "login"
		}	
		axios.post('/elementAjax/XPRS/Ajax Handler', formData)
		.then(function (response) {
			console.log('axios res',response);
		})
		.catch(function (error) {
			console.log(error);
		});
		// TODO
		setUser('test value');
		if (callback) callback(user);
	}
	useEffect(() => {
		//check authentication
		console.log('useEffect(): check auth',user);
	}, [])
	return {
		user,
		signin
	}
}