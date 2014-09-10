module.exports.errors = {};

var MultiSwitch = require('./lib/MultiSwitch');
module.exports.switch = MultiSwitch.switch;
module.exports.errors.MultiSwitchError = MultiSwitch.MultiSwitchError;