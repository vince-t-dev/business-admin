// this returns all xprobjects
const xpr_objects = require("/xpr/request");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
    
    let article_params = {
        "_noUnhydrated"                     : 1,
        "with"                              : "Picture,Categories,CustomFields,Language",
        "related_Language_Id__eq"           : request.language.Id
    }
    if (request.urlParams.q) article_params.q_Title_Description_Html = request.urlParams.q;
    if (request.urlParams.page) article_params.page = request.urlParams.page;
    let article = api({
        method: "GET",
        uri : "/articles/"+request.urlParams.secondary,
        params : article_params
    });

    return article;
}