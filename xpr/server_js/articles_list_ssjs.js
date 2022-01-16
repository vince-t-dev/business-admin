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
    var expiry = token[0].Expiry;
    var today = (new Date()).toISOString().split('T')[0];
    /*if (Date.parse(expiry) <= Date.parse(today)) {
        return { "expired!": today }
     } else {
        return { "good": expiry }
     }*/
     //let XprCallingDatasource = xpr_objects.XprCallingDatasource();
     //let XprCurrentBundle = xpr_objects.XprCurrentBundle();
     let xpr = require("/xpr/");
     //let XprWeb = xpr_objects.XprWeb();
     return { xpr };

    let articles_params = {
        "_noUnhydrated"                     : 1,
        "with"                              : "Picture,Categories,CustomFields,Language",
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