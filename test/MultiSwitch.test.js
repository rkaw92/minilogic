var ml = require('../index');
var assert = require('assert');

describe('TableSwitch', function(){
	describe('#switch', function(){
		it('should produce no value when given no cases at all', function(){
			assert.equal(typeof(ml.switch().evaluate()), 'undefined');
		});
		it('should forbid adding an empty case value producer', function(){
			assert.throws(function(){
				ml.switch().case({}, null);
			}, ml.errors.MultiSwitchError);
		});
		it('should correctly resolve a single-case "statement"', function(){
			var mySwitch = ml.switch().case({ a: 1, b: 2 }, function caseA(){
				return 'correct!';
			});
			assert.equal(mySwitch.evaluate({ a: 1, b: 2 }), 'correct!');
		});
		it('should resolve multi-case statements properly', function(){
			var mySwitch = ml.switch().case({ a: 1, b: 2 }, function caseA(){
				return 'incorrect';
			}).case({ a: 3, b: 0 }, function caseB(){
				return 'correct!';
			}).case({ a: 0, b: 0 }, function caseC(){
				return 'another case that will not match the input';
			});
			assert.equal(mySwitch.evaluate({ a: 3, b: 0 }), 'correct!');
		});
		it('should fall back to the default value generator if no case matches', function(){
			var mySwitch = ml.switch().case({ a: 1, b: 2 }, function caseA(){
				return 'should not match';
			}).default(function defaultClause(){
				return 'correct!';
			});
			assert.equal(mySwitch.evaluate({ a: Infinity, b: NaN }), 'correct!');
		});
		it('should not allow registering a non-function as the default value generator', function(){
			assert.throws(function(){
				ml.switch().default('Cat5e');
			}, ml.errors.MultiSwitchError);
		});
		it('should not allow registering a default value generator if one has already been registered', function(){
			assert.throws(function(){
				ml.switch().default(function(){ return 'default'; }).default(function(){ return 'default'; });
			}, ml.errors.MultiSwitchError);
		});
		it('should allow using an external equality predicate for case matching', function(){
			var mySwitch = ml.switch.customize({
				isEqual: function isEqual(a, b){ return a === b; }
			}).switch().case('ok', function caseOK(){
				return true;
			}).case('error', function caseError(){
				return false;
			});
			assert.strictEqual(mySwitch.evaluate('ok'), true);
		});
		it('should accept alternate syntax for switched value passing', function(){
			assert.equal(ml.switch({ a: 1 }).case({ a: null }, function(){
				return 'not ok';
			}).case({ a: 1 }, function(){
				return 'ok';
			}).evaluate(), 'ok');
		});
	});
});