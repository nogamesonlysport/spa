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
			anchor_schema_map : {
				chat : {open : true, closed : true}
			},
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
			anchor_map = {},
			is_chat_retracted : true
		},

		jQueryMap = {},

		setJqueryMap, toggleChat, onClickChat, initModule, copyAnchorMap, changeAnchorPart, onHashchange;
		//end module scope variables

		//begin utility methods
		copyAnchorMap = function () {
			return $.extend( true, {}, stateMap.anchor_map);		
		};
		//end utility methods
		
		//begin DOM methods
		//begin DOM methods - changeAnchorPart
		changeAnchorPart = function (arg_map) {
			var anchor_map_revise = copyAnchorMap(),
			bool_return = true,
			key_name, key_name_dep;

			//merge changes from arg_map to anchor_map_revise
			KEYVAL:
			for(key_name in arg_map){
				if(arg_map.hasOwnProperty(key_name)){
					if(key_name.indexOf("_") === 0) {continue KEYVAL;}
				
					anchor_map_revise[key_name] = arg_map[key_name];
				
					key_name_dep = "_" + key_name;
					if(arg_map[key_name_dep]){
						anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
					}	
					else{
						delete anchor_map_revise[key_name_dep];
						delete anchor_map_revise["_s" + key_name_dep];
					}
				}		
			}
			//end merge changes
			//begin attempt to update url
			try{
				$.uriAnchor.setAnchor(anchor_map_revise);
			}
			catch(error){
				$.uriAnchor.setAnchor(stateMap.achor_map, null, true);
				bool_return = false;
			}
			//end attempt to update url
			return bool_return;
		}
		//end DOM methods - changeAnchorPart
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
		//begin event handler - onHashchange
		onHashchange = function(event){
			var anchor_map_previous = copyAnchorMap(),
			anchor_map_proposed, _s_chat_previous, _s_chat_proposed;

			//attempt to parse anchor
			try{
				anchor_map_proposed = $.uriAnchor.makeAnchorMap();
			}
			catch ( error ) {
		 		$.uriAnchor.setAnchor( anchor_map_previous, null, true );
				return false;
			}
			//update the stateMap with the proposed anchor map
			stateMap.anchor_map = anchor_map_proposed;
			//convenience vars
			_s_chat_previous = anchor_map_previous._s_chat;
			_s_chat_proposed = anchor_map_proposed._s_chat;
			
			//begin adjust chat component if changed
			if(!anchor_map_previous || _s_chat_previous !== _s_chat_proposed){
				s_chat_proposed = anchor_map_proposed.chat;
				switch(s_chat_proposed){
					case 'open':
						toggleChat(true);
						break;
					case 'closed':
						toggleChat(false);
						break;
					default:
						toggleChat(false);
						delete anchor_map_proposed.chat;
						$.uriAnchor.setAnchor( anchor_map_proposed, null, true );
				}
			}
			//end adjust chat component if changed
			return false;
		};
		//end event handler - onHashchange
		onClickChat = function (event) 
		{
			changeAnchorPart({
				chat: ( stateMap.is_chat_retracted ? 'open' : 'closed' )
			});
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
			// configure uriAnchor to use our schema 
			$.uriAnchor.configModule({
				schema_map : configMap.anchor_schema_map
			});
			$(window)
				.bind( 'hashchange', onHashchange )
			        .trigger( 'hashchange' );
         		};
			//setTimeout( function() {toggleChat(true);}, 3000);
			//setTimeout( function() {toggleChat(false);}, 8000);
		};
		//end public method - initModule
		return {initModule : initModule};
		//end public methods
	}());

