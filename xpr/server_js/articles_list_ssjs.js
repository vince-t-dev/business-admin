// this returns all xprobjects
const xpr_objects = require("/xpr/request");
const library = require("./library");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    
    // validate token
    let token = library.checkAuth(request.headers.Auth);
    if (token.error) return token;
    
    let articles_params = {
        "_noUnhydrated"                     : 1,
        "with"                              : "Categories,Language",
        "related_Language_Id__eq"           : request.language.Id,
        // expresia /my-business/ section
        "SectionId__in"                     : 6103,
        "order_fields"                      : "SortOrder",
        "order_dirs"                        : "ASC",
        "per_page"                          : 10
    }
    if (request.urlParams.q) articles_params.q_Title_Description_Html = request.urlParams.q;
    if (request.urlParams.page) articles_params.page = request.urlParams.page;
    let articles = api({
        method: "GET",
        uri : "/articles/",
        params : articles_params
    });

    return articles;
}