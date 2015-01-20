//

var extend = require('util')._extend;

var SAUCELABS_BASE = 'SauceLabs';
var SAUCELABS_PREFIX = 'SL';
/*
module.exports = generateFromRange({
  // platform
  'Windows 7': {
    'chrome': '30..39'
  }
});
*/
function generateFromRange(browserRange){

  return Object
    .keys(browserRange)
    .reduce(function (launchers, platformName) {
      extend(memo,
        Object
          .keys(browserRange[platformName])
          .reduce(function (platformLaunchers, browserName) {

            platformLaunchers[SAUCELABS_PREFIX + '_']
            return platformLaunchers;
          }, {})
      );
      return memo;
    }, {});
/*
  function processLauncherRange(range){
    if(typeof range === 'string'){
      var limits = range.match(/(\d+)..(\d+)/);
      var min = limits[1], max = limits[2];
      var delta = max - min;
      range = Array
        .call(null, {length : delta})
        .map(function (v, i){ return min + i; };
    }

    return range.reduce(function(memo, version){
      memo.version = version;
      return memo;
    }, {
      // default
      base: SAUCELABS_BASE
    });
  }
*/
  function newLauncher(browserName, platformName, version){
    return {
      base: SAUCELABS_BASE,
      browserName: browserName,
      platform: platformName,
      version: version
    };
  }
}

function processLauncherRange(range){
  if(typeof range === 'string'){
    var limits = range.match(/(\d+)..(\d+)/);
    var min = +limits[1], max = +limits[2];
    var delta = max - min;
    range = Array
      .apply(null, {length : delta + 1})
      .map(function (v, i){ return min + i; });
  }

  return range.map(function(version){
    return {
      // default
      base: SAUCELABS_BASE,
      version: version
    };
  });
}

function queueLauncherKey(asKey, subprocess){
 return function processTarget(targets){
  return Object
    .keys(targets)
    .map(function(targetName){
      return subprocess(targets[targetName])
        .map(function(launcher){
          launcher[asKey] = targetName;
          return launcher;
        });
    })
    .reduce(function(a, b){
      // flatten
      return a.concat(b);
    });
  };
}

var processBrowsers = queueLauncherKey('browserName', processLauncherRange);
var processPlatform = queueLauncherKey('platform', processBrowsers);

// The magic spell !!
var geSaLaKaCuLa = generateSauceLabsKarmaCustomLaunshers;

function generateSauceLabsKarmaCustomLaunshers(config){
  return processPlatform(config)
    .reduce(function(memo, launcher){
      var launcherName = [
        SAUCELABS_PREFIX,
        shorty(launcher.platform),
        shorty(launcher.browserName),
        launcher.version
      ].join('_');
      memo[launcherName] = launcher;
      return memo;
    }, {});

  function shorty(str){
    return str.indexOf(' ') === -1 ?
      // capitaliseFirstLetter
      str.charAt(0).toUpperCase() + str.slice(1):
      // abbr
      str.match(/\b(\w)/g).join('').toUpperCase();
  }

}

// geSaLaKaCuLaaaaaaaa :D
var foo = geSaLaKaCuLa({
    'linux': { chrome: '0..1', 'internet explorer': ['9']},
    'Windows 7': { chrome: '30..39' }
  });

console.log(foo);
