/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    sourcemaps: {
      enabled: false
    },
    fingerprint: {
      customHash: 'dist',
      exclude: ['screen-shot.png'],
      prepend: (EmberApp.env() === 'production' ? 'dist/' : '')
    },
    minifyCSS: {
      enabled: false
    },
    minifyJS: {
      enabled: false
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  app.import('bower_components/chance/chance.js');
  app.import('bower_components/highlightjs/styles/github.css');
  app.import('bower_components/highlightjs/highlight.pack.js');

  var fontTree = new Funnel(
    'bower_components/bootstrap/dist/fonts',
    {destDir: '/fonts'}
  );

  return app.toTree([fontTree]);
};
