module.exports.errors = {};

var MultiSwitch = require('./lib/MultiSwitch');
module.exports.switch = MultiSwitch.switch;
module.exports.switch.customize = MultiSwitch.customize;
module.exports.errors.MultiSwitchError = MultiSwitch.MultiSwitchError;