!function(a){"use strict";function b(a){var b=a.getBoundingClientRect(),c=f.height(),d=b.top<=c&&b.bottom>0,e=d?b.bottom/c:0;return{inViewport:d,needsBlur:d&&.9>e,precentInViewport:e}}var c=!1,d=["mp4","webm"],e="videos/",f=a(window),g=a("video");g.data("ratio",.748888).laziestloader({setSourceMode:!1,trigger:400,scrollThrottle:Math.round(.3*f.height())},function(){var b=a(this).empty(),c=b.data(),f=b.width(),g=b.height(),h=f>1100?"sunset-900":"sunset-640";if(b.attr({loop:!0,poster:e+h+".jpg"}),d.forEach(function(c){var d=e+h+"."+c;b.append(a('<source src="'+d+'" type="video/'+c+'"></source>'))}),!c.eventsSet){c.eventsSet=!0,c.player=this,b.on({blurVideo:function(a,b){var d=10-Math.round(10*b.precentInViewport);c.fc.effect.defaultValues.amount=d},unblurVideo:function(){c.fc.effect.defaultValues.amount=0},playVideo:function(){c.player.play()},pauseVideo:function(){c.player.pause()}});var i=a("<canvas></canvas>").css({height:g}).insertBefore(b);c.canvas=i[0],c.fc=new frameConverter(c.player,c.canvas)}}),f.scroll(function(){c=!0}),setInterval(function(){c&&(c=!1,g.each(function(){var c=b(this),d=a(this),e=d.data().player;e&&(c.inViewport?(d.trigger("playVideo"),c.needsBlur?d.trigger("blurVideo",c):d.trigger("unblurVideo")):d.trigger("pauseVideo"))}))},250)}(jQuery);