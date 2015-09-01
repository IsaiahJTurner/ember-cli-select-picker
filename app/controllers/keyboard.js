import Ember from 'ember';
import ChoicesMixin from '../mixins/choices';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

var KeyboardController = Ember.Controller.extend(ChoicesMixin, {
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
