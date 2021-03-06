/**
 * Author:    G. Lalaj
 * Created:   21-07.2016
 *
 * (c) Copyright by MAGOWARE
 **/

'use strict';
var path = require('path'),
		db = require(path.resolve('./config/lib/sequelize')),
		response = require(path.resolve("./config/responses.js")),
		querystring = require("querystring"),
		models = db.models;

//makes a database call. returns database_error if connection failed, one genre_id otherwise

exports.dbtest = function(req, res) {
	models.genre.findAll({
		attributes: ['id'],
		limit: 1
	}).then(function (result) {
		var clear_response = new response.APPLICATION_RESPONSE(req.body.language, 200, 1, 'OK_DESCRIPTION', 'OK_DATA');
		clear_response.response_object = result;
		res.send(clear_response);
	}).catch(function(error) {
		var database_error = new response.APPLICATION_RESPONSE(req.body.language, 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA');
		res.send(database_error);
	});
};


//REGISTERS GOOGLE APP ID FOR NEW DEVICES OR UPDATES IT FOR DEVICES THAT HAVE BEEN REGISTRED ALREADY. CALLED BEFORE AND AFTER LOGIN
/**
 * @api {POST} /apiv2/network/gcm Device Register
 * @apiName GCM
 * @apiGroup APIV2
 *
 * @apiParam {Number} googleappid Users unique ID.
 * @apiParam {Number} boxid Users unique ID.
 * @apiParam {Number} macaddress Users unique ID.
 * @apiParam {Number} ntype Users unique ID.
 * @apiParam {Number} appid Users unique ID.
 * @apiParam {Number} appversion Users unique ID.
 * @apiParam {Number} devicebrand Users unique ID.
 * @apiParam {Number} os Users unique ID.
 * @apiParam {Number} screensize Users unique ID.
 * @apiParam {Number} devicebrand Users unique ID.
 * @apiParam {Number} hdmi Users unique ID.
 * @apiParam {Number} firmwareversion Users unique ID.
 * @apiParam {Number} api_version Users unique ID.
 * @apiParam {Number} language Users unique ID.
 *
 * @apiSuccess {Object} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "status_code": 200,
 *       "error_code": -1,
 *       "timestamp": Date.now(),
 *       "error_description": 'OK',
 *       "extra_data": '',
 *       "response_object": [{}]
 *   }
 *
 */
exports.gcm = function(req, res) {

	if(req.auth_obj.boxid == undefined){
		var auth_obj = querystring.parse(req.body.auth,";","=");

		models.devices.upsert({
			googleappid           : decodeURIComponent(req.body.google_app_id),
			device_id             : auth_obj.boxid,
			device_ip             : req.ip.replace('::ffff:', ''),
			device_mac_address    : (req.body.ntype == '2') ? decodeURIComponent(req.body.macaddress) : '',
			device_wifimac_address: (req.body.ntype == '1') ? decodeURIComponent(req.body.macaddress) : '',
			ntype                 : req.body.ntype,
			appid                 : req.body.appid,
			app_name              : (req.body.app_name) ? req.body.app_name : '',
			app_version           : req.body.appversion,
			device_brand          : decodeURIComponent(req.body.devicebrand),
			os                    : decodeURIComponent(req.body.os),
			screen_resolution     : req.body.screensize,
			hdmi				  : (req.body.hdmi=='true') ? 1 : 0,
			api_version           : req.body.api_version,
			firmware              : decodeURIComponent(req.body.firmwareversion),
			language              : req.body.language
		}).then(function(result){
			var clear_response = new response.APPLICATION_RESPONSE(req.body.language, 200, 1, 'OK_DESCRIPTION', 'OK_DATA');
			res.send(clear_response);
			return null;
		}).catch(function(error) {
			var database_error = new response.APPLICATION_RESPONSE(req.body.language, 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA');
			res.send(database_error);
		});

	}
	else {
		models.devices.upsert({
			googleappid           : decodeURIComponent(req.body.google_app_id),
			device_id             : req.auth_obj.boxid,
			device_ip             : req.ip.replace('::ffff:', ''),
			device_mac_address    : (req.body.ntype == '2') ? decodeURIComponent(req.body.macaddress) : '',
			device_wifimac_address: (req.body.ntype == '1') ? decodeURIComponent(req.body.macaddress) : '',
			ntype                 : req.body.ntype,
			appid                 : req.body.appid,
			app_name              : (req.body.app_name) ? req.body.app_name : '',
			app_version           : req.body.appversion,
			device_brand          : decodeURIComponent(req.body.devicebrand),
			os                    : decodeURIComponent(req.body.os),
			screen_resolution     : req.body.screensize,
			hdmi				  : (req.body.hdmi=='true') ? 1 : 0,
			api_version           : req.body.api_version,
			firmware              : decodeURIComponent(req.body.firmwareversion),
			language              : req.body.language
		}).then(function(result){
			var clear_response = new response.APPLICATION_RESPONSE(req.body.language, 200, 1, 'OK_DESCRIPTION', 'OK_DATA');
			res.send(clear_response);
			return null;
		}).catch(function(error) {
			var database_error = new response.APPLICATION_RESPONSE(req.body.language, 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA');
			res.send(database_error);
		});
	}
};


/**
 * @api {post} /apiv2/command/response /apiv2/command/response
 * @apiVersion 0.2.0
 * @apiName Device Command Response.
 * @apiGroup DeviceAPI
 *
 * @apiParam {String} username Login username.
 * @apiParam {String} googleappid Device Registration ID.
 * @apiParam {String} message Command Response Message.
 * @apiParam {String} title Message Title.
 *
 * @apiDescription Internal use - command execution response.
 */
exports.command_response = function(req,res) {

	req.body.action = 'receive';

	models.messages.create(
			req.body
	).then(function(result){
		var clear_response = new response.APPLICATION_RESPONSE(req.body.language, 200, 1, 'OK_DESCRIPTION', 'OK_DATA');
		res.send(clear_response);
		return null;
	}).catch(function(error) {
		var database_error = new response.APPLICATION_RESPONSE(req.body.language, 706, -1, 'DATABASE_ERROR_DESCRIPTION', 'DATABASE_ERROR_DATA');
		res.send(database_error);
	});

};