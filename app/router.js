import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType,
  rootURL:  config.baseURL
});

Router.map(function() {
  this.route('install');
  this.route('searching');
  this.route('options');
  this.route('i18n');
  this.route('keyboard');
});

export default Router;
