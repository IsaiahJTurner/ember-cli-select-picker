import Ember from 'ember';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

var KeyboardController = Ember.Controller.extend({
  singleContent: function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street};
      });
  }.property(),

  multipleContent: function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street, group: neighborhood()};
      })
      .sortBy('group');
  }.property()
});

export default KeyboardController;
