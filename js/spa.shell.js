 /*
          * spa.shell.js
          * Shell module for SPA
*/

/*	jslint browser : true, continue : true, devel : true, indent : 2, maxerr : 50, newcap : true, 
	nomen : true, plusplus : true, regexp : true, sloppy : true, vars : false, white : true	
*/

	spa.shell = ( function () {
		// begin module scope variables
		var configMap = {
			main_html : String ()
				+'<div id="spa">'
					+'<div class="spa-shell-head">'
						+'<div class="spa-shell-head-logo"></div>'
						+'<div class="spa-shell-head-acct"></div>'
						+'<div class="spa-shell-head-search"></div>'
					+'</div>'
					+'<div class="spa-shell-main">'
						+'<div class="spa-shell-main-nav"></div>'
						+'<div class="spa-shell-main-content"></div>'
					+'</div>'
					+'<div class="spa-shell-foot"></div>'
					+'<div class="spa-shell-chat"></div>'
					+'<div class="spa-shell-modal"></div>'
				+'</div>',
			chat_extend_time : 1000,
			chat_retract_time : 300,
			chat_extend_height : 450,
			chat_retract_height : 15,
			chat_extended_title : 'Click to retract',
			chat_retracted_title : 'Click to extend'
		},

		stateMap = { 
			$container : null,
			is_chat_retracted : true
		},

		jQueryMap = {},

		setJqueryMap, toggleChat, onClickChat, initModule;
		//end module scope variables

		//begin utility methods
		//end utility methods
		
		//begin DOM methods
		//begin DOM method - setJqueryMap
		var setJqueryMap = function () {
			var $container = stateMap.$container;
			jQueryMap = { 
				$container : $container,
				$chat : $container.find('.spa-shell-chat')			
			};		
		};
		//end DOM method - set JqueryMap

		//begin DOM method - toggleChat
		toggleChat = function (do_extend, callback) {
			var px_chat_height = jQueryMap.$chat.height(),
			is_open = px_chat_height === configMap.chat_extend_height,
			is_closed = px_chat_height === configMap.chat_retract_height,
			is_sliding = !is_open && !is_closed

			if(is_sliding)
			{
				return false;
			}

			if(do_extend)
			{
				jQueryMap.$chat.animate(
					{height : configMap.chat_extend_height}, 
					configMap.chat_extend_time, 
					function() {
						jQueryMap.$chat.attr ('title', configMap.chat_extended_title);
						stateMap.is_chat_retracted = false;
						if(callback)
						{
							callback(jQueryMap.$chat);
						}
					}
				);
				return true;
			}

			jQueryMap.$chat.animate(
				{height : configMap.chat_retract_height}, 
				configMap.chat_retract_time, 
				function() {
					jQueryMap.$chat.attr('title', configMap.chat_retracted_title);
					stateMap.is_chat_retracted = true;
					if(callback)
					{
						callback(jQueryMap.$chat);
					}
				}
			);
			return true;
		};
		//end DOM method - toggleChat
		//end DOM methods

		//begin event handlers
		onClickChat = function (event) 
		{
			toggleChat(stateMap.is_chat_retracted);
			return false;
		};
		//end event handlers

		//begin public methods
		//begin public method - initModule
		initModule = function ($container) {
			stateMap.$container = $container;
			$container.html (configMap.main_html);
			setJqueryMap();
			//initialize chat slider and bind click handler
			stateMap.is_chat_retracted = true;
			jQueryMap.$chat.attr('title', configMap.chat_retracted_title)
					.click(onClickChat);
			//setTimeout( function() {toggleChat(true);}, 3000);
			//setTimeout( function() {toggleChat(false);}, 8000);
		};
		//end public method - initModule
		return {initModule : initModule};
		//end public methods
	}());

