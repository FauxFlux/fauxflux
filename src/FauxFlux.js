import mobx from 'mobx';


class FauxFlux {
  
  constructor(store, actions, options = {}) {
    
    /*
     * Using the awesome Mobx library for our observables
     * https://github.com/mobxjs/mobx (v2.2.1 or greater)
     */
    this.mobx = mobx;


    /* ------------------ Options ------------------*/
    
      // Default to useStrict mode.
      if (options.useStrict != false) {
        // In strict mode, MobX will throw an exception on any attempt to modify state outside a MobX action.
        this.mobx.useStrict(true);
      }

      if (process.env.NODE_ENV !== 'production' && options.debug) {
        // Cool gist for logging mobx actions - https://gist.github.com/mmazzarolo/8d321f01f749d3470f0314e773114a95
        
        /* --- BEGIN DEV DEBUGGING ------------*/
        
        const DEFAULT_STYLE = 'color: #006d92; font-weight:bold;'

        // Just call this function after MobX initialization
        // As argument you can pass an object with:
        // - collapsed: true   -> shows the log collapsed
        // - style             -> the style applied to the action description
        const startLogging = ({ collapsed, style } = {}) => {
          this.mobx.spy(event => {
            if (event.type === 'action') {
              if (collapsed) {
                console.groupCollapsed(`Action @ ${formatTime(new Date())} ${event.name}`)
              } else {
                console.group(`Action @ ${formatTime(new Date())} ${event.name}`)
              }
              console.log('%cType: ', style || DEFAULT_STYLE, event.type)
              console.log('%cName: ', style || DEFAULT_STYLE, event.name)
              console.log('%cTarget: ', style || DEFAULT_STYLE, event.target)
              console.log('%cArguments: ', style || DEFAULT_STYLE, event.arguments)
              console.groupEnd()
            }
          })
        }

        // Utilities
        const repeat = (str, times) => (new Array(times + 1)).join(str)
        const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num
        const formatTime = (time) => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`


        startLogging({ collapsed: true });

        /* --- END DEV DEBUGGING ------------*/
      }

    /* ------------------ /Options ------------------*/


    /* ------------------ Errors ------------------*/
    
      // Make sure that a store and actions are passed in.
      if (process.env.NODE_ENV !== 'production') {
        if (!store) {
          throw new Error('A store object should be passed as the first argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
        }
        if (!Array.isArray(actions)) {
          throw new Error('An array of actions should be passed as the second argument to the FauxFlux instance -- Example: new FauxFlux(store: {}, actions: [])');
        }
      }

    /* ------------------ /Errors ------------------*/


    /* ------------------ Setup ------------------*/

      // Set up the store as a Mobx Observable if it is not one already.
      this.store = ( !this.mobx.isObservable(store) ? this.mobx.observable(store) : store );
      // Get the actions object ready to add actions to in the registerActions method below.
      this.actions = {};
      // Autobind methods
      this.registerActions = this.registerActions.bind(this);
      this.dispatch = this.dispatch.bind(this);
      // Register the actions that are passed in when initilizing.
      this.registerActions(actions);
    
    /* ------------------ /Setup ------------------*/

  }

  registerActions(actions) {
    actions.forEach( ({name, action}) => {
      // Check for multiple actions with the same name being defined.
      if (process.env.NODE_ENV !== 'production') {
        if (this.actions[name]) {
          throw new Error(`The action [${name}], has been created more than once! Please rename one of these actions.`);
        }
      }
      // Set the action as a method on this instance's actions object.
      // Wrap it in a MobX action to allow the action we pass to modify the state.
      this.actions[name] = this.mobx.action(`FauxFlux action - ${name}`, action);
    });
  }

  dispatch(action, payload) {
    // Check to make sure the action we are calling has been registered.
    if (process.env.NODE_ENV !== 'production') {
      if (!this.actions[action]) {
        throw new Error(`The action [${action}], is not a registered action. Please make sure you have spelled the action name correctly and it is in the actions available.`);
      }
    }
    
    return Promise.resolve(this.actions[action]({store: this.store, dispatch: this.dispatch, mobx: this.mobx}, payload));
  }

}



module.exports = FauxFlux;