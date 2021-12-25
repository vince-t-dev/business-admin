// this returns all xprobjects
const xpr_objects = require("/xpr/request");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    
    let users_params = { per_page: 10 };
    if (request.urlParams.q) users_params.q_FirstName_LastName_Email = request.urlParams.q;
    if (request.urlParams.page) users_params.page = request.urlParams.page;
    let users = api({
        method: "GET",
        uri : "/users/",
        params : users_params
    });

    return users;
}
