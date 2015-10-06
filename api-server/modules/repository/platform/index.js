var platfrmSrv = require('./services/platfrm');
var PlatfrmMdl = require('./models/platfrm');

/**
 * [insOrUpdPlatfrm description]
 *
 * @method insOrUpdPlatfrm
 *
 * @param  {[type]}        code          [description]
 * @param  {[type]}        name          [description]
 * @param  {[type]}        logo          [description]
 * @param  {[type]}        deps          [description]
 * @param  {[type]}        order         [description]
 * @param  {Function}      callback      [description]
 *
 * @return {[type]}        [description]
 */
exports.insOrUpdPlatfrm = function(code, name, logo, deps, order, callback) {
    platfrmSrv.findPlatfrmByCode(code, function(err_plat, res_plat) {
        if (err_plat) {
            return callback(err_plat, null);
        } else if (res_plat) {
            var set_obj = {};
            if (name && name != res_plat.name) {
                set_obj.name = name;
                res_plat.name = name;
            }
            if (logo && logo != res_plat.logo) {
                set_obj.logo = logo;
                res_plat.logo = logo;
            }
            if (deps && deps != res_plat.deps) {
                set_obj.deps = deps;
                res_plat.deps = deps;
            }
            if (order && order != res_plat.order) {
                set_obj.order = order;
                res_plat.order = order;
            }
            if (Object.keys(set_obj).length > 0) {
                platfrmSrv.updatePlatfrmById(res_plat._id, set_obj, function(err_upd, res_upd) {
                    if (err_upd) return callback(err_upd, null);
                    else return callback(null, res_plat);
                });
            } else {
                return callback(null, res_plat);
            }
        } else {
            var platfrm = new PlatfrmMdl(code, name, logo, deps, order);
            platfrmSrv.insertPlatfrm(platfrm, function(err_ins, res_ins) {
                if (err_ins) return callback(err_ins, null);
                else return callback(null, res_ins);
            });
        }
    });
};