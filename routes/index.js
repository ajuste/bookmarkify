module.exports = function(app) {

  "use strict";

  const _uglify   = require("uglify-js");
  const _extend   = require("lodash").extend;
  const _isString = require("lodash").isString;

  /**
   * @function Sends main as response
   */
  const sendIndex = function* (data) {
    yield this.jaune.responder.page.send("index", {result: data || {}});
  };

  /**
   * @function Processes script
   */
  const createBookmark = function* () {

    const script = this.request.body.script;
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
        failed: !bookmark
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
    }
  };
};
