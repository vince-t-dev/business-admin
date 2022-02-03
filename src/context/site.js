import React, { useContext, createContext, useState, useRef, useEffect } from "react";

// global site settings
const siteContext = createContext();

export function SiteContext({ children }) {
	const site = useSiteContext();
	return <siteContext.Provider value={site}> { children } </siteContext.Provider>
}

export const useSite = () => useContext(siteContext);

function useSiteContext() {
    // global values can be set here
    let site_config = {
        showPreloader: false
    }
	const [siteConfig, setSiteConfig] = useState(site_config);
    // update config
    const updateSiteConfig = (value) => {
        setSiteConfig(value);
    };
    // use prev state
    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    };
    return { siteConfig, updateSiteConfig, usePrevious };
}