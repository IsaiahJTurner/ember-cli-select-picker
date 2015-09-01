import Ember from 'ember';
import ChoicesMixin from '../mixins/choices';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

export default Ember.Controller.extend(ChoicesMixin, {
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
