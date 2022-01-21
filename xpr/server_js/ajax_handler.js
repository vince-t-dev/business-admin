// ajax handler: element
const xpr_objects = require("/xpr/request");
const library = require("./library");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    let jsonData = request.body ? JSON.parse(request.body) : {};
    let response = {};

    switch (jsonData.action) {
        case "login":
            try {
                // get token
                response = api({
                    uri: "/auth/admin/login",
                    method: "POST",
                    data: {
                        UserLogin: jsonData.UserLogin,
                        UserPassword: jsonData.UserPassword,
                        UserType: "token"
                    }
                });
                // get user info
                let user = api({
                    uri: "/users/",
                    method: "GET",
                    params: { 
                        _noUnhydrated: 1,
                        with: "CustomFields",
                        Username__eq: jsonData.UserLogin 
                    }
                })
                let format_user = user[0].map(({ Id, FirstName, LastName, City, _embeddded }) => ({Id, FirstName, LastName, City, _embeddded}));
                response.user = format_user;
            } catch(error) {
                response.error = error.status;
                return response;
            }

            return response;
        break;
        
        case "logout":
            // delete token
            let token = api({
                uri: "/auth/tokens/",
                method: "GET",
                params: { "Token__eq": request.headers.Auth }
            });
            api({
                uri: "/auth/tokens/"+token[0].Id,
                method: "DELETE"
            });
            // logout
            response = api({
                uri: "/auth/admin/logout",
                method: "GET"
            });
    		return response;
    	break;

        case "checkAuth":
            // validate token
            response = library.checkAuth(request.headers.Auth);
            return response;
        break;
    }

    return response;
}