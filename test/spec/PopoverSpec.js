$(function() {
    describe("Popover with text content", function() {

        var popover;
        var onContentSpy = sinon.spy(),
            onInjectSpy = sinon.spy(),
            onErrorSpy = sinon.spy(),
            onShowSpy = sinon.spy();

        var stringContent = '<p>This is content loaded by a string.</p>';
        var selector = '#popovers .active #popover-string-id.popover.string-id.string-class';

        it("should show text content", function() {

            popover = new Popover({
                id: 'string-id',
                className: 'string-class',
                html: stringContent,
                width: 400,
                height: 200,
                onContent: onContentSpy,
                onInject: onInjectSpy,
                onError: onErrorSpy,
                onShow: onShowSpy
            });

            popover.show();

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).html()).toBe(stringContent);
            expect($(selector).css('width')).toBe('400px');
            expect($(selector).css('height')).toBe('200px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledOnce();
        });

        it("should be removed from page", function() {
            popover._content = $(selector).children()[0];
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "Popover should close", 500);
        });

        it("should retain previous content & properties", function() {

            popover.show();

            expect($(selector).length).toBe(1);

            expect($(selector).children()[0]).toBe(popover._content);

            expect($(selector).css('width')).toBe('400px');
            expect($(selector).css('height')).toBe('200px');
        });


        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledTwice();
        });

        it("should be removed from page", function() {
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "should be closed", 500);
        });
    });

    describe("Popover with DOM content", function() {

        var popover;
        var onContentSpy = sinon.spy(),
            onInjectSpy = sinon.spy(),
            onErrorSpy = sinon.spy(),
            onShowSpy = sinon.spy();

        var domContent = $('#dom-content');
        var selector = '#popovers .active #popover-dom-id.popover.dom-id.dom-class';

        it("should show DOM content", function() {

            popover = new Popover({
                id: 'dom-id',
                className: 'dom-class',
                html: domContent,
                width: 300,
                onContent: onContentSpy,
                onInject: onInjectSpy,
                onError: onErrorSpy,
                onShow: onShowSpy
            });

            popover.show();

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).children()[0]).not.toBe(domContent[0]);
            expect($(selector).html()).toBe( $('<div/>').append(domContent.clone()).html() );
            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('50px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledOnce();
        });

        it("should be removed from page", function() {
            popover._content = $(selector).children()[0];
            $(selector).find('input').val('test');
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "Popover should close", 500);
        });

        it("should retain previous content & properties", function() {

            popover.show();

            expect($(selector).length).toBe(1);

            expect($(selector).children()[0]).toBe(popover._content);
            expect($(selector).find('input').val()).toBe('test');

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('50px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledTwice();
        });

        it("should be removed from page", function() {
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "should be closed", 500);
        });
    });




    var server = sinon.fakeServer.create();
    var ajaxContent = '<p>This is AJAX content.</p>'
    server.respondWith([200, { "Content-type": "text/html" }, ajaxContent]);
    server.respondWith('/error', [404, { "Content-type": "text/html" }, ajaxContent]);

    describe("Popover with preloaded AJAX content; server responds before popover opens", function() {

        var popover;
        var onContentSpy = sinon.spy(),
            onInjectSpy = sinon.spy(),
            onErrorSpy = sinon.spy(),
            onShowSpy = sinon.spy();
        var selector = '#popovers .active #popover-ajax-id.popover.ajax-id.ajax-class';

        it("should show AJAX content", function() {

            server.requests = [];

            popover = new Popover({
                id: 'ajax-id',
                className: 'ajax-class',
                url: '/ajaxtest',
                data: 'var=1',
                type: 'post',
                preload: true,
                width: 300,
                onContent: onContentSpy,
                onInject: onInjectSpy,
                onError: onErrorSpy,
                onShow: onShowSpy
            });

            expect(server.queue.length).toBe(1);
            expect(server.requests[0].status).toBe(0);

            server.respond();

            expect(server.requests[0].status).toBe(200);

            popover.show();

            expect(server.queue.length).toBe(0);

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).hasClass('loading')).toBe(false);
            expect($(selector).html()).toBe(ajaxContent);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledOnce();
        });

        it("should be removed from page", function() {
            popover._content = $(selector).children()[0];
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "Popover should close", 500);
        });

        it("should retain previous content & properties", function() {

            popover.show();

            expect(server.queue.length).toBe(0);

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).children()[0]).toBe(popover._content);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledTwice();
        });

        it("should be removed from page", function() {
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "should be closed", 500);
        });
    });

    describe("Popover with preloaded AJAX content; server responds after popover opens", function() {

        var popover;
        var onContentSpy = sinon.spy(),
            onInjectSpy = sinon.spy(),
            onErrorSpy = sinon.spy(),
            onShowSpy = sinon.spy();
        var selector = '#popovers .active #popover-ajax-id.popover.ajax-id.ajax-class';

        it("should show AJAX content", function() {

            server.requests = [];

            popover = new Popover({
                id: 'ajax-id',
                className: 'ajax-class',
                url: '/ajaxtest',
                data: 'var=1',
                type: 'post',
                preload: true,
                width: 300,
                onContent: onContentSpy,
                onInject: onInjectSpy,
                onError: onErrorSpy,
                onShow: onShowSpy
            });

            expect(server.queue.length).toBe(1);
            expect(server.requests[0].status).toBe(0);

            popover.show();

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).hasClass('loading')).toBe(true);

            server.respond();

            expect(server.requests[0].status).toBe(200);
            expect(server.queue.length).toBe(0);

            expect($(selector).hasClass('loading')).toBe(false);
            expect($(selector).html()).toBe(ajaxContent);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledOnce();
        });

        it("should be removed from page", function() {
            popover._content = $(selector).children()[0];
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "Popover should close", 500);
        });

        it("should retain previous content & properties", function() {

            popover.show();

            expect(server.queue.length).toBe(0);

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);

            expect($(selector).children()[0]).toBe(popover._content);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledTwice();
        });

        it("should be removed from page", function() {
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "should be closed", 500);
        });
    });

    describe("Popover with non-preloaded AJAX content", function() {

        var popover;
        var onContentSpy = sinon.spy(),
            onInjectSpy = sinon.spy(),
            onErrorSpy = sinon.spy(),
            onShowSpy = sinon.spy();
        var selector = '#popovers .active #popover-ajax-id.popover.ajax-id.ajax-class';

        it("should show AJAX content", function() {

            server.requests = [];

            expect(server.queue.length).toBe(0);

            popover = new Popover({
                id: 'ajax-id',
                className: 'ajax-class',
                url: '/ajaxtest',
                data: 'var=1',
                type: 'post',
                preload: false,
                width: 300,
                onContent: onContentSpy,
                onInject: onInjectSpy,
                onError: onErrorSpy,
                onShow: onShowSpy
            });

            expect(server.queue.length).toBe(0);

            popover.show();

            expect(server.queue.length).toBe(1);
            expect(server.requests[0].status).toBe(0);

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);
            expect($(selector).hasClass('loading')).toBe(true);

            server.respond();

            expect(server.requests[0].status).toBe(200);

            expect($(selector).hasClass('loading')).toBe(false);
            expect($(selector).html()).toBe(ajaxContent);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledOnce();
        });

        it("should be removed from page", function() {
            popover._content = $(selector).children()[0];
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "Popover should close", 500);
        });

        it("should retain previous content & properties", function() {

            popover.show();

            expect(server.queue.length).toBe(0);

            expect($(selector).length).toBe(1);
            expect($(selector).is(':visible')).toBe(true);
            expect($(selector).hasClass('loading')).toBe(false);

            expect($(selector).children()[0]).toBe(popover._content);

            expect($(selector).css('width')).toBe('300px');
            expect($(selector).css('height')).toBeLessThan('75px');
        });

        it("should have called correct callbacks", function() {
            expect(onContentSpy).toHaveBeenCalledOnce();
            expect(onInjectSpy).toHaveBeenCalledOnce();
            expect(onErrorSpy).not.toHaveBeenCalled();
            expect(onShowSpy).toHaveBeenCalledTwice();
        });

        it("should be removed from page", function() {
            popover.close();

            waitsFor(function() {
                return $(selector).length == 0;
            }, "should be closed", 500);
        });
    });

});
