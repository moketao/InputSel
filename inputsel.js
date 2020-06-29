/**
 * InputSel v1.0.0
 * require jquery
 * MIT License
 * for more info pls visit :https://github.com/moketao/InputSel
 */

;
var QuickScore = function (arr,key) {
	this.arr = arr;
	this.key = key;
	var me = this;
	this.search = function(key){
		var len = me.arr.length;
		var out = [];
		for(var i=0; i<len; i++){
			if(me.arr[i] && me.arr[i][me.key] && me.arr[i][me.key].indexOf(key)>=0){
				out.push(me.arr[i]);
			}
		}
		return out;
	}
	this.setArr = function(newArr){
		me.arr = newArr;
	}
}
;
(function($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "inputSel",
        defaults = {
            arr:['abc','ab','aabb','bba','hello'],
            key:"name",
        };
        
    $.fn.updateSel = function(arr) {
	  var jqOB = this.data('plugin_'+pluginName);
	  if(jqOB){
	  	jqOB.quickScore.arr = arr;
	  	jqOB.show(jqOB,$(jqOB.element));
	  }
	};

    function InputSel(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.version = 'v1.0.0';
        this.init();
    }

    InputSel.prototype = {
        init: function() {
            var that = this;
            var $element = $(that.element);
            var $overlayContainer = that.createContainer(that,$element);
            that.container = $overlayContainer;
            that.quickScore = new QuickScore(that.settings.arr,that.settings.key);
            var ul = $('<ul class="sels"></ul>');
            ul.css({
                //maxHeight:'10em',
                overflow: 'auto',
                boxSizing:'border-box',
                listStyle: 'none',
                listStyleType: 'none',
                padding:0,
                margin:0,
            });
            $overlayContainer.append(ul);
            $('body').append($overlayContainer);
            $element.attr('autocomplete','off')
            $element.bind({
                input : function() {
                    that.show(that,$element);
                },
                change: function () {
                    that.show(that,$element)
                },
                blur:function(){
                    //console.log(that);
                }
            });
        },
        createContainer: function(instance,$element) {
            //get the properties of the target
            var top = $element.offset().top+$element.outerHeight()+1,
                left = $element.offset().left,
                //border = parseFloat($element.css("border-left-width")),
                width = $element.outerWidth(),
                height = $element.outerHeight();
            zIndex = $element.css("z-index");
            var $selContainer = $('<div>', {
                class: 'sel-container'
            })
            if(instance.settings.className){
            	$selContainer.addClass(instance.settings.className);
            }else{
	            $selContainer.css({
	                top: top,
	                left: left,
	                width: width,
	                position: 'absolute',
	                padding:'0.3em',
	                overflow: 'hidden',
	                border:'1px rgba(0,0,0,0.15) solid',
	                backgroundColor:'#f5f5f5',
	                boxShadow:'8px 8px 0px rgba(0,0,0,0.07)',
	                pointerEvent: 'none',
	                borderRadius: '0.5em',
	                zIndex: zIndex == +zIndex ? (zIndex + 1) : 999
	            })
            }
            $selContainer.hide();

            $('body').append($selContainer);
            return $selContainer;
        },
        show: function(instance,$element) {
            var res = instance.quickScore.search($element.val());
            if(res && res.length==0){
            	return;
            }
            var selswarp = instance.container.show();
            var sels = selswarp.find('ul');
            sels.empty();
            var offset = $element.offset();
            var left = offset.left;
            var top = offset.top;
            selswarp.offset({left:left, top:top+$element.outerHeight()});
            var limitNum = 10;//限制大小
            var len = res.length;
            len = len>limitNum?limitNum:len;
            for(var i=0; i<len; i++){
                var oneSearch = res[i];
                var li = $('<li></li>').text(oneSearch[instance.settings.key]);
                if(!instance.settings.className){
	                li.css({
	                    listStyle: 'none',
	                    listStyleType: 'none',
	                    padding:0,
	                    padding:'0.33em',
	                    backgroundColor: '#fff',
	                    color:'#667',
	                    borderRadius:'0.3em',
	                    margin:'0.3em',
	                    cursor: 'pointer',
	                });
	            }
                li.hover(
                    function () {
                    	if(!instance.settings.className){
	                        $(this).css({
	                            backgroundColor: '#666d7f',
	                            color: '#fff',
	                        });
                    	}else{
                    		$(this).addClass('on');;
                    	}
                    },
                    function () {
                    	if(!instance.settings.className){
	                        $(this).css({
                            backgroundColor: '#fff',
                            color:'#667',
                        });
                    	}else{
                    		$(this).removeClass('on');;
                    	}
                    }
                );
                li.data('item',oneSearch);
                li.on('mouseup',function(){
                    var li = $(this);
                    var oneSearch = li.data('item');
                    $element.val(oneSearch[instance.settings.key]);
                    setTimeout(instance.hide,55,instance,$element);
                })
                sels.append(li);
            }
        },
        hide: function(instance,$element) {
            instance.container.hide();
        },
    };

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new InputSel(this, options));
            }
        });
        return this;
    };

})(jQuery, window, document)

