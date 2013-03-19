
;(function() {

    Popover.confirm = function(title, message, buttons, options) {
        var p = new Popover();
        p.confirm(title, message, buttons, options);
        return p;
    };

    $.extend(window.Popover.prototype, {

        confirm: function(title, message, buttons, options)
        {
            this.buttons = buttons;
            var confirmOpts = {
                id: 'confirm-'+Math.round(Math.random()*1000),
                className: 'confirm',
                html: '<div class="confirm"><h1>'+title+'</h1>' + '<p>'+message+'</p><div class="buttons"></div></div>',
                modal: true,
                onInject: function() {
                    for(var i in buttons) {
                        if(typeof buttons[i] == 'function')
                            buttons[i] = { click: buttons[i] };
                        var button = $('<button></button>');
                        this.buttons[i].el = button;
                        button.html('<span>'+i+'</span>');
                        if(buttons[i].attr) button.attr(buttons[i].attr);
                        button.addClass('large');
                        if(buttons[i].class) button.addClass(buttons[i].class);
                        var _this = this;
                        if(buttons[i].click) button.click(function() { $(this).data('object').click.call(_this); });
                        button.data('object', buttons[i]);
                        this.find('.buttons').append(button);
                    }
                }
            };
            $.extend(confirmOpts, options);
            this.show(confirmOpts);
            return false;
        },

        confirmButtonLoad: function(name, on)
        {
            this.buttons[name].el.toggleClass('loading', on || typeof on === 'undefined');
            this.confirmButtonDisable(name, on);
        },

        confirmButtonDisable: function(name, disabled)
        {
            if(disabled || typeof disabled === 'undefined') this.buttons[name].el.attr('disabled', 'disabled');
            else this.buttons[name].el.removeAttr('disabled');
        }

    });

})();
