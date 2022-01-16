// check authentication
function auth(token) {
    let token = api({
        uri: "/auth/tokens/",
        method: "GET",
        params: { "Token__eq": token }
    });
    var expiry = (new Date(token[0].Expiry)).toISOString();
    var today = (new Date()).toISOString();
    return { error: (Date.parse(expiry) <= Date.parse(today) || !token.length) }
}

module.exports = auth;