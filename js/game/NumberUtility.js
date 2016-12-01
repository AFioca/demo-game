function NumberUtility() {

  this.getRandomNumberBetween = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  };
}

var numberUtility = new NumberUtility();

module.exports = numberUtility;
