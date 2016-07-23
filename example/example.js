import FauxFlux from '../index';
let { patch, elementOpen: eO, elementClose: eC, elementVoid: eV, text: tX } = IncrementalDOM;

const FILTER_ALL = 'all';
const FILTER_ACTIVE = 'active';
const FILTER_COMPLETED = 'completed';
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

// Todo app state.
let store = {
  newTodoText: '',
  todos: [],
  editing: null,
  filter: FILTER_ALL,
  activeTodoCount() {
    return store.todos.reduce( (accum, todo) => {
      return todo.completed ? accum : accum + 1;
    }, 0);
  },
  completedCount() {
    return store.todos.length - store.activeTodoCount;
  }
};
// Todo app actions.
let actions = [
  {
    name: 'hash_has_changed',
    action({store}, payload) {
      let filter = window.location.hash.substr(2);
      if (!filter) { filter = FILTER_ALL; }
      store.filter = filter;
    }
  },
  {
    name: 'update_new_todo_text',
    action({store}, text) {
      store.newTodoText = text;
    }
  },
  {
    name: 'add_new_todo',
    action({store}, payload) {
      let title = store.newTodoText.trim();

      if (title) {
        store.todos.push({ id: uuid(), completed: false, title, editingText: ''});
        store.newTodoText = '';
      }
    }
  },
  {
    name: 'set_edit_id',
    action({store}, id) {
      store.editing = id;
    }
  },
  {
    name: 'toggle_completed',
    action({store}, todoToToggle) {
      todoToToggle.completed = !todoToToggle.completed;
    }
  },
  {
    name: 'toggle_all_completed',
    action({store, mobx}, checked) {
      mobx.transaction(() => {
        store.todos.forEach( (todo) => {
          todo.completed = checked;
        });
      });
    }
  },
  {
    name: 'edit_todo_title',
    action({store}, {todoToEdit, title}) {
      todoToEdit.title = title;
    }
  },
  {
    name: 'edit_todo_editingText',
    action({store}, {todoToEdit, editingText}) {
      todoToEdit.editingText = editingText;
    }
  },
  {
    name: 'delete_todo',
    action({store}, todoToDelete) {
      store.todos.remove(todoToDelete);
    }
  },
  {
    name: 'clear_completed',
    action({store}, payload) {
      store.todos = store.todos.filter( (todo) => !todo.completed );
    }
  }
];
// Create our FauxFlux instance.
let FF = new FauxFlux(store, actions, { debug: true });


////////////////////////// localStorage

// localStorage key
const key = 'todos-app';
// actions used to initilize and set the todos
let localStorageActions = [
  {
    name: 'localStorage_init_todos',
    action({store, mobx}, key) {
      let jsonTodos = localStorage.getItem(key);
      if (jsonTodos) { mobx.extendObservable(store, { todos: JSON.parse(jsonTodos) }); }
    }
  },
  {
    name: 'localStorage_set_todos',
    action({store, mobx}, key) {
      let todos = mobx.toJS(store.todos);
      localStorage.setItem(key, JSON.stringify(todos));
    }
  }
];
// Register our actions so we can call them with dispatch().
FF.registerActions(localStorageActions);
// Make sure to check for todos in the localStorage before autorunning our localStorage_set_todos dispatch function.
FF.dispatch('localStorage_init_todos', key).then(() => {
  // Run the localStorage_set_todos action anytime an observable inside that action changes.
  // In this case the todos array. --- let todos = mobx.toJS(store.todos);
  FF.mobx.autorun(() => FF.dispatch('localStorage_set_todos', key) );
});


// Listen for haschange so we can update our filter.
window.addEventListener('hashchange', () => {
  FF.dispatch('hash_has_changed');
}, false);
// set the filter, which is based off the hash, on the inital render.
FF.dispatch('hash_has_changed');


let headerElement = document.getElementById('header');
// Put our views in mobx.autorun so they will call patch anytime an observable in the autorun function changes.
// Self patching views!!!!
let HeaderView = FF.mobx.autorun(() => {
  let { store, dispatch } = FF;
  new Promise((resolve, reject) => {
    patch(headerElement, () => {
      eO('header');
        eO('h1');tX('todos');eC('h1');
        eV('input', null, null,
          'type', 'text',
          'id', 'newTodoText',
          'value', store.newTodoText,
          'autofocus', '',
          'onkeydown', (e) => { 
            if (e.keyCode == ENTER_KEY) { 
              e.preventDefault();
              dispatch('add_new_todo');
            }
          },
          'oninput', (e) => {
            dispatch('update_new_todo_text', e.target.value) 
          },
          'class', 'new-todo',
          'placeholder', 'What needs to be done?'
        );
      eC('header');
      // Resolve our promise - end of patch.
      resolve();
    });
  }).then(() => {
    // Keep input elements consistent on state change.
    let newTodoText = document.getElementById('newTodoText');
    let start = newTodoText.selectionStart;
    let end = newTodoText.selectionEnd;
    newTodoText.value = store.newTodoText;
    newTodoText.setSelectionRange(start, end);
  });
});


