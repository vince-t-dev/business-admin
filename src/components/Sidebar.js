
import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBoxOpen, faChartPie, faCog, faFileAlt, faHandHoldingUsd, faSignOutAlt, faTable, faTimes, faCalendarAlt, faMapPin, faInbox, faRocket, faUsers, faList } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from "../context/auth";

import { AllRoutes } from "../routes";
import ProfilePicture from "../assets/img/team/profile-picture-5.jpg"; 
import LogoLight from "../assets/media/xprs-logo.svg";
import LogoDark from "../assets/media/xprs-logo-dark.svg";
import LogoSmallLight from "../assets/media/xprs-logo-with-red-white.svg";
import LogoSmallDark from "../assets/media/xprs-logo-with-red.svg";

export default (props = {}) => {
	const location = useLocation();
	const params = useParams();
	const { pathname } = location;
	const [show, setShow] = useState(false);
	const showClass = show ? "show" : "";
	let auth = useAuth();

	const onCollapse = () => setShow(!show);

	const CollapsableNavItem = (props) => {
		const { eventKey, title, icon, children = null } = props;
		const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

		return (
		<Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
			<Accordion.Item eventKey={eventKey}>
			<Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
				<span>
				<span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
				<span className="sidebar-text">{title}</span>
				</span>
			</Accordion.Button>
			<Accordion.Body className="multi-level">
				<Nav className="flex-column">
				{children}
				</Nav>
			</Accordion.Body>
			</Accordion.Item>
		</Accordion>
		);
	};

	const NavItem = (props) => {
		const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
		const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
		
		// set active state for home page
		const setHome = ((pathname == "/" || pathname == "/my-business/") && link == "/my-business/list");
		const linkProps = external ? { href: link } : { as: Link, to: link };
		
		return (
		<Nav.Item onClick={() => setShow(false)}>
			{/*<Nav.Link {...linkProps} target={target} className={classNames}>*/}
			<NavLink to={link} className={({ isActive }) => ((isActive || setHome) ? 'nav-link active' : 'nav-link')}>
			<span>
				{icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
				{image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

				<span className="sidebar-text">{title}</span>
			</span>
			{badgeText ? (
				<Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
			) : null}
			</NavLink>
			{/*</Nav.Link>*/}
		</Nav.Item>
		);
	};

	return (
	<>
		<Navbar expand={false} collapseOnSelect variant="light" className="navbar-theme-primary position-sticky top-0 px-4 d-md-none">
			<Navbar.Brand className="me-lg-5" as={Link} to={AllRoutes.Home.path}>
			<Image src="/__xpr__/pub_engine/business-admin/web/xprs-logo-dark.svg" className="navbar-brand-light" />
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="main-navbar" onClick={onCollapse}>
			<span className="navbar-toggler-icon" />
			</Navbar.Toggle>
		</Navbar>
		<CSSTransition timeout={300} in={show} classNames="sidebar-transition">
			<Navbar className={`collapse ${showClass} sidebar d-md-block bg-white text-white`}>
			<Navbar.Brand sticky="top" as={Link} to={AllRoutes.Home.path} className="d-none d-sm-flex w-100 align-items-center justify-content-center">
				{/* TODO: update path when svg is fixed */}
				<img src="/__xpr__/pub_engine/business-admin/web/xprs-logo-dark.svg" className="d-inline-block" alt="Expresia" height="1.25rem"/>
			</Navbar.Brand>
			<div className="sidebar-inner">
				<div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center">
				<div className="d-flex align-items-center ">
					{ auth.user?.data?._embedded?.CustomFields?._embedded?.ProfileImage ?
					<Image src={auth.user?.data?._embedded?.CustomFields?._embedded?.ProfileImage?.SourcePath} className="user-avatar md-avatar rounded-circle mx-3" />
					:
					<div className="user-avatar xs-avatar border rounded-circle mx-3"><i className="xpri-members m-0"></i></div>
					} 
					{/*<div className="user-avatar lg-avatar mx-4">
					<Image src={ProfilePicture} className="card-img-top rounded-circle border-white" />
					</div>*/}
					<div className="d-flex text-dark align-items-center">
					<h6 className="m-0">{auth.user?.data ? auth.user.data.FirstName + " " + auth.user.data.LastName : "Bonnie Green" }</h6>
					<Button as={Link} variant="link" size="xs" to={AllRoutes.Login.path} className="text-dark mx-3">
						<FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
					</Button>
					</div>
				</div>
				<Nav.Link className="collapse-close d-md-none text-dark p-0 pe-3" onClick={onCollapse}>
					<i className="xpri-close"></i>
				</Nav.Link>
				</div>
				<Nav className="flex-column">
				<NavItem title="Lists" link="/my-business/list/p1" icon={faList} />
				<NavItem title="Users" link={AllRoutes.Users.path} icon={faUsers} />
				<NavItem title="Charts" link={AllRoutes.DashboardOverview.path} icon={faChartPie} />
				<NavItem title="Transactions" icon={faHandHoldingUsd} link={AllRoutes.Transactions.path} />
				<NavItem title="Settings" icon={faCog} link={AllRoutes.Settings.path} />

				<CollapsableNavItem eventKey="tables/" title="Tables" icon={faTable}>
					<NavItem title="Bootstrap Table" link={AllRoutes.BootstrapTables.path} />
				</CollapsableNavItem>

				{/*<Dropdown.Divider className="my-3 border-indigo" />*/}

				<CollapsableNavItem eventKey="components/" title="Components" icon={faBoxOpen}>
					<NavItem title="Accordion" link={AllRoutes.Accordions.path} />
					<NavItem title="Alerts" link={AllRoutes.Alerts.path} />
					<NavItem title="Badges" link={AllRoutes.Badges.path} />
					<NavItem title="Breadcrumbs" link={AllRoutes.Breadcrumbs.path} />
					<NavItem title="Buttons" link={AllRoutes.Buttons.path} />
					<NavItem title="Forms" link={AllRoutes.Forms.path} />
					<NavItem title="Modals" link={AllRoutes.Modals.path} />
					<NavItem title="Navbars" link={AllRoutes.Navbars.path} />
					<NavItem title="Navs" link={AllRoutes.Navs.path} />
					<NavItem title="Pagination" link={AllRoutes.Pagination.path} />
					<NavItem title="Popovers" link={AllRoutes.Popovers.path} />
					<NavItem title="Progress" link={AllRoutes.Progress.path} />
					<NavItem title="Tables" link={AllRoutes.Tables.path} />
					<NavItem title="Tabs" link={AllRoutes.Tabs.path} />
					<NavItem title="Toasts" link={AllRoutes.Toasts.path} />
					<NavItem title="Tooltips" link={AllRoutes.Tooltips.path} />
				</CollapsableNavItem>

				<CollapsableNavItem eventKey="examples/" title="External Pages" icon={faFileAlt}>
					<NavItem title="Sign In" link={AllRoutes.Login.path} />
					<NavItem title="Sign Up" link={AllRoutes.Signup.path} />
					<NavItem title="Forgot password" link={AllRoutes.ForgotPassword.path} />
					<NavItem title="Reset password" link={AllRoutes.ResetPassword.path} />
					<NavItem title="Lock" link={AllRoutes.Lock.path} />
					<NavItem title="404 Not Found" link={AllRoutes.NotFound.path} />
					<NavItem title="500 Server Error" link={AllRoutes.ServerError.path} />
				</CollapsableNavItem>
				</Nav>
			</div>
			</Navbar>
		</CSSTransition>
	</>
	);
};
