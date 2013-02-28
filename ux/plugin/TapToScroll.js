/**
 *  @class Ext.ux.plugin.TapToScroll
 *  @author Weston Nielson <wnielson@github>
 *
 *  This is a pathetically simple plugin that makes it easy to add 
 *  functionality like "scroll to top on double-tap of toolbar".
 *
 *  Example usage::
 *
 *  Ext.define("MyApp.view.MyContainer", {
 *      extend: "Ext.Container",
 *
 *      requires: [
 *          'Ext.ux.plugin.TapToScroll'
 *      ],
 *
 *      config: {
 *          items: [{
 *              xtype: 'toolbar',
 *              docked: 'top',
 *              title: 'Toolbar'
 *          }],
 *          plugins: [{
 *              xclass: 'Ext.ux.plugin.TapToScroll'
 *              // config options go here...
 *          }],
 *          scrollable: 'vertical',
 *          html: '<p>Here is a container</p>',
 *          styleHtmlContent: true
 *      }
 *  });
 */

Ext.define('Ext.ux.plugin.TapToScroll', {
    extend: 'Ext.Base',
    alias: 'plugin.taptoscroll',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    /**
     *  @event scroll
     *  @preventable doScroll
     *  Fires whenever a ``tapEvent`` has been detected.
     *
     */

    config: {
        /**
         *  @cfg {String/Function} tapSelector A string defining the child element which
         *  the ``tapEvent`` will be bound to.  This can also be a function that accepts a
         *  single argument (this component to which this plugin is bound) and returns
         *  the element to bind the event to.
         *
         */
        tapSelector: 'toolbar',
        
        /**
         *  @cfg {String/Array} tapEvent The event name to listen for.  This
         *  technically doesn't have to be a tap event and can be any event
         *  supported by @class{Ext.dom.Element}.  Some fun ones to try include:
         *
         *      tap, doubletab, longpress and swipe
         *
         *  For even more fun, you can set this as any array of events to listen for.
         *
         *  Defaults to 'doubletap'.
         *
         */
        tapEvent: 'doubletap',
        
        /**
         *  @cfg {Object} scrollTo An object with ``x`` and ``y`` parameters defining
         *  where to scroll to.  Default to top left (``{x:0, y:0}``).
         *
         */
        scrollTo: {
            x: 0,
            y: 0
        },

        /**
         *  @cfg {Boolean} scrollAnimation Whether or not to scroll with animation.
         *  Defaults to ``true``.
         *
         */
        scrollAnimation: true
    },

    constructor: function(config) {
        this.component = null;
        
        this.initConfig(config);
        
        if (!Ext.isArray(this.getTapEvent())) {
            this.setTapEvent([this.getTapEvent()]);
        }
    },

    init: function(component) {
        var me          = this,
            tapSelector = me.getTapSelector(),
            tapEvent    = me.getTapEvent();

        this.component = component;

        component.addListener('painted', function() {
            var tapElement;

            if (Ext.isFunction(tapSelector)) {
                tapElement = tapSelector.call(component, component);
            } else {
                tapElement = component.down(tapSelector);
            }

            if (tapElement) {
                Ext.each(tapEvent, function(eventName) {
                    tapElement.element.on(eventName, me.handleScroll, me);
                });
            }
        });   
    },

    handleScroll: function() {
        this.fireAction('scroll', [this], 'doScroll');
    },

    doScroll: function() {
        var scrollTo    = this.getScrollTo(),
            animation   = this.getScrollAnimation(),
            scrollable  = this.component.getScrollable(),
            scroller;

        if (!scrollable) {
            // Try to get the scrollable for the active item instead
            activeItem = this.component.getActiveItem();

            if (activeItem && Ext.isFunction(activeItem.getScrollable)) {
                scrollable = activeItem.getScrollable();
            }
        }

        if (scrollable) {
            scroller = scrollable.getScroller();
            scroller.scrollTo(scrollTo.x, scrollTo.y, animation);
        }
    }
});

