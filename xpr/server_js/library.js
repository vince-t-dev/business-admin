const xpr_objects = require("/xpr/request");
const api = xpr_objects.XprApi;

// check authentication
exports.checkAuth = function checkAuth(accessToken) {    
    let token = api({
        uri: "/auth/tokens/",
        method: "GET",
        params: { "Token__eq": accessToken }
    });
    let expiry = (new Date(token[0].Expiry)).toISOString();
    let today = (new Date()).toISOString();
    return ((Date.parse(expiry) >= Date.parse(today) && token.length)) ? { status: "valid token" } : { error: "invalid/expired token" };
}