var suprlaySrv = require('./services/suprlay');
var SuprlayMdl = require('./models/suprlay');

/**
 * [insOrUpdSuprlay description]
 *
 * @method insOrUpdSuprlay
 *
 * @param  {[type]}        code          [description]
 * @param  {[type]}        name          [description]
 * @param  {[type]}        logo          [description]
 * @param  {[type]}        deps          [description]
 * @param  {[type]}        platfrm_index [description]
 * @param  {[type]}        layer_index   [description]
 * @param  {Function}      callback      [description]
 *
 * @return {[type]}        [description]
 */
exports.insOrUpdSuprlay = function(code, name, logo, deps, order, callback) {
    suprlaySrv.findSuprlayByCode(code, function(err_supr, res_supr) {
        if (err_supr) {
            return callback(err_supr, null);
        } else if (res_supr) {
            var set_obj = {};
            if (name && name != res_supr.name) {
                set_obj.name = name;
                res_supr.name = name;
            }
            if (logo && logo != res_supr.logo) {
                set_obj.logo = logo;
                res_supr.logo = logo;
            }
            if (deps && deps != res_supr.deps) {
                set_obj.deps = deps;
                res_supr.deps = deps;
            }
            if (order && order != res_supr.order) {
                set_obj.order = order;
                res_supr.order = order;
            }
            if (Object.keys(set_obj).length > 0) {
                suprlaySrv.updateSuprlayById(res_supr._id, set_obj, function(err_upd, res_upd) {
                    if (err_upd) return callback(err_upd, null);
                    else return callback(null, res_supr);
                });
            } else {
                return callback(null, res_supr);
            }
        } else {
            var suprlay = new SuprlayMdl(code, name, logo, deps, order);
            suprlaySrv.insertSuprlay(suprlay, function(err_ins, res_ins) {
                if (err_ins) return callback(err_ins, null);
                else return callback(null, res_ins);
            });
        }
    });
};