(function( $ ) {
	$.simpleTooltip = {
		version: '0.1',
		defaults: {
			tooltipOnHover : true,
			tooltipOnClick : false,
			hideTooltipOnClick : true, 
			tooltipText : 'This is a tooltip',
			tooltipClass : '',
			tooltipFixedPosition : true,
			arrowOnTooltip : true,
			tooltipPosition : 'top',
			tooltipType : 'info',
			unbind : false,
			newLine : '\\n'
		}
	};
	$.fn.simpleTooltip = function(options) {
		var opts = $.extend({}, $.simpleTooltip.defaults, options);
		var alreadyPositioned = false;
		var methods = {
			init: function(){
				var tooltipBindings = methods['getTooltipBindings'].call(this);
				this.each(function() {
					var $this = $(this);
					if (opts.unbind) $this.removeClass('simple-tooltip').unbind(tooltipBindings); 
					else $this.addClass('simple-tooltip').bind(tooltipBindings);
				});
			},
			getTooltipBindings: function(){
				var tooltipBindings = {};
				if (opts.tooltipOnHover){
					tooltipBindings = {
							mousemove : methods['changeTooltipPosition'],
							mouseenter : methods['showTooltip'],
							mouseleave: methods['hideTooltip']
						};
				}
				if (opts.tooltipOnClick){
					tooltipBindings['click'] = methods['showHideTooltip'];
				}
				return tooltipBindings;
			},
			buildTooltip: function(text,type){
				var paragraphs = text.split(opts.newLine);
				text = '';
				for (var index = 0; index < paragraphs.length; index++) text += '<p class="simple-tooltip-text">* ' + paragraphs[index] + '</p>';
				var markup = '<div class="simple-tooltip ' + opts.tooltipClass + ' simple-tooltip-' + type + '"><div class="simple-tooltip-content">' + text + '</div>';
				if (opts.arrowOnTooltip){
					var arrow = methods['getArrow'].call(this);
					markup += '<div class="simple-tooltip-arrow" style="position:absolute">' + arrow + '</div>';
				}
				markup += "</div>";
				return markup;
			},
			getArrow: function(){
				var arrow = '';
				if (opts.tooltipPosition == 'top') for (var i = 10; i >= 1; i--) arrow += '<div class="line' + i + '"><!-- --></div>';
				else for (var i = 1; i >= 10; i++) arrow += '<div class="line' + i + '"><!-- --></div>';
				return arrow;
			},
			showTooltip: function(e) {
				methods['hideTooltip'].call(this);
				var text = opts.tooltipText;
				var $currTarget = $(e.currentTarget);
				if (typeof $currTarget.attr('simple-tooltipText') != 'undefined')
					text = $currTarget.attr('simple-tooltipText');
				var type = opts.tooltipType;
				if (typeof $currTarget.attr('simple-tooltipType') != 'undefined')
					type = $currTarget.attr('simple-tooltipType');
				var tt = methods['buildTooltip'].call(this,text,type);
   				$(tt).appendTo('body');
				if (opts.hideTooltipOnClick) $('div.simple-tooltip').click(methods['hideTooltip']);
   				methods['changeTooltipPosition'].call(this,e);
   				alreadyPositioned = true;
			},
			changeTooltipPosition: function(e) {
				if (opts.tooltipFixedPosition && alreadyPositioned) return;
				var xCoord = e.pageX;
				var yCoord = e.pageY;
				if (opts.tooltipFixedPosition){
					var $currTarget = $(e.currentTarget);
					xCoord = $currTarget.offset().left - 14;
					yCoord = $currTarget.offset().top;
				}
				var ttWidth = $('div.simple-tooltip').outerWidth(true);
				var ttHeight = $('div.simple-tooltip').outerHeight(true);
				var tooltipX = xCoord; // - ttWidth/2 + 4;
				var tooltipY = yCoord + 8;
				if (opts.tooltipPosition == 'top'){
					tooltipY = Math.max(tooltipY - 16 - ttHeight,0);
				}
				$('div.simple-tooltip').css({top: tooltipY, left: tooltipX});
			},
			hideTooltip: function() {
				$('div.simple-tooltip').remove();
				$('div.simple-tooltip-arrow').remove();
   				alreadyPositioned = false;
			},
			showHideTooltip: function(e){
				if ($('div.simple-tooltip').is(':visible')) methods['hideTooltip'].call(this,e);
				else methods['showTooltip'].call(this,e);
			}
		};
		methods['init'].call(this);
	};
}( jQuery ));