let mainElement = document.getElementById('main');
let MainView = FF.mobx.autorun(() => {
  let { store, dispatch } = FF;
  new Promise((resolve, reject) => {
    patch(mainElement, () => {
      eO('section', null, null, 
        'class', 'main',
        'style' , { display: (store.todos.length ? 'block' : 'none') }
      );
        eV('input', null, null,
          'type', 'checkbox',
          'id', 'toggleAll',
          'class', 'toggle-all',
          'onclick', (e) => { dispatch('toggle_all_completed', e.target.checked); },
          'data-checked', store.activeTodoCount == 0
        );
        // TODO ITEMS
        eO('ul', null, null, 'class', 'todo-list');
          let shownTodos = store.todos.filter( (todo) => {
            switch (store.filter) {
              case FILTER_ACTIVE:
                return !todo.completed;
              case FILTER_COMPLETED:
                return todo.completed;
              default:
                return true;
            }
          });
          shownTodos.forEach((todo) => {
            eO('li', todo.id, null, 'class', todoClassNames(todo));
              eO('div', null, null, 'class', 'view');
                eV('input', null, null,
                  'type', 'checkbox',
                  'class', 'toggle',
                  'onclick', (e) => { dispatch('toggle_completed', todo); },
                  'data-checked', todo.completed
                );
                eO('label', null, null,
                  'ondblclick', (e) => { 
                    dispatch('edit_todo_editingText', {todoToEdit: todo, editingText: todo.title}).then(() => {
                      dispatch('set_edit_id', todo.id).then(() => { 
                        let node = document.getElementById(`edit${todo.id}`);
                        node.focus(); 
                        node.setSelectionRange(node.value.length, node.value.length);
                      });
                    });
                  }
                );
                  tX(todo.title);
                eC('label')
                eV('button', null, null,
                  'class', 'destroy',
                  'onclick', (e) => { e.preventDefault(); dispatch('delete_todo', todo); }
                );
              eC('div');
              eV('input', null, null,
                'type', 'input',
                'data-value', todo.editingText,
                'id', `edit${todo.id}`,
                'class', 'edit',
                'onblur', (e) => { dispatch('set_edit_id', null); },
                'oninput', (e) => { dispatch('edit_todo_editingText', {todoToEdit: todo, editingText: e.target.value}); },
                'onkeydown', (e) => { 
                  // If the escape key is pressed, just exit edit mode.
                  if (e.which === ESCAPE_KEY) {
                    e.preventDefault();
                    dispatch('set_edit_id', null);
                  // If the enter key is pressed ---
                  } else if (e.which === ENTER_KEY) {
                    e.preventDefault();
                    // Delete the todo if no length in the edit title
                    if (!todo.editingText.length) {
                      dispatch('delete_todo', todo);
                    // Otherwise, set the title to the edit title and exit edit mode.
                    } else {
                      dispatch('edit_todo_title', {
                        todoToEdit: todo,
                        title: todo.editingText
                      }).then(() => { 
                        dispatch('set_edit_id', null)
                      });
                    }
                  }
                }
              );
            eC('li');
          });
        eC('ul');
        // END TODO ITEMS
      eC('section');
      // Resolve our promise - end of patch.
      resolve();
    });
  }).then(() => {
    // Keep input elements consistent on state change.
    document.getElementById('toggleAll').checked = (store.activeTodoCount == 0);
    let inputs = document.querySelectorAll('.toggle'), i;
    for (i = 0; i < inputs.length; ++i) {
      inputs[i].checked = ( inputs[i].getAttribute('data-checked') == 'true' ? true : false );
    }
    if (store.editing) {
      let editing = document.getElementById(`edit${store.editing}`);
      let start = editing.selectionStart;
      let end = editing.selectionEnd;
      editing.value = editing.getAttribute('data-value');
      editing.setSelectionRange(start, end);
    }
  });
});


let footerElement = document.getElementById('footer');
let FooterView = FF.mobx.autorun(() => {
  let { store, dispatch } = FF;
  patch(footerElement, () => {
    eO('footer', null, null, 'class', 'footer', 'style', {display: (store.todos.length ? 'block' : 'none')});
      eO('span', null, null, 'class', 'todo-count');
        eO('strong');tX(store.activeTodoCount);eC('strong');
        tX(` item${store.activeTodoCount == 1 ? '' : 's'} left`);
      eC('span');
      eO('ul', null, null, 'class', 'filters');
        eO('li');
          eO('a', null, null, 'href', '#/', 'class', filterIsSelected(FILTER_ALL, store.filter));tX('All');eC('a');
        eC('li');
        eO('li');
          eO('a', null, null, 'href', '#/active', 'class', filterIsSelected(FILTER_ACTIVE, store.filter));tX('Active');eC('a');
        eC('li');
        eO('li');
          eO('a', null, null, 'href', '#/completed', 'class', filterIsSelected(FILTER_COMPLETED, store.filter));tX('Completed');eC('a');
        eC('li');
      eC('ul');
      if (store.completedCount) { 
        eO('button', null, null, 
          'class', 'clear-completed',
          'onclick', (e) => { dispatch('clear_completed'); }
        );
          tX('Clear Completed');
        eC('button');
      }
    eC('footer');
  })
});


////////////////////////// Utility Functions

function uuid () {
  let i, random;
  let uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

function todoClassNames(todo) {
  let classes = [];
  if (todo.completed) { classes.push('completed'); }
  if (store.editing == todo.id) { classes.push('editing'); }
  return classes.join(' ');
}

function filterIsSelected(filter, current) {
  if (filter == current) { return 'selected'; }
  return '';
}