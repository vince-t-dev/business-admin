import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AllRoutes } from "../routes";
import { useAuth } from "../context/auth";
import { useSite } from "../context/site";

// pages
import List from "./List";
import ListItem from "./ListItem";
import Users from "./Users";
import Attendee from "./Attendee";
import Settings from "./Settings";
import Login from "./Login";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";

// full page with loader
const RouteWithLoader = ({ component: Component, ...rest }) => {
	let site = useSite();
  	const [loaded, setLoaded] = useState(site.siteConfig.showPreloader);

  	useEffect(() => {
    	const timer = setTimeout(() => setLoaded(!site.siteConfig.showPreloader), 1000);
    	return () => clearTimeout(timer);
  	}, [site]);

  	return (
    	//<Route {...rest} render={props => ( 
      	<> 
        	<Preloader show={loaded ? false : true} /> <Component/> 
      	</> 
    	//)}/>
  	);
};

// page with sidebar
const RouteWithSidebar = ({ component: Component, ...rest }) => {
	let site = useSite();
  	const [loaded, setLoaded] = useState(site.siteConfig.showPreloader);

  	useEffect(() => {
    	const timer = setTimeout(() => setLoaded(!site.siteConfig.showPreloader), 1000);
    	return () => clearTimeout(timer);
  	}, [site]);

  	/*const localStorageIsSettingsVisible = () => {
    	return localStorage.getItem('settingsVisible') === 'false' ? false : true
  	}
  	const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);
  	const toggleSettings = () => {
    	setShowSettings(!showSettings);
    	localStorage.setItem('settingsVisible', !showSettings);
  	}*/

  	return (
    	//<Route {...rest} render={props => (
      	<>
        	<Preloader show={loaded ? false : true} />
			<Sidebar />
			<Navbar />
			<main className="content">
				<Component/>
				{/*<Footer toggleSettings={toggleSettings} showSettings={showSettings} />*/}
			</main>
      	</>
      	//)}>
  );
};

function PrivateRoute({ children, ...rest }) {		
	let auth = useAuth();
	const location = useLocation();
	let userData = (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : ""; 
	auth.user = userData;
	let redirect_url = (localStorage.getItem("invalid_token")) ? "/my-business/lock" : "/my-business/login";
	return (
        auth.user ? <Outlet {...rest} location={location}/> :
        (<Navigate to={redirect_url} state={{ from: location }} replace />)
	)
}

export default () => (
		<Routes>
			<Route path={AllRoutes.Login.path} element={<RouteWithLoader component={Login}/>}/>
			<Route path={AllRoutes.Lock.path} element={<RouteWithLoader component={Lock}/>}/>
			<Route path={AllRoutes.Signup.path} element={<RouteWithLoader component={Signup}/>}/>
			<Route path={AllRoutes.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword}/>}/>
			<Route path={AllRoutes.ResetPassword.path} element={<RouteWithLoader component={ResetPassword}/>}/>
			<Route path={AllRoutes.NotFound.path} element={<RouteWithLoader component={NotFoundPage}/>}/>
			<Route path={AllRoutes.ServerError.path} element={<RouteWithLoader component={ServerError}/>}/>

			{/* pages */}
			<Route element={<PrivateRoute />}>
				{/* xpr */}
				{/* list (events) */}
				<Route index element={<RouteWithSidebar component={List}/>} />
				<Route path={AllRoutes.Home.path} element={<RouteWithSidebar component={List}/>}/>
				<Route path={AllRoutes.Start.path} element={<RouteWithSidebar component={List}/>}/>
				<Route path={AllRoutes.List.path} element={<RouteWithSidebar component={List}/>}/>
				<Route path={AllRoutes.ListItem.path} element={<RouteWithSidebar component={ListItem}/>}/>
				
				{/* attendee */}
				<Route path={AllRoutes.Attendee.path} element={<RouteWithSidebar component={Attendee}/>}/>

				{/* users */}
				<Route path={AllRoutes.Users.path} element={<RouteWithSidebar component={Users}/>}/>

				{/* other references */}
				<Route path={AllRoutes.Settings.path} element={<RouteWithSidebar component={Settings}/>}/>
			</Route>

			{/* not found */}
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
);
