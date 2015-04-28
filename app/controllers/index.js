import Ember from 'ember';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

var IndexController = Ember.Controller.extend({
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
  }.property(),

  listContent: function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street, group: neighborhood()};
      })
      .sortBy('group');
  }.property()
});

export default IndexController;
