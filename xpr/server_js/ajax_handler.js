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
                // get basic user info
                let user = api({
                    uri: "/users/",
                    method: "GET",
                    params: { 
                        _noUnhydrated: 1,
                        with: "CustomFields",
                        Username__eq: jsonData.UserLogin 
                    }
                })
                let profile_image = user[0]._embedded.CustomFields._embedded ? user[0]._embedded.CustomFields._embedded.ProfileImage : {};
                let user_obj = {
                    Id: user[0].Id,
                    FirstName: user[0].FirstName,
                    LastName: user[0].LastName,
                    City: user[0].City,
                    _embedded: {
                        CustomFields: { _embedded: { ProfileImage: profile_image } }
                    } 
                }
                response.user = user_obj;
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

        // post data
        case "postData":  
            response = api({
                method: "POST",
                uri: jsonData.uri,
                data: jsonData.data
            });
            
            return response;
        break;
        
        // put data
        case "putData":  
            response = api({
                "method": "PUT",
                "uri": jsonData.uri,
                "data": jsonData.data
            });
            
            return response;
        break;
    }

    return response;
}