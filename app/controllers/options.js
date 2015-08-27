import Ember from 'ember';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

export default Ember.Controller.extend({
  prepMultipleValue: function() {
    console.log('hjfvhdfbej');
    var sample = this.get('multipleContent').slice(0, 4);
    this.set('multipleValue', sample);
  }.on('init'),

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
  }.property(),

  actions: {
    sayHello() {
      alert("Hello user!");
    }
  }
});
