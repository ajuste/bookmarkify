"use strict";

// 3rd
const _defaultsDeep = require("lodash").defaultsDeep;
const _extend       = require("lodash").extend;
const _isObject     = require("lodash").isObject;
const _pick         = require("lodash").pick;
const _join         = require("path").join;

// jaune
const _config       = require("./env");
const _createWeb    = require("jaune-web").create;

// bookmarkify
const _t            = require("./helpers/t");

const _errorListener = function* (err, app, session) {

  if (!err) return;

  console.log(err);
    console.log(err.stack);
/*
  const args   = {message: err};
  const logger = app.jaune.engine().Linkstern.Logging.Logger;

  if (_isObject(err)) {
    _extend(args, _pick(err, "module", "operation", "description"));
  }
  if (_isObject(session)) {
    _extend(args, _pick(session, "userId"));
  }
  yield logger.logError(args);*/
};


/**
 * @function Sets up the routes
 * @param    {Object} app The application
 */
const _setupRoutes = function(app, engine) {
  require("./routes/index")(engine).setupRoutes(app);
};

const _extendNamespace = function(ns) {


/*  _extend(logging, {
    Logger: new logging.DatabaseLogging()
  });*/
  _defaultsDeep(ns, {
    Linkstern : {
//      Logging : logging
    }
  });
};

_defaultsDeep(_config, {
  jaune : {
    error: {
      listener: _errorListener
    },
    init : {
      webRoutes       : _setupRoutes,
      extendNamespace : _extendNamespace
    },
    http : {
      web : {
        port: process.env.PORT || 3000,
        favicon : _join(__dirname, "./root/public-resources/favicon.ico")
      }
    }
  }
});
const _web = _createWeb(_config);

// initialize helpers
_t.__setLocale(_web.Locale.Manager)
