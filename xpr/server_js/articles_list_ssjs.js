// this returns all xprobjects
const xpr_objects = require("/xpr/request");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    
    let articles_params = {
        "_noUnhydrated"                     : 1,
        "with"                              : "Picture,Categories,Language",
        "related_Language_Id__eq"           : request.language.Id,
        // expresia /dev/
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