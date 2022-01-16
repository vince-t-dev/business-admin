// this returns all xprobjects
const xpr_objects = require("/xpr/request");

exports.process = function(context, options) {
    var api = xpr_objects.XprApi;
    let request = xpr_objects.XprRequest();
 
    return { context, options, xpr_objects };
}