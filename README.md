popover.js
==========

popover.js is a JavaScript popup/lightbox utility that allows loading any content into an un-styled popup window.

popover.js provides the basic styles to position the popup and display a dark transparent overlay to draw focus away from the page beneath.  Any other styles are left to you.

Content can be loaded with AJAX, plain text/html strings, or using existing DOM nodes.  Multiple popops can be visible at one time, with only one appearing in focus above the overlay.

**This utility requires [jQuery](http://jquery.com).**


Usage
-----

Be sure to include `popover.js` on your HTML page.  It must be included *after* jQuery has been loaded:

	<script type="text/javascript" src="/javascript/jquery.js"></script>
	<script type="text/javascript" src="/javascript/popover.js"></script>

### Creating & showing a popover

The simplest way to show a popover is with the `Popover.show` method.  This method takes a settings object (described in detail below) and returns an instance of the Popover object (which you can use to close or reopen the popup later).

A simple example of this would be something like the following:

	// Create and show the popover
    var myPopover = Popover.show({
    	html: 'The popover content',
    	width: 400
	});

`Popover.show` will create and show the popover simultaneously. If you wish to create the popover object but not yet make it visible, simply use the `Popover` constructor:

	// Create the popover but do not show it yet
    var myPopover = new Popover({
    	html: 'The popover content',
    	width: 400
	});

The properties object is described in detail below.


### Closing a popover

Popovers do not contain any boilerplate HTML, so there is no "close" button or other mechanism built in for users to close the popover. So, you will have to close the popup using JavaScript when a user clicks a link or button (or any other type of interaction).

You can use the popover object you created previously:

	// Close the specified popover
	myPopover.close();
	
Or, you can use the static `Popover.close()` method to close the currently active popover:

	// Close the currently active popover
	Popover.close();
	
If it's easy enough to obtain a reference to a DOM element inside the popup (such as on a click event), you can also pass it to the static `Popover.close` method and it will close the popover containing that element:

	// Close the popover containing "this" DOM element
	Popover.close(this);
	

### Reopening a popover

You can reopen a popover that had previously been closed. Any content previously loaded, modified, or interacted with by a user (such as filling out form fields) will be retained.  Also, any events attached to DOM elements will also be retained.

To reopen a popover, call the popover object's `show` method:

	// Reopen an existing popup
	myPopover.show();


### Multiple popovers

You can create and show more than one popover at a time. The top-most popover is referred to as the "active" popover, and displays *above* the gray transparent overlay.

`show()`ing a popover places it on the top of the stack (whether it's the first time it is being shown or a subsequent reopening).  All other popups currently visible remain visible but are placed beneath the gray overlay.

If you close the active (top-most) popover, the next popover in the stack will automatically become active. Closing the last popover will cause the gray overlay to fade away.



Different Content Types
-----------------------

You can show content using a just string, DOM content, or via an AJAX call.


### String content

If you want to show content contained in a string variable (or literal), simply use the `html` parameter in the settings object that you pass to the constructor:

	var myHtmlContent = 'This is the content.';
	var myPopover = new Popover({
		html: myHtmlContent
	});
	myPopover.show();

### DOM content

DOM content can be loaded by passing jQuery object to the `html` parameter:

	var myContent = $('#myPopoverContent');
	var myPopover = new Popover({
		html: myContent
	});
	myPopover.show();
	

### AJAX content

Loading AJAX content can be done by passing a url to the `url` parameter.  You can also set the type of request (POST, GET, etc.) and the POST data by using the `type` and `data` parameters.

	var myPopover = new Popover({
		url: '/path/to/content',
		type: 'post',
		data: 'var1=foo&var2=bar'
	});
	myPopover.show();
	
`data` can be in any format allowed by [jQuery's ajax method](http://api.jquery.com/jQuery.ajax/).


#### Preloading AJAX content

By default, popover content will be requested as soon as you create the popover object.
To cause the popover content to delay loading until you actually show the popover, pass `false` to the `preload` parameter:

	var myPopover = new Popover({
		url: '/path/to/content',
		preload: false
	});

If the popover is visible while the AJAX content is loading, it will have a "loading" class applied to it.


Settings Object
---------------

The settings object that you pass to the `show()` method can have the following properties:

- `id` - The id to give the popover div (it will be prefixed with "popover-").
  
- `className` - The class to give the popover div.

- `width` - The default width of the popover (default: 400px).

- `height` - The default height of the popover (default: 'auto').

- `html` - The html content to use in the popover (use this *or* the `url` parameter).

- `url` - The url location of the content to load via AJAX (use this *or* the `html` parameter).

- `data` - Optional data to pass as POST data to the AJAX request.

- `type` - Optional AJAX method type ('get' or 'post', default: 'get')

- `preload` - If true, the url will be preloaded upon popover creation. If false, the url will be reloaded when the popover is shown.  

- `onContent` - Called upon successfully loading the Ajax request, before the content is injected into the window. If text is returned from this method, it will replace the original content.

- `onInject` - Called whenever new html content is injected into the window, before it is visible.

- `onShow` - Called after the popover is shown.   
         
- `onError` - Called upon failure to load the Ajax request.
			



Popover API
-----------

### Constructor

- `new Popover(settings)`

  The constructor method creates a new popover object with the provided settings. It does not show the popover, however; use the returned object's `show()` method to show it.
  
### Static methods

- `Popover.show(settings)`

  This method is the equivalent of calling the `Popover` constructor and then calling its `show()` method. It combines them for convenience. 
  
  Returns the Popover object.
  
- `Popover.close([selector])`

  If `selector` is a jQuery selector or a jQuery/DOM object, and the element is contained within a popover window, that containing popover will be closed.
  
  If `selector` is empty, the top-most popover window will be closed.
  
- `Popover.get(selector)`

  Returns the Popover object containing the jQuery selector or jQuery/DOM element.
  

  
### Instance methods

- `.show()`

  Makes the popover active; ie. it will make it visible and bring it to the front of the stack if multiple popovers are showing.

- `.load()`

  Makes the popover active and adds a `loading` class to the popover element. Useful if you want to perform your own AJAX or other long processing event and display a loading indicator to your user.
  
- `.close()`

  Closes the popover window.

- `.setWidth()`

  Sets the width of the popover.  You don't have to call this unless you want to change the width from what you passed into the settings object.

- `.isShowing()`

  Indicates whether this window is visible (it could be in any position in the stack, however).
  
- `.isActive()`

  Indicates whether this window is active (the top-most window in the stack, or the only visible window).

- `.find(selector)`

  Finds and returns a jQuery object of an element within this popover, using the selector provided.

