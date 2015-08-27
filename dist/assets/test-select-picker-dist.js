"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('test-select-picker/acceptance-tests/main', ['exports', 'ember-cli-sri/acceptance-tests/main'], function (exports, main) {

	'use strict';



	exports['default'] = main['default'];

});
define('test-select-picker/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'test-select-picker/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('test-select-picker/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'test-select-picker/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('test-select-picker/components/highlight-code', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    lang: 'nohighlight',
    didInsertElement: function didInsertElement() {
      hljs.highlightBlock(this.$('code').get(0));
    }
  });

});
define('test-select-picker/components/keyboard-select-picker', ['exports', 'ember', 'test-select-picker/components/select-picker', 'ember-keyboard-shortcuts/mixins/component'], function (exports, Ember, SelectPicker, KeyboardShortcutsMixin) {

  'use strict';

  function makeKeyboardAction(fn) {
    return function () {
      if (!this.get('showDropdown')) {
        // ignore keyboard input on components that are not *in focus*
        return true;
      }
      fn.apply(this, arguments);
      return false;
    };
  }

  var KeyboardSelectPickerComponent = SelectPicker['default'].extend(KeyboardShortcutsMixin['default'], {

    layoutName: 'components/select-picker',

    nativeMobile: true,

    activeCursor: null,

    classNames: ['select-picker', 'keyboard-select-picker'],

    previousActiveIndex: 0,

    updateActiveItem: Ember['default'].observer('activeCursor', 'contentList.length', function () {
      var _this = this;

      var previousActiveIndex = this.get('previousActiveIndex');
      var activeIndex = this.get('activeIndex');
      if (Ember['default'].typeOf(activeIndex) !== 'number') {
        return;
      }
      Ember['default'].changeProperties(function () {
        _this.set('contentList.' + previousActiveIndex + '.active', false);
        _this.set('contentList.' + activeIndex + '.active', true);
        _this.set('previousActiveIndex', activeIndex);
      });
    }),

    activeIndex: Ember['default'].computed('activeCursor', 'contentList.length', function () {
      var cursor = this.get('activeCursor');
      if (Ember['default'].isNone(cursor)) {
        return null;
      }
      var len = this.get('contentList.length');
      return (cursor % len + len) % len;
    }),

    activeItem: Ember['default'].computed('activeIndex', 'contentList.[]', function () {
      return this.get('contentList').objectAt(this.get('activeIndex'));
    }),

    keyboardShortcuts: {
      'enter': 'selectActiveItem',
      'up': 'activePrev',
      'down': 'activeNext',
      'shift+tab': 'activePrev',
      'tab': 'activeNext',
      'esc': 'closeDropdown'
    },

    actions: {
      activeNext: makeKeyboardAction(function () {
        if (Ember['default'].isNone(this.get('activeCursor'))) {
          this.set('activeCursor', 0);
        } else {
          this.incrementProperty('activeCursor');
        }
      }),

      activePrev: makeKeyboardAction(function () {
        if (Ember['default'].isNone(this.get('activeCursor'))) {
          this.set('activeCursor', -1);
        } else {
          this.decrementProperty('activeCursor');
        }
      }),

      selectActiveItem: makeKeyboardAction(function () {
        var item = this.get('activeItem');
        if (Ember['default'].isPresent(item)) {
          this.send('selectItem', item);
        }
      })
    }
  });

  exports['default'] = KeyboardSelectPickerComponent;

});
define('test-select-picker/components/list-picker', ['exports', 'ember', 'ember-cli-select-picker/mixins/select-picker'], function (exports, Ember, SelectPickerMixin) {

  'use strict';

  var I18nProps = Ember['default'].I18n && Ember['default'].I18n.TranslateableProperties || {};

  var ListPickerComponent = Ember['default'].Component.extend(SelectPickerMixin['default'], I18nProps, {
    classNames: ['select-picker', 'list-picker'],
    selectAllLabel: 'Select All',
    selectNoneLabel: 'Select None',
    nativeMobile: false
  });

  exports['default'] = ListPickerComponent;

});
define('test-select-picker/components/select-picker', ['exports', 'ember', 'ember-cli-select-picker/mixins/select-picker'], function (exports, Ember, SelectPickerMixin) {

  'use strict';

  var I18nProps = Ember['default'].I18n && Ember['default'].I18n.TranslateableProperties || {};

  var SelectPickerComponent = Ember['default'].Component.extend(SelectPickerMixin['default'], I18nProps, {

    nothingSelectedMessage: 'Nothing Selected',
    summaryMessage: '%@ items selected',
    selectAllLabel: 'All',
    selectNoneLabel: 'None',

    nativeMobile: true,

    classNames: ['select-picker', 'btn-group'],
    buttonClass: 'btn-default',

    badgeEnabled: Ember['default'].computed.and('showBadge', 'multiple'),

    selectionBadge: Ember['default'].computed('selection.length', 'badgeEnabled', function () {
      var enabled = this.get('badgeEnabled');
      var selected = this.get('selection.length');
      return enabled && selected && selected !== 0 ? selected : '';
    }),

    setupDom: Ember['default'].on('didInsertElement', function () {
      $(document).on('click.' + this.get('elementId'), Ember['default'].run.bind(this, this.hideDropdownMenu));
    }),

    hideDropdownMenu: function hideDropdownMenu(evt) {
      if (this.get('keepDropdownOpen')) {
        this.set('keepDropdownOpen', false);
        return;
      }
      if (this.element && !$.contains(this.element, evt.target)) {
        this.send('closeDropdown');
      }
    },

    teardownDom: Ember['default'].on('willDestroyElement', function () {
      $(document).off('.' + this.get('elementId'));
    }),

    actions: {
      showHide: function showHide() {
        this.toggleProperty('showDropdown');
      },
      closeDropdown: function closeDropdown() {
        this.set('showDropdown', false);
      }
    }
  });

  exports['default'] = SelectPickerComponent;

});
define('test-select-picker/controllers/application', ['exports', 'ember', 'test-select-picker/config/environment'], function (exports, Ember, config) {

  'use strict';

  var ApplicationController = Ember['default'].Controller.extend({
    addonVersion: config['default'].APP.addonVersion
  });

  exports['default'] = ApplicationController;

});
define('test-select-picker/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('test-select-picker/controllers/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  var IndexController = Ember['default'].Controller.extend({
    singleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }).property(),

    multipleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      }).sortBy('group');
    }).property(),

    listContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      }).sortBy('group');
    }).property()
  });

  exports['default'] = IndexController;

});
define('test-select-picker/controllers/keyboard', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  var KeyboardController = Ember['default'].Controller.extend({
    singleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }).property(),

    multipleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      }).sortBy('group');
    }).property()
  });

  exports['default'] = KeyboardController;

});
define('test-select-picker/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('test-select-picker/controllers/options', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  exports['default'] = Ember['default'].Controller.extend({
    prepMultipleValue: (function () {
      console.log('hjfvhdfbej');
      var sample = this.get('multipleContent').slice(0, 4);
      this.set('multipleValue', sample);
    }).on('init'),

    singleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }).property(),

    multipleContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      }).sortBy('group');
    }).property(),

    listContent: (function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      }).sortBy('group');
    }).property(),

    actions: {
      sayHello: function sayHello() {
        alert("Hello user!");
      }
    }
  });

});
define('test-select-picker/controllers/searching', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  function popularity() {
    return chance.pick(['Great states', 'Awesome states']);
  }

  function stateList() {
    return (function () {
      return chance.states().map(function (state) {
        return { label: state.name, value: state.name, group: popularity() };
      }).sortBy('group', 'label');
    }).property();
  }

  var SearchingController = Ember['default'].Controller.extend({
    simpleSearchContent: stateList(),
    advancedSearchContent: stateList(),
    listSearchContent: stateList()
  });

  exports['default'] = SearchingController;

});
define('test-select-picker/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'test-select-picker/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('test-select-picker/initializers/export-application-global', ['exports', 'ember', 'test-select-picker/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('test-select-picker/router', ['exports', 'ember', 'test-select-picker/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType,
    rootURL: config['default'].baseURL
  });

  Router.map(function () {
    this.route('install');
    this.route('searching');
    this.route('options');
    this.route('i18n');
    this.route('keyboard');
  });

  exports['default'] = Router;

});
define('test-select-picker/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 8
              },
              "end": {
                "line": 9,
                "column": 52
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Intro");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 6
            },
            "end": {
              "line": 10,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["index"],["class","btn btn-lg"],0,null,["loc",[null,[9,8],[9,64]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 8
              },
              "end": {
                "line": 12,
                "column": 59
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Installing");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 6
            },
            "end": {
              "line": 13,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["install"],["class","btn btn-lg"],0,null,["loc",[null,[12,8],[12,71]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 8
              },
              "end": {
                "line": 15,
                "column": 60
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Searching");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 6
            },
            "end": {
              "line": 16,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["searching"],["class","btn btn-lg"],0,null,["loc",[null,[15,8],[15,72]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 18,
                "column": 8
              },
              "end": {
                "line": 18,
                "column": 56
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Options");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 6
            },
            "end": {
              "line": 19,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["options"],["class","btn btn-lg"],0,null,["loc",[null,[18,8],[18,68]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 8
              },
              "end": {
                "line": 21,
                "column": 66
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Internationalization");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 6
            },
            "end": {
              "line": 22,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["i18n"],["class","btn btn-lg"],0,null,["loc",[null,[21,8],[21,78]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child5 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 24,
                "column": 8
              },
              "end": {
                "line": 24,
                "column": 66
              }
            },
            "moduleName": "test-select-picker/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Keyboard Support");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "test-select-picker/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["keyboard"],["class","btn btn-lg"],0,null,["loc",[null,[24,8],[24,78]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 45,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","jumbotron");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Select Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("An Ember based reinvention of the select picker for Bootstrap 3.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("small");
        var el5 = dom.createTextNode("Version: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","nav nav-pills");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [7]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [5, 0]),1,1);
        morphs[1] = dom.createMorphAt(element2,1,1);
        morphs[2] = dom.createMorphAt(element2,2,2);
        morphs[3] = dom.createMorphAt(element2,3,3);
        morphs[4] = dom.createMorphAt(element2,4,4);
        morphs[5] = dom.createMorphAt(element2,5,5);
        morphs[6] = dom.createMorphAt(element2,6,6);
        morphs[7] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["content","addonVersion",["loc",[null,[5,23],[5,39]]]],
        ["block","link-to",["index"],["tagName","li"],0,null,["loc",[null,[8,6],[10,18]]]],
        ["block","link-to",["install"],["tagName","li"],1,null,["loc",[null,[11,6],[13,18]]]],
        ["block","link-to",["searching"],["tagName","li"],2,null,["loc",[null,[14,6],[16,18]]]],
        ["block","link-to",["options"],["tagName","li"],3,null,["loc",[null,[17,6],[19,18]]]],
        ["block","link-to",["i18n"],["tagName","li"],4,null,["loc",[null,[20,6],[22,18]]]],
        ["block","link-to",["keyboard"],["tagName","li"],5,null,["loc",[null,[23,6],[25,18]]]],
        ["content","outlet",["loc",[null,[30,2],[30,12]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  }()));

});
define('test-select-picker/templates/components/-native-select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          dom.setAttribute(el1,"value","");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["content","promptMessage",["loc",[null,[6,21],[6,38]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.8",
              "loc": {
                "source": null,
                "start": {
                  "line": 11,
                  "column": 8
                },
                "end": {
                  "line": 13,
                  "column": 8
                }
              },
              "moduleName": "test-select-picker/templates/components/-native-select.hbs"
            },
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("option");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1]);
              var morphs = new Array(3);
              morphs[0] = dom.createAttrMorph(element1, 'value');
              morphs[1] = dom.createAttrMorph(element1, 'selected');
              morphs[2] = dom.createMorphAt(element1,0,0);
              return morphs;
            },
            statements: [
              ["attribute","value",["get","item.value",["loc",[null,[12,26],[12,36]]]]],
              ["attribute","selected",["get","item.selected",["loc",[null,[12,50],[12,63]]]]],
              ["content","item.label",["loc",[null,[12,66],[12,80]]]]
            ],
            locals: ["item"],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 4
              },
              "end": {
                "line": 15,
                "column": 4
              }
            },
            "moduleName": "test-select-picker/templates/components/-native-select.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("optgroup");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element2, 'label');
            morphs[1] = dom.createMorphAt(element2,1,1);
            return morphs;
          },
          statements: [
            ["attribute","label",["get","group.name",["loc",[null,[10,24],[10,34]]]]],
            ["block","each",[["get","group.items",["loc",[null,[11,16],[11,27]]]]],[],0,null,["loc",[null,[11,8],[13,17]]]]
          ],
          locals: ["group"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 2
            },
            "end": {
              "line": 16,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","each",[["get","nestedGroupContentList",["loc",[null,[9,12],[9,34]]]]],[],0,null,["loc",[null,[9,4],[15,13]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 4
              },
              "end": {
                "line": 19,
                "column": 4
              }
            },
            "moduleName": "test-select-picker/templates/components/-native-select.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("option");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createAttrMorph(element0, 'value');
            morphs[1] = dom.createAttrMorph(element0, 'selected');
            morphs[2] = dom.createMorphAt(element0,0,0);
            return morphs;
          },
          statements: [
            ["attribute","value",["get","item.value",["loc",[null,[18,22],[18,32]]]]],
            ["attribute","selected",["get","item.selected",["loc",[null,[18,46],[18,59]]]]],
            ["content","item.label",["loc",[null,[18,62],[18,76]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 2
            },
            "end": {
              "line": 20,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","each",[["get","contentList",["loc",[null,[17,12],[17,23]]]]],[],0,null,["loc",[null,[17,4],[19,13]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/components/-native-select.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("select");
        dom.setAttribute(el1,"class","native-select form-control");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element3, 'title');
        morphs[1] = dom.createAttrMorph(element3, 'multiple');
        morphs[2] = dom.createElementMorph(element3);
        morphs[3] = dom.createMorphAt(element3,1,1);
        morphs[4] = dom.createMorphAt(element3,2,2);
        return morphs;
      },
      statements: [
        ["attribute","title",["get","title",["loc",[null,[2,16],[2,21]]]]],
        ["attribute","multiple",["get","multiple",["loc",[null,[3,19],[3,27]]]]],
        ["element","action",["selectByValue"],["on","change"],["loc",[null,[4,8],[4,46]]]],
        ["block","if",[["get","showNativePrompt",["loc",[null,[5,8],[5,24]]]]],[],0,null,["loc",[null,[5,2],[7,9]]]],
        ["block","if",[["get","nestedGroupContentList.firstObject.name",["loc",[null,[8,8],[8,47]]]]],[],1,2,["loc",[null,[8,2],[20,9]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('test-select-picker/templates/components/highlight-code', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/components/highlight-code.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("pre");
        var el2 = dom.createElement("code");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createMorphAt(element0,0,0);
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",[["get","lang",["loc",[null,[1,20],[1,24]]]]]]],
        ["content","yield",["loc",[null,[1,28],[1,37]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('test-select-picker/templates/components/list-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","visible-xs-inline");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element9 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element9,1,1);
          morphs[1] = dom.createMorphAt(element9,3,3);
          return morphs;
        },
        statements: [
          ["content","yield",["loc",[null,[3,4],[3,13]]]],
          ["inline","partial",["components/native-select"],[],["loc",[null,[4,4],[4,42]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 2
            },
            "end": {
              "line": 23,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","input-group");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","input-group-btn");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","button");
          dom.setAttribute(el3,"class","btn btn-default list-picker-clear-filter");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","glyphicon glyphicon-remove");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element7 = dom.childAt(fragment, [1]);
          var element8 = dom.childAt(element7, [3, 1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element7,1,1);
          morphs[1] = dom.createAttrMorph(element8, 'disabled');
          morphs[2] = dom.createElementMorph(element8);
          return morphs;
        },
        statements: [
          ["inline","input",[],["type","text","class","search-filter form-control","value",["subexpr","@mut",[["get","searchFilter",["loc",[null,[13,67],[13,79]]]]],[],[]],"focus","preventClosing"],["loc",[null,[13,6],[13,104]]]],
          ["attribute","disabled",["get","clearSearchDisabled",["loc",[null,[17,27],[17,46]]]]],
          ["element","action",["clearFilter"],[],["loc",[null,[18,16],[18,40]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 25,
                "column": 4
              },
              "end": {
                "line": 30,
                "column": 4
              }
            },
            "moduleName": "test-select-picker/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","btn-group select-all-none");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"aria-label","Select all or none");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element4 = dom.childAt(fragment, [1]);
            var element5 = dom.childAt(element4, [1]);
            var element6 = dom.childAt(element4, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createElementMorph(element5);
            morphs[1] = dom.createMorphAt(element5,0,0);
            morphs[2] = dom.createElementMorph(element6);
            morphs[3] = dom.createMorphAt(element6,0,0);
            return morphs;
          },
          statements: [
            ["element","action",["selectAllNone","unselectedContentList"],[],["loc",[null,[27,54],[27,104]]]],
            ["content","selectAllLabel",["loc",[null,[27,105],[27,123]]]],
            ["element","action",["selectAllNone","selectedContentList"],[],["loc",[null,[28,54],[28,102]]]],
            ["content","selectNoneLabel",["loc",[null,[28,103],[28,122]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 30,
                "column": 4
              },
              "end": {
                "line": 37,
                "column": 4
              }
            },
            "moduleName": "test-select-picker/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"class","btn-group-vertical btn-block");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("span");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1, 1]);
            var element3 = dom.childAt(element2, [3]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element2);
            morphs[1] = dom.createMorphAt(element2,1,1);
            morphs[2] = dom.createAttrMorph(element3, 'class');
            return morphs;
          },
          statements: [
            ["element","action",["toggleSelectAllNone"],[],["loc",[null,[32,54],[32,86]]]],
            ["content","selectAllNoneLabel",["loc",[null,[33,10],[33,32]]]],
            ["attribute","class",["concat",["check-mark glyphicon ",["get","glyphiconClass",["loc",[null,[34,46],[34,60]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 2
            },
            "end": {
              "line": 38,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","splitAllNoneButtons",["loc",[null,[25,10],[25,29]]]]],[],0,1,["loc",[null,[25,4],[37,11]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 40,
                "column": 4
              },
              "end": {
                "line": 40,
                "column": 65
              }
            },
            "moduleName": "test-select-picker/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
            return morphs;
          },
          statements: [
            ["content","group.name",["loc",[null,[40,46],[40,60]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 42,
                "column": 6
              },
              "end": {
                "line": 49,
                "column": 6
              }
            },
            "moduleName": "test-select-picker/templates/components/list-picker.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createElementMorph(element0);
            morphs[2] = dom.createMorphAt(element0,1,1);
            morphs[3] = dom.createAttrMorph(element1, 'class');
            return morphs;
          },
          statements: [
            ["attribute","class",["concat",["btn btn-default ",["subexpr","if",[["get","item.selected",["loc",[null,[45,44],[45,57]]]],"active"],[],["loc",[null,[45,39],[45,68]]]]]]],
            ["element","action",["selectItem",["get","item",["loc",[null,[44,38],[44,42]]]]],[],["loc",[null,[44,16],[44,44]]]],
            ["content","item.label",["loc",[null,[46,10],[46,24]]]],
            ["attribute","class",["concat",["glyphicon glyphicon-ok check-mark ",["subexpr","unless",[["get","item.selected",["loc",[null,[47,66],[47,79]]]],"invisible"],[],["loc",[null,[47,57],[47,93]]]]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 2
            },
            "end": {
              "line": 51,
              "column": 2
            }
          },
          "moduleName": "test-select-picker/templates/components/list-picker.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"role","group");
          dom.setAttribute(el1,"class","btn-group-vertical btn-block list-picker-items-container");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          return morphs;
        },
        statements: [
          ["block","if",[["get","group.name",["loc",[null,[40,10],[40,20]]]]],[],0,null,["loc",[null,[40,4],[40,72]]]],
          ["block","each",[["get","group.items",["loc",[null,[42,14],[42,25]]]]],[],1,null,["loc",[null,[42,6],[49,15]]]]
        ],
        locals: ["group"],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 53,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/components/list-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element10 = dom.childAt(fragment, [2]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createAttrMorph(element10, 'class');
        morphs[2] = dom.createMorphAt(element10,1,1);
        morphs[3] = dom.createMorphAt(element10,3,3);
        morphs[4] = dom.createMorphAt(element10,4,4);
        morphs[5] = dom.createMorphAt(element10,5,5);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","nativeMobile",["loc",[null,[1,6],[1,18]]]]],[],0,null,["loc",[null,[1,0],[6,7]]]],
        ["attribute","class",["concat",["bs-select ",["subexpr","if",[["get","nativeMobile",["loc",[null,[8,27],[8,39]]]],"hidden-xs"],[],["loc",[null,[8,22],[8,53]]]]," ",["subexpr","if",[["get","disabled",["loc",[null,[8,59],[8,67]]]],"disabled"],[],["loc",[null,[8,54],[8,80]]]]]]],
        ["content","yield",["loc",[null,[9,2],[9,11]]]],
        ["block","if",[["get","liveSearch",["loc",[null,[11,8],[11,18]]]]],[],1,null,["loc",[null,[11,2],[23,9]]]],
        ["block","if",[["get","multiple",["loc",[null,[24,8],[24,16]]]]],[],2,null,["loc",[null,[24,2],[38,9]]]],
        ["block","each",[["get","nestedGroupContentList",["loc",[null,[39,10],[39,32]]]]],[],3,null,["loc",[null,[39,2],[51,11]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('test-select-picker/templates/components/select-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","visible-xs-inline");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element8 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element8,1,1);
          morphs[1] = dom.createMorphAt(element8,3,3);
          return morphs;
        },
        statements: [
          ["content","yield",["loc",[null,[3,4],[3,13]]]],
          ["inline","partial",["components/native-select"],[],["loc",[null,[4,4],[4,42]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 4
            },
            "end": {
              "line": 28,
              "column": 4
            }
          },
          "moduleName": "test-select-picker/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["inline","input",[],["type","text","class","search-filter form-control","value",["subexpr","@mut",[["get","searchFilter",["loc",[null,[26,69],[26,81]]]]],[],[]],"focus","preventClosing"],["loc",[null,[26,8],[26,106]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 31,
                "column": 8
              },
              "end": {
                "line": 36,
                "column": 8
              }
            },
            "moduleName": "test-select-picker/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","btn-group select-all-none btn-block");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"aria-label","Select all or none");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default btn-xs");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default btn-xs");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element5 = dom.childAt(fragment, [1]);
            var element6 = dom.childAt(element5, [1]);
            var element7 = dom.childAt(element5, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createElementMorph(element6);
            morphs[1] = dom.createMorphAt(element6,0,0);
            morphs[2] = dom.createElementMorph(element7);
            morphs[3] = dom.createMorphAt(element7,0,0);
            return morphs;
          },
          statements: [
            ["element","action",["selectAllNone","unselectedContentList"],[],["loc",[null,[33,65],[33,115]]]],
            ["content","selectAllLabel",["loc",[null,[33,116],[33,134]]]],
            ["element","action",["selectAllNone","selectedContentList"],[],["loc",[null,[34,65],[34,113]]]],
            ["content","selectNoneLabel",["loc",[null,[34,114],[34,133]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 36,
                "column": 8
              },
              "end": {
                "line": 41,
                "column": 8
              }
            },
            "moduleName": "test-select-picker/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn btn-default btn-xs btn-block");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var element4 = dom.childAt(element3, [3]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element3);
            morphs[1] = dom.createMorphAt(element3,1,1);
            morphs[2] = dom.createAttrMorph(element4, 'class');
            return morphs;
          },
          statements: [
            ["element","action",["toggleSelectAllNone"],[],["loc",[null,[37,73],[37,105]]]],
            ["content","selectAllNoneLabel",["loc",[null,[38,12],[38,34]]]],
            ["attribute","class",["concat",["check-mark glyphicon ",["get","glyphiconClass",["loc",[null,[39,48],[39,62]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 4
            },
            "end": {
              "line": 43,
              "column": 4
            }
          },
          "moduleName": "test-select-picker/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","if",[["get","splitAllNoneButtons",["loc",[null,[31,14],[31,33]]]]],[],0,1,["loc",[null,[31,8],[41,15]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 45,
                "column": 6
              },
              "end": {
                "line": 45,
                "column": 92
              }
            },
            "moduleName": "test-select-picker/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","divider");
            dom.setAttribute(el1,"role","presentation");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 46,
                "column": 6
              },
              "end": {
                "line": 46,
                "column": 91
              }
            },
            "moduleName": "test-select-picker/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","dropdown-header");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
            return morphs;
          },
          statements: [
            ["content","group.name",["loc",[null,[46,72],[46,86]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child2 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 47,
                "column": 6
              },
              "end": {
                "line": 54,
                "column": 6
              }
            },
            "moduleName": "test-select-picker/templates/components/select-picker.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2,"role","menuitem");
            dom.setAttribute(el2,"tabindex","-1");
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("span");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            var element2 = dom.childAt(element1, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createElementMorph(element1);
            morphs[2] = dom.createMorphAt(element1,1,1);
            morphs[3] = dom.createAttrMorph(element2, 'class');
            return morphs;
          },
          statements: [
            ["attribute","class",["concat",[["subexpr","if",[["get","item.active",["loc",[null,[48,44],[48,55]]]],"active"],[],["loc",[null,[48,39],[48,66]]]]," ",["subexpr","if",[["get","item.selected",["loc",[null,[48,72],[48,85]]]],"selected"],[],["loc",[null,[48,67],[48,98]]]]]]],
            ["element","action",["selectItem",["get","item",["loc",[null,[49,65],[49,69]]]]],[],["loc",[null,[49,43],[49,71]]]],
            ["content","item.label",["loc",[null,[50,12],[50,26]]]],
            ["attribute","class",["concat",["glyphicon glyphicon-ok check-mark ",["subexpr","if",[["get","item.selected",["loc",[null,[51,64],[51,77]]]],"","hidden"],[],["loc",[null,[51,59],[51,91]]]]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 44,
              "column": 4
            },
            "end": {
              "line": 55,
              "column": 4
            }
          },
          "moduleName": "test-select-picker/templates/components/select-picker.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
          morphs[2] = dom.createMorphAt(fragment,5,5,contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","unless",[["get","group.items.firstObject.first",["loc",[null,[45,16],[45,45]]]]],[],0,null,["loc",[null,[45,6],[45,103]]]],
          ["block","if",[["get","group.name",["loc",[null,[46,12],[46,22]]]]],[],1,null,["loc",[null,[46,6],[46,98]]]],
          ["block","each",[["get","group.items",["loc",[null,[47,14],[47,25]]]]],[],2,null,["loc",[null,[47,6],[54,15]]]]
        ],
        locals: ["group"],
        templates: [child0, child1, child2]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 58,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/components/select-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"aria-expanded","true");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-left");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","dropdown-menu");
        dom.setAttribute(el2,"role","menu");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [2]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element11, [3]);
        var element13 = dom.childAt(element9, [3]);
        var morphs = new Array(14);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createAttrMorph(element9, 'class');
        morphs[2] = dom.createAttrMorph(element10, 'class');
        morphs[3] = dom.createAttrMorph(element10, 'id');
        morphs[4] = dom.createAttrMorph(element10, 'disabled');
        morphs[5] = dom.createElementMorph(element10);
        morphs[6] = dom.createMorphAt(element11,1,1);
        morphs[7] = dom.createAttrMorph(element12, 'class');
        morphs[8] = dom.createMorphAt(element12,0,0);
        morphs[9] = dom.createAttrMorph(element13, 'aria-labelledby');
        morphs[10] = dom.createMorphAt(dom.childAt(element13, [1]),1,1);
        morphs[11] = dom.createMorphAt(element13,3,3);
        morphs[12] = dom.createMorphAt(element13,4,4);
        morphs[13] = dom.createMorphAt(element13,5,5);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","nativeMobile",["loc",[null,[1,6],[1,18]]]]],[],0,null,["loc",[null,[1,0],[6,7]]]],
        ["attribute","class",["concat",["bs-select dropdown ",["subexpr","if",[["get","nativeMobile",["loc",[null,[8,36],[8,48]]]],"hidden-xs"],[],["loc",[null,[8,31],[8,62]]]]," ",["subexpr","if",[["get","disabled",["loc",[null,[8,68],[8,76]]]],"disabled"],[],["loc",[null,[8,63],[8,89]]]]," ",["subexpr","if",[["get","showDropdown",["loc",[null,[8,95],[8,107]]]],"open"],[],["loc",[null,[8,90],[8,116]]]]]]],
        ["attribute","class",["concat",["btn dropdown-toggle ",["get","buttonClass",["loc",[null,[11,39],[11,50]]]]]]],
        ["attribute","id",["get","menuButtonId",["loc",[null,[12,15],[12,27]]]]],
        ["attribute","disabled",["get","disabled",["loc",[null,[13,21],[13,29]]]]],
        ["element","action",["showHide"],[],["loc",[null,[10,10],[10,31]]]],
        ["content","selectionSummary",["loc",[null,[16,6],[16,26]]]],
        ["attribute","class",["subexpr","if",[["get","selectionBadge",["loc",[null,[17,23],[17,37]]]],"badge","caret"],[],["loc",[null,[17,18],[17,55]]]]],
        ["content","selectionBadge",["loc",[null,[17,56],[17,74]]]],
        ["attribute","aria-labelledby",["get","menuButtonId",["loc",[null,[20,58],[20,70]]]]],
        ["content","yield",["loc",[null,[22,6],[22,15]]]],
        ["block","if",[["get","liveSearch",["loc",[null,[24,10],[24,20]]]]],[],1,null,["loc",[null,[24,4],[28,11]]]],
        ["block","if",[["get","multiple",["loc",[null,[29,10],[29,18]]]]],[],2,null,["loc",[null,[29,4],[43,11]]]],
        ["block","each",[["get","nestedGroupContentList",["loc",[null,[44,12],[44,34]]]]],[],3,null,["loc",[null,[44,4],[55,13]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('test-select-picker/templates/i18n', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 0
            },
            "end": {
              "line": 30,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/i18n.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleValue\n                multiple=true\n\n                titleTranslation=\"tranlation.key.title\"\n                selectAllTranslation=\"tranlation.key.select_all\"\n                selectNoneTranslation=\"tranlation.key.select_none\"\n                nothingSelectedMessageTranslation=\"tranlation.key.prompt\"\n\n                summaryMessageKey=\"i18n.tranlation.key.summary\"\n\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 0
            },
            "end": {
              "line": 54,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/i18n.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{\n  \"translation\": {\n    \"key: {\n      \"title\": \"translated title used for accessibility\",\n      \"prompt\": \"translated prompt\",\n      \"select_all\": \"Select All\",\n      \"select_none\": \"Select None\",\n      \"summary\": {\n        \"one\": \"You selected ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{item}}\",\n        \"other\": \"You selected ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{count}} items: ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{list}}\"\n      }\n    }\n  }\n}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 74,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/i18n.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("I18n Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("To use i18n support you first need to install the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://www.npmjs.com/package/ember-i18n");
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("ember-i18n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" to your applicaiton project.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-i18n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Template Example");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("JSON Strings Example");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Caveats");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Because translated properties can not have interpolated values the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessage");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" uses ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessageKey");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" instead of ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessageTranslation");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(". It has the following values:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("dl");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("count");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("Number of selected items. If ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("em");
        var el6 = dom.createTextNode("zero");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" then ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("nothingSelectedMessage");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" is used instead.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("item");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("The item selected (first item in the list if multiple items are selected).");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("list");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("The list of selected items comma separated.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4, 3]),1,1);
        return morphs;
      },
      statements: [
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[16,0],[30,19]]]],
        ["block","highlight-code",[],["lang","json"],1,null,["loc",[null,[39,0],[54,19]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('test-select-picker/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 0
            },
            "end": {
              "line": 19,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=singleContent\n                value=singleValue\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 40,
              "column": 0
            },
            "end": {
              "line": 47,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleValue\n                multiple=true\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 69,
              "column": 0
            },
            "end": {
              "line": 76,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{list-picker content=listContent\n              selection=listValue\n              multiple=\"true\"\n              optionGroupPath=\"group\"\n              optionLabelPath=\"content.label\"\n              optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 81,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Selection");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Multiple Selections");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("List Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1]);
        var element1 = dom.childAt(fragment, [2, 3, 1]);
        var element2 = dom.childAt(fragment, [4, 3, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","singleContent",["loc",[null,[8,32],[8,45]]]]],[],[]],"value",["subexpr","@mut",[["get","singleValue",["loc",[null,[9,30],[9,41]]]]],[],[]],"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[8,8],[11,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[14,0],[19,19]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[32,32],[32,47]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[33,34],[33,47]]]]],[],[]],"multiple",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[32,8],[37,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[40,0],[47,19]]]],
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","listContent",["loc",[null,[61,30],[61,41]]]]],[],[]],"selection",["subexpr","@mut",[["get","listValue",["loc",[null,[62,32],[62,41]]]]],[],[]],"multiple","true","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[61,8],[66,55]]]],
        ["block","highlight-code",[],["lang","handlebars"],2,null,["loc",[null,[69,0],[76,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('test-select-picker/templates/install', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/install.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Installing");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("This is an ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","");
        var el5 = dom.createTextNode("Ember CLI Addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" and can be installed through the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("ember");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" command.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-cli-select-picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Contributing");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Contributions are welcome. All source code is managed through ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/");
        var el5 = dom.createTextNode("GitHub");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(".");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/sukima/ember-cli-select-picker/");
        dom.setAttribute(el4,"class","btn btn-primary btn-lg active");
        var el5 = dom.createTextNode("\n        View source on GitHub\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('test-select-picker/templates/keyboard', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 50,
              "column": 0
            },
            "end": {
              "line": 55,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/keyboard.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{keyboard-select-picker content=singleContent\n                         value=singleValue\n                         optionLabelPath=\"content.label\"\n                         optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 76,
              "column": 0
            },
            "end": {
              "line": 83,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/keyboard.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{keyboard-select-picker content=multipleContent\n                         selection=multipleValue\n                         multiple=true\n                         optionGroupPath=\"group\"\n                         optionLabelPath=\"content.label\"\n                         optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 88,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/keyboard.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Keyboard Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("To use keyboard support you first need to install the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://www.npmjs.com/package/ember-keyboard-shortcuts");
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("ember-keyboard-shortcuts");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" to your applicaiton project.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-keyboard-shortcuts");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        dom.setAttribute(el2,"class","table table-condensed");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Key");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Action");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Esc");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Close the dropdown list");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Enter");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Select/Unselect item the cursor is on");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Down");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" or ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Tab");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Move cursor to ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("next");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" item");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Up");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" or ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Shift");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Tab");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Move cursor to ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("previous");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" item");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Selection");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Multiple Selections");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 3, 1]);
        var element1 = dom.childAt(fragment, [4, 3, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","keyboard-select-picker",[],["content",["subexpr","@mut",[["get","singleContent",["loc",[null,[44,41],[44,54]]]]],[],[]],"value",["subexpr","@mut",[["get","singleValue",["loc",[null,[45,39],[45,50]]]]],[],[]],"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[44,8],[47,66]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[50,0],[55,19]]]],
        ["inline","keyboard-select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[68,41],[68,56]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[69,43],[69,56]]]]],[],[]],"multiple",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[68,8],[73,66]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[76,0],[83,19]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('test-select-picker/templates/options', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 0
            },
            "end": {
              "line": 25,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleValue\n                multiple=true\n                showBadge=true\n                summaryMessage=\"Multiple items selected\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 47,
              "column": 0
            },
            "end": {
              "line": 54,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleValue\n                multiple=true\n                nativeMobile=false\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 68,
              "column": 8
            },
            "end": {
              "line": 77,
              "column": 8
            }
          },
          "moduleName": "test-select-picker/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-info clearfix");
          var el2 = dom.createTextNode("\n            Hello! Try this: ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-sm btn-primary");
          var el3 = dom.createTextNode("button");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["sayHello"],[],["loc",[null,[75,68],[75,89]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 80,
              "column": 0
            },
            "end": {
              "line": 91,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{#select-picker content=multipleContent\n                 selection=multipleValue\n                 multiple=true\n                 summaryMessage=\"Example content inside\"\n                 optionLabelPath=\"content.label\"\n                 optionValuePath=\"content.value\"}}\n  <div class=\"alert alert-info\">\n    Hello! Try this <button ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{action \"sayHello\"}}>button</button>\n  </div>\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{/select-picker}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 96,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/options.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Badges");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Mobile Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("By default the native select widget is used for small screens (mobile) If you want the Bootstrap styled picker on mobile devices then you need to set ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("nativeMobile");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" to ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("em");
        var el5 = dom.createTextNode("false");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(".");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Custom content");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("You can add your own custom content to the top of the drop down by using Ember's block syntax.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0, 3, 1]);
        var element2 = dom.childAt(fragment, [2, 3, 3]);
        var element3 = dom.childAt(fragment, [4, 3, 3]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[8,32],[8,47]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[9,34],[9,47]]]]],[],[]],"multiple",true,"showBadge",true,"summaryMessage","Multiple items selected","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[8,8],[14,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[17,0],[25,19]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[39,32],[39,47]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[40,34],[40,47]]]]],[],[]],"multiple",true,"nativeMobile",false,"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[39,8],[44,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[47,0],[54,19]]]],
        ["block","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[68,33],[68,48]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[69,35],[69,48]]]]],[],[]],"multiple",true,"summaryMessage","Example content inside","optionLabelPath","content.label","optionValuePath","content.value"],2,null,["loc",[null,[68,8],[77,26]]]],
        ["block","highlight-code",[],["lang","handlebars"],3,null,["loc",[null,[80,0],[91,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('test-select-picker/templates/searching', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 0
            },
            "end": {
              "line": 25,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=simpleSearchContent\n                selection=simpleSearchValue\n                multiple=true\n                liveSearch=true\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 47,
              "column": 0
            },
            "end": {
              "line": 55,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=advancedSearchContent\n                selection=advancedSearchValue\n                multiple=true\n                liveSearch=\"advanced\"\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 77,
              "column": 0
            },
            "end": {
              "line": 85,
              "column": 0
            }
          },
          "moduleName": "test-select-picker/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{list-picker content=advancedSearchContent\n              selection=listSearchValue\n              multiple=true\n              liveSearch=\"advanced\"\n              optionGroupPath=\"group\"\n              optionLabelPath=\"content.label\"\n              optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 90,
            "column": 0
          }
        },
        "moduleName": "test-select-picker/templates/searching.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Search");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Advanced Search");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("List Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3, 1]);
        var element1 = dom.childAt(fragment, [2, 3, 1]);
        var element2 = dom.childAt(fragment, [4, 3, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        return morphs;
      },
      statements: [
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","simpleSearchContent",["loc",[null,[8,32],[8,51]]]]],[],[]],"selection",["subexpr","@mut",[["get","simpleSearchValue",["loc",[null,[9,34],[9,51]]]]],[],[]],"multiple",true,"liveSearch",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[8,8],[14,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[17,0],[25,19]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","advancedSearchContent",["loc",[null,[38,32],[38,53]]]]],[],[]],"selection",["subexpr","@mut",[["get","advancedSearchValue",["loc",[null,[39,34],[39,53]]]]],[],[]],"multiple",true,"liveSearch","advanced","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[38,8],[44,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[47,0],[55,19]]]],
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","listSearchContent",["loc",[null,[68,30],[68,47]]]]],[],[]],"selection",["subexpr","@mut",[["get","listSearchValue",["loc",[null,[69,32],[69,47]]]]],[],[]],"multiple",true,"liveSearch","advanced","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[68,8],[74,55]]]],
        ["block","highlight-code",[],["lang","handlebars"],2,null,["loc",[null,[77,0],[85,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('test-select-picker/config/environment', ['ember'], function(Ember) {
  var prefix = 'test-select-picker';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("test-select-picker/tests/test-helper");
} else {
  require("test-select-picker/app")["default"].create({"addonVersion":"2.1.0","name":"test-select-picker","version":"0.0.0+e97c749a"});
}

/* jshint ignore:end */
