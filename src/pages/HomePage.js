import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { AllRoutes } from "../routes";

// pages
import Users from "./Users";
import List from "./List";
import ListItem from "./ListItem";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts"; 
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    //<Route {...rest} render={props => ( 
      <> 
        <Preloader show={loaded ? false : true} /> <Component/> 
      </> 
    //) } />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

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
      //)}
    ///>
  );
};

export default () => (
  <Routes>
    <Route path={AllRoutes.Signin.path} element={<RouteWithLoader component={Signin}/>}/>
    <Route path={AllRoutes.Signup.path} element={<RouteWithLoader component={Signup}/>}/>
    <Route path={AllRoutes.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword}/>}/>
    <Route path={AllRoutes.ResetPassword.path} element={<RouteWithLoader component={ResetPassword}/>}/>
    <Route path={AllRoutes.Lock.path} element={<RouteWithLoader component={Lock}/>}/>
    <Route path={AllRoutes.NotFound.path} element={<RouteWithLoader component={NotFoundPage}/>}/>
    <Route path={AllRoutes.ServerError.path} element={<RouteWithLoader component={ServerError}/>}/>

    {/* pages */}
    <Route path={AllRoutes.List.path} element={<RouteWithSidebar component={List}/>}/>
    <Route path={AllRoutes.ListItem.path} element={<RouteWithSidebar component={ListItem}/>}/>
    <Route path={AllRoutes.Users.path} element={<RouteWithSidebar component={Users}/>}/>
    <Route path={AllRoutes.DashboardOverview.path} element={<RouteWithSidebar component={DashboardOverview}/>}/>
    <Route path={AllRoutes.Upgrade.path} element={<RouteWithSidebar component={Upgrade}/>}/>
    <Route path={AllRoutes.Transactions.path} element={<RouteWithSidebar component={Transactions}/>}/>
    <Route path={AllRoutes.Settings.path} element={<RouteWithSidebar component={Settings}/>}/>
    <Route path={AllRoutes.BootstrapTables.path} element={<RouteWithSidebar component={BootstrapTables}/>}/>

    {/* components */}
    <Route path={AllRoutes.Accordions.path} element={<RouteWithSidebar component={Accordion}/>}/>
    <Route path={AllRoutes.Alerts.path} element={<RouteWithSidebar component={Alerts}/>}/>
    <Route path={AllRoutes.Badges.path} element={<RouteWithSidebar component={Badges}/>}/>
    <Route path={AllRoutes.Breadcrumbs.path} element={<RouteWithSidebar component={Breadcrumbs}/>}/>
    <Route path={AllRoutes.Buttons.path} element={<RouteWithSidebar component={Buttons}/>}/>
    <Route path={AllRoutes.Forms.path} element={<RouteWithSidebar component={Forms}/>}/>
    <Route path={AllRoutes.Modals.path} element={<RouteWithSidebar component={Modals}/>}/>
    <Route path={AllRoutes.Navs.path} element={<RouteWithSidebar component={Navs}/>}/>
    <Route path={AllRoutes.Navbars.path} element={<RouteWithSidebar component={Navbars}/>}/>
    <Route path={AllRoutes.Pagination.path} element={<RouteWithSidebar component={Pagination}/>}/>
    <Route path={AllRoutes.Popovers.path} element={<RouteWithSidebar component={Popovers}/>}/>
    <Route path={AllRoutes.Progress.path} element={<RouteWithSidebar component={Progress}/>}/>
    <Route path={AllRoutes.Tables.path} element={<RouteWithSidebar component={Tables}/>}/>
    <Route path={AllRoutes.Tabs.path} element={<RouteWithSidebar component={Tabs}/>}/>
    <Route path={AllRoutes.Tooltips.path} element={<RouteWithSidebar component={Tooltips}/>}/>
    <Route path={AllRoutes.Toasts.path} element={<RouteWithSidebar component={Toasts}/>}/>

    {/* documentation */}
    <Route path={AllRoutes.DocsOverview.path} element={<RouteWithSidebar component={DocsOverview}/>}/>
    <Route path={AllRoutes.DocsDownload.path} element={<RouteWithSidebar component={DocsDownload}/>}/>
    <Route path={AllRoutes.DocsQuickStart.path} element={<RouteWithSidebar component={DocsQuickStart}/>}/>
    <Route path={AllRoutes.DocsLicense.path} element={<RouteWithSidebar component={DocsLicense}/>}/>
    <Route path={AllRoutes.DocsFolderStructure.path} element={<RouteWithSidebar component={DocsFolderStructure}/>}/>
    <Route path={AllRoutes.DocsBuild.path} element={<RouteWithSidebar component={DocsBuild}/>}/>
    <Route path={AllRoutes.DocsChangelog.path}element={<RouteWithSidebar component={DocsChangelog} />}/>

    {/*<Redirect to={`AllRoutes.NotFound.path`} />*/}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);
