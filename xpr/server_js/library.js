const xpr_objects = require("/xpr/request");
const api = xpr_objects.XprApi;

// check authentication
exports.checkAuth = function checkAuth(token) {    
    let check_auth = api({
        uri: "/auth/tokens/",
        method: "GET",
        params: { "Token__eq": token }
    });
    let expiry = (new Date(token[0].Expiry)).toISOString();
    let today = (new Date()).toISOString();
    return { auth_error: (Date.parse(expiry) <= Date.parse(today) || !token.length) }
}