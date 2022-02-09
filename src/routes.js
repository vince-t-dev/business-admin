
export const AllRoutes = {
    // pages
    Home: { path: "/my-business/" },
    Start: { path: "/__xpr__/pub_engine/business-admin/web" },
    List: { path: "/my-business/list/*" },
    ListItem: { path: "/my-business/list/edit/:id" },
    Attendee: { path: "/my-business/attendees/:id"},
    Users: { path: "/my-business/users/*" },
    
    Settings: { path: "/my-business/settings" },
    Login: { path: "/my-business/login" },
    Lock: { path: "/my-business/lock" },
    Signup: { path: "/my-business/examples/sign-up" },
    ForgotPassword: { path: "/my-business/examples/forgot-password" },
    ResetPassword: { path: "/my-business/examples/reset-password" },
    NotFound: { path: "/my-business/examples/404" },
    ServerError: { path: "/my-business/examples/500" }
};