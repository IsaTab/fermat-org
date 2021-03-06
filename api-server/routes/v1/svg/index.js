var svg2png = require("../../../modules/repository/lib/svg2png");
var express = require('express');
var router = express.Router();
var multer = require('multer');
var security = require('../../../lib/utils/security');
var cwd = process.cwd();
var path = require('path');
var dir = path.join(cwd, 'uploads');
var fs = require("fs");
var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, dir);
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	}
});
var upload = multer({
	storage: storage
}).single('svg');
/**
 * [setVldFleName description]
 * @param {[type]} req [description]
 */
var setVldFleName = function(req) {
	var newNameSvg = '';
	if (req.params.type === 'group')
		newNameSvg = 'icon_' + req.params.code.toUpperCase();
	else
		newNameSvg = req.params.code.toUpperCase() + '_logo';
	var newPath = dir + '/' + newNameSvg + '.svg';
	var oldPath = dir + '/' + req.file.filename;
	fs.renameSync(oldPath, newPath);
	return newNameSvg + '.svg';
};
/**
 * @api {post} /v1/svg/upload/:type/:code upload svg file
 * @apiName Upload
 * @apiVersion 1.0.0
 * @apiGroup SVG
 * @apiParam {String} type Image type (headers, group, type).
 * @apiParam {File} svg SVG file to upload.
 * @apiParam {String} code Image code.
 * @apiDescription Converts svg to png file and uploads it to the server via ftp.
 */
router.post('/upload/:type/:code', function(req, res, next) {
	try {
		if (!security.isValidData(req.params.type)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else if (!security.isValidCode(req.params.code)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		}
		else {
			upload(req, res, function(err) {
				if (err) {
					console.log(err + ": Error uploading file.");
					return res.end(err + ": Error uploading file.");
				}
				if (!security.isValidData(req.file))
					res.status(412).send('filename missing or invalid');
				else if (!security.isValidExtFile(req.file.filename)) {
					fs.unlinkSync(dir + '/' + req.file.filename);
					res.status(412).send('format file invalid');
				} else {
					var filename = setVldFleName(req);
					svg2png.pushFtp(req.params.type, filename,
						function(err, resp) {
							if (err) res.status(402).send(err + ": Error transferring files");
							if (resp) res.status(200).send(resp);
						});
				}
			});
		}
	} catch (err) {
		console.error("Error", err);
		res.status(402).send(err + ": Error transferring files");
	}
});
// router export
module.exports = router;