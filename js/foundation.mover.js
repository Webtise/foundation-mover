;(function($, Foundation) {
    'use strict';

    function Mover (element, options) {
        this.$element = element;
        this.options = $.extend({}, Mover.defaults, this.$element.data(), options);
        this.targets = [];

        this._init();

        Foundation.registerPlugin(this, 'Mover');
    }

    Mover.prototype._init = function () {
        this.breakpoints = this._getBreakpoints();
        this.breakpointScopes = this.options.breakpointScopes;
        this.targets = this._getTargets();
        this._checkMQ(Foundation.MediaQuery.current);
        this._events();
    };

    // Updates currently available foundation breakpoints
    Mover.prototype._getBreakpoints = function() {
        return $.map(Foundation.MediaQuery.queries, function(obj) {
            return obj.name;
        });
    };

    // Gets Mover instances target elements
    Mover.prototype._getTargets = function() {
        if(!this.options.hasOwnProperty('moverTargets')) {
            return this;
        }
        return this._validateTargets(this._parseTargets(this.options.moverTargets));
    };

    // Converts 'CSS like' (key : value;) pairs to object
    Mover.prototype._parseTargets = function(targets) {
        var parsedTargets = {};
        // Parse css type 'key:value;' pairs
        $.each(targets.split(';'), function() {
            if (this !== '') {
                var target = this.split(':'),
                    id = target[0].trim(),
                    query = target[1].trim(),
                    breakpoint = query.split(' '),
                    parsedTarget = {};
                // Assign breakpoint size
                parsedTarget.breakpoint = {};
                parsedTarget.breakpoint.size = breakpoint[0].trim();
                // Assign breakpoint scope if declared
                if (breakpoint.length > 1) {
                    parsedTarget.breakpoint.scope = breakpoint[1].trim();
                }
                parsedTargets[id] = parsedTarget;
            }
        });
        return parsedTargets;
    };

    // Checks targets exist in DOM and have valid breakpoint
    Mover.prototype._validateTargets = function(targets) {
        var self = this,
            validTargets = {};
        // Filter out valid targets
        $.each(targets, function(id) {
            var $target = $('#' + id),
                targetExists = $target.length > 0,
                targetBreakpointVaild = self._isValidBreakpoint(this.breakpoint);
            if(targetExists && targetBreakpointVaild) {
                validTargets[id] = this;
            }
        });
        return validTargets;

    };

    // Check breakpoint is valid, returns boolean
    Mover.prototype._isValidBreakpoint = function(breakpoint) {
        if(this._hasValidBreakpointSize(breakpoint) && this._hasValidBreakpointScope(breakpoint)) {
            return true;
        }
        return false;
    };

    // Check breakpoint size is set
    Mover.prototype._hasBreakpointSize = function(breakpoint) {
        return breakpoint.hasOwnProperty('size');
    };

    // Check breakpoint size is valid
    Mover.prototype._hasValidBreakpointSize = function(breakpoint) {
        if(this._hasBreakpointSize(breakpoint) && $.inArray(breakpoint.size, this.breakpoints) >= 0) {
            return true;
        }
        return false;
    };

    // Check breakpoint scope is set
    Mover.prototype._hasBreakpointScope = function(breakpoint) {
        return breakpoint.hasOwnProperty('scope');
    };

    // Check breakpoint scope is valid
    Mover.prototype._hasValidBreakpointScope = function(breakpoint) {
        if(this._hasBreakpointScope(breakpoint) && $.inArray(breakpoint.scope, this.breakpointScopes) >= 0) {
            return true;
        }
        else if(!this._hasBreakpointScope(breakpoint)) {
            return true;
        }
        return false;
    };

    // Check breakpoint to see if the element needs to be moved
    Mover.prototype._checkMQ = function (newSize) {
        var self = this,
            targetsToMove = this._getTargetsToMove(newSize);

        $.each(targetsToMove, function(id) {
            self._moveTarget(id);
        });
    };

    // Returns targets with matching breakpoints
    Mover.prototype._getTargetsToMove = function(breakpoint) {
        var self = this,
            targetsToMove = {};

        $.each(this.targets, function(id) {
            if(self._shouldMove(this, id, breakpoint)) {
                targetsToMove[id] = this;
            }
        });

        return targetsToMove;
    };

    // Check wether target should be moved
    Mover.prototype._shouldMove = function(target, id, breakpoint) {
        // Check target is not already in element
        if(this.$element.find($('#' . id)).length > 0) {
            return false;
        }
        // Check target breakpoint size matches breakpoint
        if(target.breakpoint.size == breakpoint) {
            return true;
        }
        // Check if has scope
        if(this._hasBreakpointScope(target.breakpoint)) {
            // Scope is down and target breakpoint size is not at least breakpoint
            if(target.breakpoint.scope == 'down' && !Foundation.MediaQuery.atLeast(target.breakpoint.size)) {
                return true;
            }
            // Scope is up and target breakpoint size is at least breakpoint
            if(target.breakpoint.scope == 'up' && Foundation.MediaQuery.atLeast(target.breakpoint.size)) {
                return true;
            }
        }
        return false;
    };

    // Move target by ID into $element
    Mover.prototype._moveTarget = function(id) {
        var $target = $('#' +  id);

        this.$element.trigger('before_move.zf.mover', $target);

        $target.detach().appendTo(this.$element);

        this.$element.trigger('after_move.zf.mover', $target);
    };

    // Watch media query changes and check if we need to move the element
    Mover.prototype._events = function () {
        var self = this;

        $(window).on('changed.zf.mediaquery', function (event, newSize, oldSize) {
            self._checkMQ(newSize);
        });
    };

    Mover.defaults = {
        breakpointScopes: ['down', 'up']
    };

    Foundation.plugin(Mover, 'Mover');

})(jQuery, window.Foundation);
