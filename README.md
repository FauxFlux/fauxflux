# FauxFlux

Faux (made in imitation) Flux. A Flux Like Application Architecture for Building User Interfaces.


## Getting Started

FauxFlux relies on the wonderful MobX JS library - https://github.com/mobxjs/mobx 

```sh
npm install --save fauxflux mobx
```
FauxFlux also relies on Promises - supported in all major browsers besides IE


## Quick Overview In Code

```js

// Object containing all of the application state.
var store = {
  selectedState: 'New York'
};

// Array of functions that can be dispatched to update the state in the store.
var actions = [
  {
    name: 'update_selectedState',
    action: function (ff, payload) {
      // ff.store; - reference to the store.
      // ff.dispatch; - actions can dispatch other actions.
      // ff.mobx; - reference to the MobX library.

      // The ff.store is a MobX observable, so any property on it
      // can be mutated in place, and any watchers attached to the property
      // will be notified!
      ff.store.selectedState = payload;
    }
  }
];

// Object of option flags 
// useStrict - Allow or disallow changes to the state outside of a MobX action.
// debug - console.log out any action called within the application. Useful for tracking a series of state changes.
var options = {
  useStrict: true, // true by default
  debug: true, // false by default and will be ignored if built with production flag for `NODE_ENV`.
};


var FF = new FauxFlux(store, actions, options);


// Add a watcher onto the selectedState property of the store.
// Every time the property changes, this function will be called.
FF.mobx.autorun(function () {
  console.log('selectedState', FF.store.selectedState);
});

// Simulate some sort of async requests.
setTimeout(function () {
  FF.dispatch('update_selectedState', 'Idaho');
}, 1000);

setTimeout(function () {
  FF.dispatch('update_selectedState', 'Utah');
}, 2000);

// Should result in 
// console.log - 'New York'
// 1 second later
// console.log - 'Idaho'
// 1 more second later
// console.log - 'Utah'
```


## Notice

Be warned! This codebase is still under active development so there are no guarantees the api is set in stone. Look for A v1.0.0 release in the near future.


## Demo
Todo MVC implementation using FauxFlux and [Incremental Dom](https://github.com/google/incremental-dom) ( [Demo](https://cdn.rawgit.com/FauxFlux/fauxflux/46ff92d53477f9ce2bbc5bd9e6e3de4d18c50033/example/index.html) ). Much of the code was taken from [Pete Hunt's Todo MVC](http://todomvc.com/examples/react/) React example and modified to use the FauxFlux architecture design. The code for the demo can be viewed here - [example.js](/example/example.js)


## Todos

- [ ] Add documentation describing the architecture.
- [ ] Add tooling for better debugging.