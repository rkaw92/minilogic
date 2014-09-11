function customize(customizationOptions){
	function MultiSwitch(switchedValue){
		var switcher = Object.create(null);
		var cases = [];
		var defaultOutcomeFunction;
		var options = customizationOptions || {};
		
		function MultiCase(caseValue, outcomeFunction){
			this.caseValue = caseValue;
			this.outcomeFunction = outcomeFunction;
		}
		var isEqual = options.isEqual || function isEqual(caseValue, inputValue){
			return Object.keys(caseValue).length === Object.keys(inputValue).length && Object.keys(caseValue).every(function compareValues(caseValueProperty){
				return caseValue[caseValueProperty] === inputValue[caseValueProperty];
			}, this);
		};
		
		switcher.case = function _case(caseValue, outcomeFunction){
			if(typeof(outcomeFunction) !== 'function'){
				throw new MultiSwitchError('Outcome function type incorrect: is `' + typeof(outcomeFunction) + '`, should be `function`', 1);
			}
			cases.push(new MultiCase(caseValue, outcomeFunction));
			return this;
		};
		
		switcher.default = function _default(outcomeFunction){
			if(typeof(outcomeFunction) !== 'function'){
				throw new MultiSwitchError('Outcome function type incorrect: is `' + typeof(outcomeFunction) + '`, should be `function`', 1);
			}
			if(defaultOutcomeFunction){
				throw new MultiSwitchError('The default outcome function has already been registered; can not have two defaults in one `switch`', 2);
			}
			defaultOutcomeFunction = outcomeFunction;
			return this;
		};

		switcher.evaluate = function _evaluate(inputValue){
			if(typeof(inputValue) === 'undefined'){
				inputValue = switchedValue;
			}
			var chosenOutcomeFunction;
			var declaredCases = cases.length;
			var currentCase;
			for(var i = 0; i < declaredCases && !chosenOutcomeFunction; ++i){
				currentCase = cases[i];
				if(isEqual(currentCase.caseValue, inputValue)){
					chosenOutcomeFunction = currentCase.outcomeFunction;
				}
			}
			if(!chosenOutcomeFunction){
				chosenOutcomeFunction = defaultOutcomeFunction;
			}
			// Take the chosen function (or a fall-back "undefined" generator function) and call it.
			return (chosenOutcomeFunction || function undefinedOutcome(){
				return undefined;
			})();
		};
		
		return switcher;
	}

	function MultiSwitchError(message, code){
		/* istanbul ignore else */
		if(typeof(Error.captureStackTrace) === 'function'){
			Error.captureStackTrace(this, MultiSwitchError);
		}
		this.name = 'MultiSwitchError';
		this.message = String(message);
		this.code = Number(code);
	}
	
	return {
		switch: MultiSwitch,
		MultiSwitch: MultiSwitch,
		MultiSwitchError: MultiSwitchError
	};
}



module.exports = customize();
module.exports.customize = customize;