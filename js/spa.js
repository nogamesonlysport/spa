/*
 * spa.js
 * Root namespace module
￼*/

/*jslint
	continue : true, maxerr  : 50, browser : true, indent : 2, nomen : true,
	sloppy : true, plusplus : true, vars : false, devel  : true, newcap : true,
	regexp : true, white  : true
*/
/*global $, spa */
	var spa = (function () {
		var initModule = function ( $container ) {
			spa.shell.initModule($container);
		};
		return { initModule: initModule };
	}());
