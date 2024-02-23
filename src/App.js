import React, { useRef, useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { useHistory, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AppTopbar from "./AppTopbar";
import AppFooter from "./AppFooter";
import AppMenu from "./AppMenu";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import AppNavs from "./api/NavBar";
import AppRouter from "./api/AppRouter";

import { resetStorage } from "./services/SecureService";
import AuthVerify from "./services/AuthVerifyService";
import { Button } from "primereact/button";
import Cookies from "js-cookie";
import { HasRoles } from "./services/RoleServices";

const App = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [menuActive, setMenuActive] = useState(false);
    const [scheme, setScheme] = useState("light");
    const copyTooltipRef = useRef();
    const location = useLocation();
    const history = useHistory();
    let menuClick;
    let topbarItemClick;
    // const cors = require('cors');
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).idToken) {
            if (location.pathname === "/") {
                history.push("/Home-Page");
            }
        } else {
            logOut();
        }
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const isTokenActive = () => {
        const token = Cookies.get("token");
        if (!token) {
            return false;
        }

        const expirationTime = new Date(Cookies.get("token_expiration"));
        const currentTime = new Date();

        return currentTime < expirationTime;
    };

    const logOut = () => {
        resetStorage();
        history.push("/user-login");
    };
    const onMenuClick = (event) => {
        menuClick = true;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        setTopbarMenuActive(false);

        if (layoutMode === "overlay" && !isMobile()) {
            setOverlayMenuActive((prevState) => !prevState);
        } else {
            if (isDesktop()) setStaticMenuDesktopInactive((prevState) => !prevState);
            else setStaticMenuMobileActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onTopbarMenuButtonClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive((prevState) => !prevState);
        hideOverlayMenu();
        event.preventDefault();
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;

        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else setActiveTopbarItem(event.item);

        event.originalEvent.preventDefault();
    };

    const onMenuItemClick = (event) => {
        setSearchBox(null);
        if (!event.item.items) {
            hideOverlayMenu();
        }
        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    };

    const onRootMenuItemClick = (event) => {
        setMenuActive((prevState) => !prevState);
    };

    const onDocumentClick = (event) => {
        if (!topbarItemClick) {
            setActiveTopbarItem(null);
            setTopbarMenuActive(false);
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }

            hideOverlayMenu();
        }

        topbarItemClick = false;
        menuClick = false;
    };

    const isMenuVisible = () => {
        if (isDesktop()) {
            if (layoutMode === "static") return !staticMenuDesktopInactive;
            else if (layoutMode === "overlay") return overlayMenuActive;
            else return true;
        } else {
            return true;
        }
    };

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false);
        setStaticMenuMobileActive(false);
    };

    const isMobile = () => {
        return window.innerWidth < 1025;
    };

    const isDesktop = () => {
        return window.innerWidth > 1024;
    };

    const isHorizontal = () => {
        return layoutMode === "horizontal";
    };

    const isSlim = () => {
        return layoutMode === "slim";
    };
    const changeTheme = (theme) => {
        changeStyleSheetUrl("layout-css", theme, "layout");
        changeStyleSheetUrl("theme-css", theme, "theme");
    };

    const changeStyleSheetUrl = (id, value, prefix) => {
        let element = document.getElementById(id);
        let urlTokens = element.getAttribute("href").split("/");
        urlTokens[urlTokens.length - 1] = prefix + "-" + value + ".css";
        let newURL = urlTokens.join("/");

        replaceLink(element, newURL);
    };

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
    };

    const replaceLink = (linkElement, href) => {
        if (isIE()) {
            linkElement.setAttribute("href", href);
        } else {
            const id = linkElement.getAttribute("id");
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute("href", href);
            cloneLinkElement.setAttribute("id", id + "-clone");

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener("load", () => {
                linkElement.remove();
                cloneLinkElement.setAttribute("id", id);
            });
        }
    };

    const layoutClassName = classNames("layout-wrapper ", {
        "layout-horizontal": layoutMode === "horizontal",
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-slim": layoutMode === "slim",
        "layout-static-inactive": staticMenuDesktopInactive && layoutMode !== "slim",
        "layout-mobile-active": staticMenuMobileActive,
        "layout-overlay-active": overlayMenuActive,
    });
    const [sideNavs, setSidNavs] = useState(AppNavs);
    const [searchBox, setSearchBox] = useState(null);
    const menuContainerClassName = classNames("layout-menu-container bg-dark", { "layout-menu-container-inactive": !isMenuVisible() });
    const findClaim = (obj, val) => {
        for (let i = 0; i < obj.length; i++) {
            if (obj[i].items) {
                // let object = { label: obj[i].label, icon: obj[i].icon, to: obj[i].to };
                if (obj[i].label.toLowerCase().includes(val)) {
                    sideNavs.push(obj[i]);
                }
                findClaim(obj[i].items, val);
            } else {
                if (obj[i].label.toLowerCase().includes(val)) {
                    if (obj[i] !== null) {
                        let object = { label: obj[i].label, icon: obj[i].icon, to: obj[i].to };
                        sideNavs.push(object);
                    }
                    break;
                }
            }
        }
        return sideNavs;
    };
    findClaim(AppNavs, searchBox);
    const searchMenu = (e) => {
        let val = (e.target && e.target.value) || "";
        if (val) {
            setSearchBox(val);
            setSidNavs([]);
        } else {
            setSidNavs(AppNavs);
            setSearchBox(null);
        }
    };
    const readDocs = () => {
        window.open("/documentation", "_blank");
    };
    return (
        <div className={layoutClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar topbarMenuActive={topbarMenuActive} activeTopbarItem={activeTopbarItem} onMenuButtonClick={onMenuButtonClick} onTopbarMenuButtonClick={onTopbarMenuButtonClick} onTopbarItemClick={onTopbarItemClick} />

            <div className={menuContainerClassName} onClick={onMenuClick}>
                <div className="layout-menu-content">
                    <span className="p-input-icon-left" style={{ marginTop: "2vh", marginLeft: "2vh" }}>
                        <i className="pi pi-search" />
                        <InputText placeholder="Search" style={{ background: "#212529" }} onChange={(e) => searchMenu(e)} className="text-white" />
                    </span>
                    <AppMenu model={sideNavs} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} layoutMode={layoutMode} active={menuActive} />
                    <div className="layout-menu-footer">
                        <div className="layout-menu-footer-title">
                            {HasRoles("Documentation-View") && (
                                <>
                                    <p className="text-white">User guid</p>
                                    <Button label="Documentation" className="p-button-success" onClick={readDocs} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="layout-content">
                <div className="layout-content-container">
                    <AppRouter colorMode={scheme} location={location} />
                </div>

                <AppFooter />

                {staticMenuMobileActive && <div className="layout-mask"></div>}
            </div>
            {<AuthVerify logOut={logOut} />}
        </div>
    );
};

export default App;
