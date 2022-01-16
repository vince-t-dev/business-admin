// this returns all xprobjects
const xpr_objects = require("/xpr/request");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    
    // validate token
    let token = api({
        uri: "/auth/tokens/",
        method: "GET",
        params: { "Token__eq": request.headers.Auth }
    });
    var expiry = (new Date(token[0].Expiry)).toISOString();
    var today = (new Date()).toISOString();
    if (Date.parse(expiry) <= Date.parse(today) || !token.length) return { error: "Invalid/expired token." }

    let article_params = {
        "_noUnhydrated"                     : 1,
        "with"                              : "Picture,Categories,CustomFields,Language",
        "related_Language_Id__eq"           : request.language.Id
    }
    if (request.urlParams.q) article_params.q_Title_Description_Html = request.urlParams.q;
    if (request.urlParams.page) article_params.page = request.urlParams.page;

    let article = api({
        method: "GET",
        uri : "/articles/"+request.urlParams.id,
        params : article_params
    });

    return article;
}