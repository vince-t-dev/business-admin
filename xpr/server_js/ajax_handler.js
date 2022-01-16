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
                response = api({
                    uri: "/auth/admin/login",
                    method: "POST",
                    data: {
                        UserLogin: jsonData.UserLogin,
                        UserPassword: jsonData.UserPassword,
                        UserType: "token"
                    }
                });
                response.user = request.users.backend;
            } catch(error) {
                response.error = error.status;
                return response;
            }

            return response;
        break;
        
        case "logout":
            response = api({
      			uri: "/auth/admin/logout",
      			method: "GET"
    		});
    		
    		return response;
    	break;
    }

    return response;
}