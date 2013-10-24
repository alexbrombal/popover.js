;(function() {

    window.Popover = function(options) {

        this.options = $.extend({
            id: '',                         // The id to give the popover div (prefixed with popover-).
            className: '',                  // The class to give the popover div.
            bodyClass: '',                  // A custom class to add to the body when the popover is visible

            html: '',                       // The html content to use in the popover. [or]

            url: '',                        // The url location of the content to load via Ajax.
            data: null,                     // Optional data to pass as POST data to the Ajax request.
            type: 'get',                    // Optional ajax method type ('get' or 'post')
            cache: false,                   // Whether to allow cache for ajax calls
            preload: true,                  // If true, the url will be preloaded upon popover creation.
                                            // If false, the url will be reloaded when the popover is shown.

            onContent: function(text) {},   // Called upon successfully loading the Ajax request, before the content is
                                            // injected into the window. If text is returned from this method, it will
                                            // be injected into the window instead.
            onInject: function() {},        // Called whenever new html content is injected into the window, before it is visible.
            onShow: function() {},          // Called after the popover is shown.
            onError: function() {},         // Called upon failure to load the Ajax request.

            width: 400,                     // The default width of the popover.
            height: 'auto'                  // The default height of the popover.
        }, options);

        this.window = $('<div id="popover-'+this.options.id+'" class="popover '+this.options.className+' '+this.options.id+'"></div>').css({
            position: 'absolute',
            left: '50%',
            width: this.options.width,
            height: typeof this.options.height != 'undefined' ? this.options.height : 'auto'
        });

        this.window.data('popover', this);

        if(this.options.html || (this.options.url && this.options.preload))
            this._loadContent();
    };

    Popover.queue = [];

    Popover.show = function(options) {
        var p = new Popover(options);
        p.show();
        return p;
    };

    Popover.close = function(obj) {
        if(obj) Popover.get(obj).close();
        else if(Popover.queue.length) Popover.queue[Popover.queue.length-1].close();
    };

    Popover.get = function(obj) {
        return $(obj).closest('.popover').data('popover');
    };


    $.extend(window.Popover.prototype, {

        show: function(options)
        {
            if(options)
            {
                if(options.id) this.window.attr('id', 'popover-'+options.id);
                if(options.className) this.window.attr('class', 'popover ' + options.className + ' ' + (options.id || this.options.id));
                if(options.url || options.html) this.content = null;
                if(options.url) this.options.html = null;
                if(options.html) this.options.url = null;
                this.options = $.extend(this.options, options);
            }

            if(!this.content)
            {
                this.load();
                this._loadContent();
            }
            else
                this._showWindow();

            return false;
        },

        /**
         * Show the window with a 'loading' class
         * @param options
         */
        load: function()
        {
            this._showWindow();
            this.window.addClass('loading').css('height', this.window.height()).html('');
        },

        /**
         * Loads the content from ajax or the html string, and injects it into the window.
         * onContent and onInject are called.
         *
         * @private
         */
        _loadContent: function()
        {
            if(this.xhr) return;
            if(this.content) return;

            var _this = this;
            var loadSuccess = function(text) {
                _this.xhr = null;
                if(text) {
                    _this.content = text.jquery ? text.clone() : text;
                }
                if(_this.options.onContent) {
                    var newText = _this.options.onContent.call(_this, _this.content);
                    if(typeof newText !== 'undefined') _this.content = newText;
                }
                if(text)
                {
                    if(_this.content.jquery)
                        _this.window.append(_this.content);
                    else
                        _this.window.html(_this.content);
                    if(_this.options.onInject)
                        _this.options.onInject.call(_this);
                }
                _this.window.removeClass('loading').css('height', _this.options.height);
                _this._positionWindow();
            };

            if(this.options.html)
                return loadSuccess(this.options.html);

            else if(this.options.url)
                return this.xhr = $.ajax({
                    url: this.options.url,
                    data: this.options.data,
                    type: this.options.type,
                    cache: !!this.options.cache,
                    dataType: 'text',
                    cache: false,
                    success: loadSuccess,
                    error: function(jqXHR, textStatus, errorThrown) {
                        if(this.options.onError) this.options.onError(jqXHR, textStatus, errorThrown);
                    }
                });
        },

        /**
         * Makes the window visible and active
         *
         * @param options
         * @private
         */
        _showWindow: function()
        {
            $('body').addClass('popover-visible').addClass(this.options.bodyClass);

            Popover.wrapper.css('visibility', 'visible');
            
            if(typeof window.orientation !== 'undefined')
                Popover.wrapper.css('height', $(document).height());

            Popover.queue = _.without(Popover.queue, this);
            Popover.queue.push(this);

            if(Popover.queue.length > 1)
                for(var i = 0; i < Popover.queue.length - 1; i++)
                    Popover.inactive.append(Popover.queue[i].window);

            this.window.css({
                width: this.options.width,
                height: typeof this.options.height != 'undefined' ? this.options.height : 'auto'
            });

            Popover.active.append(this.window);

            this._positionWindow();
            this.window.css('visibility', 'visible').removeClass('loading');

            if(this.options.onShow) this.options.onShow.call(this);
        },

        /**
         * Sets the position of the popover in the center of the window
         * @private
         */
        _positionWindow: function()
        {
            this.window.css({
                top: Math.max($(window).scrollTop() + 50, $(window).scrollTop() + $(window).height()/2 - (this.window.outerHeight() / 2)),
                'margin-left': -(this.window.outerWidth() / 2)
            });
        },


        /**
         * Close the popover. The popover is removed from the DOM but if shown again, will retain any modified state.
         * @returns {boolean}
         */
        close: function() {

            var _this = this;

            Popover.queue = _.without(Popover.queue, this);

            if(Popover.queue.length == 0)
            {
                Popover.wrapper.animate({ opacity: 0 }, 'fast', function() {
                    _this.window.detach();
                    Popover.wrapper.css({ opacity: 1, visibility: 'hidden' });
                });
                $('body').removeClass('popover-visible').removeClass(_this.options.bodyClass);
            }
            else
            {
                this.window.detach();
                for(var i = 0; i < Popover.queue.length; i++)
                    if(i < Popover.queue.length - 1) Popover.inactive.append(Popover.queue[i].window);
                    else Popover.active.append(Popover.queue[i].window);
            }

            return false;
        },

        /**
         * Sets the width of the popover
         * @param width
         */
        setWidth: function(width) {
            this.window.css({
                width: width
            });
            this.window.css({
                'margin-left': -(this.window.outerWidth() / 2)
            });
        },

        /**
         * Indicates whether the popover is visible
         * @returns Boolean
         */
        isShowing: function() {
            return this.window.is(':visible');
        },

        /**
         * Indicates whether the popover is active (the top-most popover)
         * @returns {boolean}
         */
        isActive: function() {
            return _.last(Popover.queue) === this;
        },

        /**
         * Finds an element inside this popover using the given CSS selector
         * @param selector String
         * @returns Object
         */
        find: function(selector) {
            return this.window.find(selector);
        }
    });

})();


$(function() {

    Popover.active = $('<div class="active"></div>').css({
        'z-index': 3,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%'
    });

    Popover.overlay = $('<div class="overlay"></div>').css({
        'z-index': 2,
        background: '#000',
        opacity: 0.5,
        position: typeof window.orientation !== 'undefined' ? 'absolute' : 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    });

    Popover.inactive = $('<div class="inactive"></div>').css({
        'z-index': 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%'
    });

    Popover.wrapper = $('<div id="popovers"></div>').css({
        'z-index': 1000,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: typeof window.orientation !== 'undefined' ? $(document).height() : '100%',
        visibility: 'hidden'
    }).append(Popover.active, Popover.overlay, Popover.inactive).appendTo('body');
    
    $(document.body).on('keydown', '.popover :input:first', function (e) {
        if(e.keyCode == 9 && e.shiftKey) {
            $(e.target).closest('.popover').find(':input:last').focus();
            return false;
        }
    });

    $(document.body).on('keydown', '.popover :input:last', function (e) {
        if(e.keyCode == 9 && !e.shiftKey) {
            $(e.target).closest('.popover').find(':input:first').focus();
            return false;
        }
    });

    $(window).on('resize', function () {
        Popover.wrapper.css('height', $(document).height());
    });
});
