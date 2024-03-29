# Introduction

`minilogic` is a package of tiny utility functions for dealing with logic problems in code.

It can be installed for use in your project with `npm install --save minilogic`.

# Features

## switch

A simple lookup table implementation for tabular logic.
Tabular logic (tabular switch) is selecting a code path to take based on more than one predicate.

Consider the following problem: in our program, we need to display a user "rank" based on what privileges they have. They might be allowed to read posts and/or write posts.
If the user can write and read posts, they are an "admin". If they can only read but not write, they're a "guest". A user that can neither read nor create content are considered to be an "outsider".

Moreover, an invalid combination could arise (writing but not reading) - we would want to signal an error during resolving the rank then.

In pure JS/ES, it could look like this:
```js
function getUserRank(canRead, canWrite){
	if(canRead && canWrite){
		return 'admin';
	}
	if(canRead && !canWrite){
		return 'guest';
	}
	if(!canRead && !canWrite){
		return 'outsider';
	}
	// Note that the conditionals above could be shortened by excluding the already-checked conditions. Preserved for clarity.
	throw new Error('Invalid read/write permission combination - can not determine user rank');
}
```

The switch() facility provided by this library takes the burden of writing such numerous and convoluted conditional statements off the programmer, as seen below:

```js
var ml = require('minilogic');
function getUserRank(canRead, canWrite){
	var heldPermissions = { read: canRead, write: canWrite };
	return ml.switch().case({ read: true, write: true }, function(){
		return 'admin';
	}).case({ read: true, write: false }, function(){
		return 'guest';
	}).case({ read: false, write: false }, function(){
		return 'outsider';
	}).default(function(){
		throw new Error('Invalid read/write permission combination - can not determine user rank');
	}).evaluate(heldPermissions);
}
```

There we have it - a table-based `switch` statement.

### Alternate `switch` syntax

The switch() instruction can also be used by passing the value to switch on into the call immediately, as demonstrated below:

```js
// This:
ml.switch().case(caseA).case(caseB).case(caseC).default(caseDefault).evaluate(switchedValue);
// Is equivalent to this:
ml.switch(switchedValue).case(caseA).case(caseB).case(caseC).default(caseDefault).evaluate();
// However, watch out - passing a (different) value to switch() and to evaluate() will yield undefined behaviour:
ml.switch(switchedValueA).case(caseA).case(caseB).case(caseC).default(caseDefault).evaluate(switchedValueB); // -> ???
```

### Custom case selection

By default, the "case" calls only accept flat object maps - that is, a single-level, non-null Object whose keys are strings and values are primitive types, comparable by `===`.

Cases are matched by comparing each key within the passed object ("switched value") with the case's match value. If all keys' values match, the case is selected and evaluation stops.

This behaviour can be overridden by using the customize function provided by the exported switch facility:

```js
var MLSwitch = ml.switch.customize({
	isEqual: function isEqual(caseValue, switchedValue){ return caseValue === switchedValue }
});
// Now we can switch simple types (only), similar to JS's native switch(){} construct:
MLSwitch.switch(numericValue).case(1, function(){ return 'one'; }).case(2, function(){ return 'two'; }).default(function(){ return 'uh-oh'; });
```

# License
The MIT License (MIT)

Copyright (c) 2014 Robert Kawecki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.