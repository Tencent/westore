// Karma configuration
// Generated on Sun Jan 15 2017 13:33:46 GMT+0800 (中国标准时间)

var cfg  = {

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '',


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['jasmine', 'browserify'],


  // list of files / patterns to load in the browser
  files: [
    'test.js'
  ],


  // list of files to exclude
  exclude: [
  ],


  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    '*.js': [ 'browserify' ]
  },


  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress'],


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG



  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['Chrome'],


  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: false,

  // Concurrency level
  // how many browser should be started simultaneous
  concurrency: Infinity,

  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox']
    }
  }
};

if (process.env.TRAVIS) {
  cfg.customLaunchers = {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox']
    },
    'PhantomJS_custom': {
      base: 'PhantomJS',
      options: {
        windowName: 'my-window',
        settings: {
          webSecurityEnabled: false
        },
      },
      flags: ['--load-images=false'],
      debug: true
    }
  };
  cfg.browsers = [
    "Chrome_travis_ci",
    "Firefox",
    //"IE",
    //"Opera",
    "PhantomJS_custom"
  ];
}

module.exports = function(config) {
  cfg.logLevel = config.LOG_INFO;
  config.set(cfg)
}
