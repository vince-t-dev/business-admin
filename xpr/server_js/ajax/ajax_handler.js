// ajax handler: route
const xpr_objects = require("/xpr/request");
const utilities = require("/xpr/utilities");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
 
    return { context, options, request, utilities };
}