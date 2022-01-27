const xpr_objects = require("/xpr/request");
const api = xpr_objects.XprApi;

// check authentication
exports.checkAuth = function checkAuth(accessToken) {    
    let token = api({
        uri: "/auth/tokens/",
        method: "GET",
        params: { "Token__eq": accessToken }
    });
    if (!token.length) return { error: "token not found."};
    let expiry = (new Date(token[0].Expiry)).toISOString();
    let today = (new Date()).toISOString();
    return ((Date.parse(expiry) >= Date.parse(today) && token.length)) ? { status: "valid token." } : { error: "invalid/expired token." };
}

exports.pagination = function pagination(data) {
    // add page object to loop on frontend
    let pages = [];
    function add_page_object(total_pages) {
        for (let i=0;i<total_pages;i++) {
            pages.push({page: i+1});
        }
        return pages;
    }

    // for collections with "collectionFormat" set to "hal"
    if (data.total) {
        //let tagsource = require("XprObjects/CallingDatasource");
        let total_items = data.total;
        let pagination = {};
        //let per_page = tagsource.configuration.params.per_page ?  tagsource.configuration.params.per_page : 10;
        //let page = tagsource.configuration.params.page ? Number(tagsource.configuration.params.page) : Number(1); 
        let per_page = data.per_page || 10;
        let page = Number(data.page) || Number(1);
        pagination.totalPages = Math.ceil(total_items / per_page);
        if (page < pagination.totalPages) pagination.nextPage = page+1;
        if (page > 1) pagination.prevPage = page-1;
        pagination.pages = add_page_object(pagination.totalPages);
        //data.Pagination = pagination;
        return pagination;
    }
}