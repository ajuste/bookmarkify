module.exports = function(app) {

  "use strict";

  // constants
  const FS_CORE_CONFIG = "main";

  // 3rd
  const _uglify        = require("uglify-js");
  const _extend        = require("lodash").extend;
  const _isString      = require("lodash").isString;

  // jaune
  const _fsManager     = app.Fs.Manager;

  // bookmarkify
  const _fsModule      = _fsManager.getModule(FS_CORE_CONFIG);

  /**
   * @function Sends main as response
   */
  const sendIndex = function* (data) {
    yield this.jaune.responder.page.send("index", {result: data || {}});
  };

  /**
   * @function Sends robots.txt as response
   */
  const sendRobots = function* () {
    yield this.jaune.responder.file.send(_fsModule, "/views/robots.txt");
  };

  /**
   * @function Sends sitemap.xml as response
   */
  const sendSitemap = function* () {
    yield this.jaune.responder.file.send(_fsModule, "/views/sitemap.xml");
  };

  /**
   * @function Processes script
   */
  const createBookmark = function* () {

    const script = this.request.body.script;
    const name = this.request.body.name;
    const data   = {};
    var bookmark = null;

    if (_isString(script) && !!script) {

      try {
        bookmark = _uglify.minify(script, {fromString: true}).code;
      }
      catch(err) {
        //TODO: log
      }
      _extend(data, {
        bookmark : ["javascript:", encodeURIComponent(bookmark)].join(""),
        script: !bookmark ? script : null,
        failed: !bookmark,
        name: name || this.jaune.engine().Locale.Manager.getStringResource('pages.index.unnamed_bookmark')
      });
      console.log(JSON.stringify(data))
    }
    yield sendIndex.call(this, data);
  };

  return {
    /**
      * @function Set up routes
      * @param    {Object} config Configuration object
      */
    setupRoutes : function(config) {
      config.route("/") .get(sendIndex)
                        .post(createBookmark);

      config.route("/robots.txt").get(sendRobots);
      config.route("/sitemap.xml").get(sendSitemap);
    }
  };
};
