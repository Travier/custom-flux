/*
Custom implementation of the Flux Pattern

** https://facebook.github.io/flux/docs/in-depth-overview.html#content **
*/
var Flux = {
  Store:function() {},
  Dispatcher:function() {},
  Types:{}
};

//cast number to float with *decimal spots
_fluxTypesFloat = function(number, decimal) {
  //if decimal wasn't passed then default it to two
  var decimal = (typeof decimal !== 'undefined') ?  decimal : 2;
  var result = new Number(number).toFixed(decimal);

  return parseFloat(result);
}

_fluxTypesInteger = function(number) {
  return parseInt(number);
}

_fluxTypesString = function(string) {
  return String(string);
}

Flux.Types = {
  Float:_fluxTypesFloat,
  Integer:_fluxTypesInteger,
  String:_fluxTypesString
};

/**
 * Dispatcher Constructor
 * An object taken by a Flux store to propgate change according to action types
 * @param {object} reducerTree
 * Reducer Tree EX:
 * {
 *  ADD_USER:function(state, action) {
 *    state.users.push(action);
 *  }
 * }
 */
Flux.Dispatcher = function(reducerTree) {
  var self = this;
  self.struct = reducerTree;

  self.patch = function(route, state, action) {
    for(key in self.struct) {
      if(key == route) {
        var closure = self.struct[key];
        return closure(state, action);
      }
    }

    console.error('Invalid Dispatcher route:' + route);

    return false;
  }

  return self;
}

/**
 * Flux Store Constructor
 *
 * @param {Flux Dispatcher} dispatcher
 * @param {object} stateStruct - object defining store state
 */
Flux.Store = function(dispatcher, stateStruct) {
  var self = this;

  self.state = stateStruct;
  self.dispatcher = dispatcher;
  self.subscribers = [];

  self.getState = function() {
    return self.state;
  }

  self.subscribe = function(closure) {
    self.subscribers.push(closure);
  }

  self.dispatch = function(route, action, cb) {
    if(!route) {
      console.error('No route passed with dispatch action');
      return false;
    }

    self.state = self.dispatcher.patch(route, self.state, action);
    for(var i = 0; i < self.subscribers.length; i++) {
      var subscriber = self.subscribers[i];
      subscriber(self.state, route);
    }

    if(cb) {
      cb();
    }
   }

  return self;
}

_clone = function(object, cloneDeep) {
  var clone = false;
  var cloneDeep = (typeof cloneDeep !== 'undefined') ?  cloneDeep : false;

  if(cloneDeep) {
    clone = jQuery.extend(true, {}, object);
  }else{
    clone = jQuery.extend({}, object);
  }

  return clone;
}

_each = function (array, cb) {
  var len = array.length;

  for(var i = 0; i < len; i++) {
    var row = array[i];
    cb(row);
  }
}

//DOES NOT DEEP CLONE
_assign = function(oldState, map) {
  var newState = _extend({}, oldState)
  //var newState = jQuery.extend(true, {}, oldState);

  for(var key in map) {
    newState[key] = map[key];
  }

  return newState;
}

_reduce = function(array, reducer) {
  var results = [];
  var len = array.length;

  for(var i = 0; i < len; i++) {
    var row = array[i];
    var result = reducer(row);
    if(result) {
      results.push(result);
    }
  }

  return results;
}

_extend = function(){
  for(var i=1; i<arguments.length; i++)
      for(var key in arguments[i])
          if(arguments[i].hasOwnProperty(key))
              arguments[0][key] = arguments[i][key];
  return arguments[0];
}

