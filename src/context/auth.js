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
		/*let formData = new FormData();
		formData.append("XPR_PostbackAction","XPRS/Ajax Handler");
		formData.append("action","authenticate");
		formData.append("jsonData",JSON.stringify(credentials));*/
		let jsonData = credentials;
		jsonData.action = "login";
		
		const response = await axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",JSON.stringify(jsonData), {
			headers: { "Content-Type": "application/json" },
			withCredentials: true
		});

		// set user data
		let result = (response.data?.data) ? JSON.parse(response.data?.data) : response.data; 
		let userData = {"token": result.token};
		if (!result.error) {
			setUser(userData);
			localStorage.setItem("user",JSON.stringify(userData));
		}
		if (callback) callback(result);
	}

	// sign out
	const signout = async (callback) => {
		let formData = new FormData();
		formData.append("XPR_PostbackAction","XPRS/Ajax Handler");
		formData.append("action","logout");
		
		const response = await axios.post("/elementAjax/XPRS/Ajax Handler",formData, {
			headers: { "Content-Type": "multipart/form-data" },
			withCredentials: true
		});

		// clear user data
		setUser(null);
		localStorage.clear();
		if (callback) callback(response);
	}

	//check authentication
	/*useEffect(() => {
	}, [])*/

	return {
		user,
		signin,
		signout
	}
}