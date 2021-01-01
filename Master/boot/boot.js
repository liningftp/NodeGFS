
'use strict';

/**
 * SUMMARY_START [default]
 * @project: GFS2_Master
 * @copyright: liningftp@qq.com
 * @name: boot
 * @desc: boot module
 * @file: /boot/boot.js
 * @author: admin
 * SUMMARY_END
 */


// REQUIRE_START [default]
// START
const path = require('path');
const fs = require('fs');

const {util, utilfs} = require('../../base');


// END
// REQUIRE_END


// PUBLIC_METHOD_START [init]
/**
 * initialize
 * @config {JSON} configure, @example {}
 * @args   {JSON} command arguments, @example {}
 */
exports.init = function( config, args ){
// START
	config.MASTER_HOST = args.h || config.MASTER_HOST || '127.0.0.1';
	config.MASTER_PORT = args.p || config.MASTER_PORT || 3000;
	config.RECORD_PATH = args.l || config.RECORD_PATH;
	config.CHECKPOINT_ROOT = args.c || config.CHECKPOINT_ROOT;
	utilfs.makePath(config.RECORD_PATH);
	let [code, msg] = utilfs.makeFile(config.RECORD_PATH);
	if(0 != code){
		console.log(msg);
	}

	utilfs.makePath(config.CHECKPOINT_ROOT);
	utilfs.makePath(config.RECORD_PATH);

// END
};
// PUBLIC_METHOD_END [init]


