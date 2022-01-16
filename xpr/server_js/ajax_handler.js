// ajax handler: element
const xpr_objects = require("/xpr/request");

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
                    params: { Username__eq: jsonData.UserLogin }
                })
                response.user = user[0];
            } catch(error) {
                response.error = error.status;
                return response;
            }

            return response;
        break;
        
        case "logout":
            return { request, context, options };
            // delete token
            /*let token = api({
                uri: "/auth/tokens/?Token__eq="+request.headers.Authorization,
                method: "GET"
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
    		return response;*/
    	break;
    }

    return response;
}