/**
 * @file Source code for translate helper.
 * @author Alvaro Juste
 */
var _localeManager = null;

const t = function() {
  return _localeManager.getStringResource.apply(_localeManager, arguments);
};
t.__setLocale = function(obj) {
  _localeManager = obj;
};

module.exports = t;
