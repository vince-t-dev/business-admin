exports.process = function(context, options) {
    var api = require("XprObjects/Api");
    var request = require("XprObjects/WebRequest");

    var users = api.call({
        method: "GET",
        uri: "/users/",
        params: {
            "per_page": 10
        }
    });

    return users;
}
