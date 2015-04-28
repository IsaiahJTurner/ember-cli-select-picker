import Ember from 'ember';

function popularity() {
  return chance.pick(['Great states', 'Awesome states']);
}

function stateList() {
  return function() {
    return chance.states()
      .map(function(state) {
        return {label: state.name, value: state.name, group: popularity()};
      })
      .sortBy('group', 'label');
  }.property();
}

var SearchingController = Ember.Controller.extend({
  simpleSearchContent:   stateList(),
  advancedSearchContent: stateList(),
  listSearchContent:     stateList()
});

export default SearchingController;
