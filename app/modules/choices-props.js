import Ember from 'ember';

export function setChoicesAction(prop) {
  return function(selection) {
    this.set(prop, Ember.makeArray(selection));
  };
}

export function choicesToString(dependentProp) {
  return function() {
    return this.get(dependentProp).mapBy('value').join(', ');
  }.property(`${dependentProp}.[].value`);
}
