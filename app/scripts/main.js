(function($) {
    'use strict';

    var didScroll = false,
        codecs = ['mp4', 'webm'],
        assets = 'videos/',
        $win = $(window),
        $videos = $('video');

    function viewportStatus(el) {
        var rect = el.getBoundingClientRect();
        var viewportHeight = $win.height();

        // is any part of the element in the viewport?
        var inViewport = (
            rect.top <= viewportHeight &&
            rect.bottom > 0
        );

        // precent of element height remaining in the viewport
        var precentRemainingInViewport = (inViewport) ? (rect.bottom / viewportHeight) : 0;

        return {
            inViewport: inViewport,
            needsBlur: inViewport && precentRemainingInViewport < 0.9,
            precentInViewport: precentRemainingInViewport
        };
    }

    $videos.data('ratio', 0.748888).laziestloader({
        setSourceMode: false,
        trigger: 400,
        scrollThrottle: Math.round($win.height() * 0.30)
    }, function() {
        var $video = $(this).empty(),
            data = $video.data(),
            width = $video.width(),
            height = $video.height(),
            slug = (width > 1100) ? 'sunset-900' : 'sunset-640';

        $video.attr({
            loop: true,
            poster: assets + slug + '.jpg'
        });

        codecs.forEach(function(codec) {
            var src = assets + slug + '.' + codec;
            $video.append($('<source src="' + src + '" type="video/' + codec + '"></source>'));
        });

        if (!data.eventsSet) {
            data.eventsSet = true;
            data.player = this;

            $video.on({
                blurVideo: function(ev, status) {
                    // pick a value between 0 and 10, based on the percent the
                    // video element is in the viewport
                    var blurValue = 10 - Math.round(status.precentInViewport * 10);
                    data.fc.effect.defaultValues.amount = blurValue;
                },
                unblurVideo: function() {
                    data.fc.effect.defaultValues.amount = 0;
                },
                playVideo: function() {
                    data.player.play();
                },
                pauseVideo: function() {
                    data.player.pause();
                }
            });

            var $canvas = $('<canvas></canvas>').css({
                height: height
            }).insertBefore($video);

            data.canvas = $canvas[0];

            data.fc = new frameConverter(data.player,data.canvas);

        }
    });

    // throttled scroll events
    $win.scroll(function() {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            didScroll = false;

            $videos.each(function() {
                var status = viewportStatus(this),
                    $video = $(this),
                    player = $video.data().player;

                if (player) {
                    if (status.inViewport) {
                        $video.trigger('playVideo');

                        if (status.needsBlur) {
                            $video.trigger('blurVideo', status);
                        } else {
                            $video.trigger('unblurVideo');
                        }
                    } else {
                        $video.trigger('pauseVideo');
                    }
                }
            });
        }
    }, 250);

})(jQuery);
