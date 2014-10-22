[![Build Status](https://secure.travis-ci.org/parris/iz.png)](http://travis-ci.org/parris/iz)

What is it?
====
A validation library written for client/server side needs in javascript. Oh and awesome syntax is important to us too.

Setup
====

Server side (Node/CommonJS)
----

    npm install iz --save

Then you can include iz, are and validators if needed

    var iz = require('iz'),
        are = iz.are,
        validators = iz.validators;

Client Side
----
This depends on situation. If you are using CommonJS modules use the server side syntax.

If you are using AMD modules, you can include files from the amd folder like so:

    require(function(require) {
        var iz = require('node_modules/iz/amd/iz'),
            are = require('node_modules/iz/amd/are'),
            validators = require('node_modules/iz/amd/validators');
    });

If you are **not** using a module system you may want to take a look at OneJS/Browserify, and how we did client side builds in v0.2.0 (just view the tag on github).

API
====
Chaining:
----

    iz(10).between(2, 15).int().multiple(5); //why yes, yes it is
    iz(10).not().between(1, 5); // the fancy not operator will cause the opposite result to happen next. This is also true!

iz(), and all validation commands return an Iz object. An iz object always contains an `errors`{array} and `valid`{bool}. `errors` will be filled with a default error messsage for each incorrect field. To provide custom error messages you can do the following:

    var errors = {
        between: 'Is not between, please fix',
        not_between: 'Value must be between!',
        int: 'Not an int!!!',
        multiple: 'This is terrible and you should fix it'
    }
    iz('Bob', errors).between(2, 15).int().multiple(5);

Simple Checks
----
You don't need to use the chained notation. The following will return true or false:

    iz.between(3, 2, 5); //is 3, between 2 and 5?

JSON
----
It is often useful to get a list of validations from your server for a given model. Nested objects work to!

    var rules = {
        'cost': [
            {
                'rule': 'between',
                'args': [17, 1000],
                'error': 'The cost must be between 17, 1000'
            },
            {
                'rule': 'required',
                'error': 'You must specify a cost'
            },
        ],
        'producer.id': [
            {
                'rule': 'int',
                'error': 'Producer ID must be an int'
            }
        ],
        'producer.name.first': [
            {
                'rule': 'alphaNumeric',
                'error': 'Must be names and numbers'
            }
        ]
    };

    are(rules).validFor({
        cost: 20,
        producer: {
            id: 1,
            name: {
                first: 'bob'
            }
        }
    });

Are/Multiple rules
----
`are` doesn't just force you to use json validations. You could also check if any number of chained or json rules are valid.

    var wine = new Bottle({age: 30, cost: 1000.01}),
        costErrors = {
            number: 'Cost must be given as a number'
        },
        ageErrors = {
            int: 'Must be an whole number',
            between: 'This wine is too young, it\'s no good'
        },
        rules = {
            cost: iz(wine.cost, costErrors).decimal(),
            age: iz(wine.age, ageErrors)
                .int().between(17, 10000)
        },
        areRules = are(rules);

    areRules.valid(); // true

    rules.cost.setValue(2000.00);
    areRules.valid(); // true, setValue revalidates, as does are.valid

    rules.cost('hi'); // we didn't use setValue on the Iz cost object
    rules.cost.valid; // and valid is still true

    are(rules).valid() // but `valid()` will revalidate, false
    rules.cost.valid // and `valid` is now in the correct state again

    // or you can use this and just give null values in the rules object
    areRules.validFor(wine)

It is often useful to get back error messages from an Are object. Regardless of
how you create your Are object (JSON or Iz objects) the result is a set of Iz
objects stored within `.fields`. Iz objects contain an attribute called `errors`.
The `.getInvalidFields` helper will retrieve all iz objects with errors.

    var rules = Are(...);

    if (!rules.validFor(someAttributeObject)) {
        return rules.getInvalidFields();
    }

Error Messages:
----
In the event you want to return more detailed error messages. You can use a
simple syntax to format your error message with a validators arguments.

    var error_messages = {between: '{{0}} is not between {{1}} and {{2}}'};
    var izObj = iz(5, error_messages).between(100, 200);
    console.log(izObj.errors);

will log `['5 is not between 100 and 200']`. This works with
`are.getInvalidFields()` too.

Required Fields:
----
In most cases, you'll only want to validate values when they exist. By default iz functions in this way. If you want to force the presence of a value you can use the `required` method.

    iz(value).required() //a value is required
    iz(value).required().email() //value is required and is a valid email
    iz(value).date() //value is not required but must be a date if provided

Validators:
----
All validators (apart from iz.required) return true if no value is provided (e.g. null, undefined or '').

Validations (true case in comments):

    iz.alphaNumeric(*);               // Is number or string(contains only numbers or strings)
    iz.between(number, start, end);   // Number is start or greater but less than or equal to end, all params numeric
    iz.blank(*);                      // Empty string
    iz.boolean(*);                    // true, false, 0, 1
    iz.cc(*);                         // Luhn checksum approved value
    iz.date(*);                       // Is a date obj or is a string that is easily converted to a date
    iz.decimal(*);                    // int or float
    iz.email(*);                      // Seems like a valid email address
    iz.empty(*);                      // If an object, array or function contains no properties true. All primitives return true.
    iz.equal(*, *);                   // Any 2 things are strictly equal. If 2 objects their internal properties will be checked. If the first parameter has an equals method that will be run instead
    iz.extension(ob1, ob2);           // If obj2's methods are all found in obj1
    iz.fileExtension(value, arr);     // Checks if the extension of value is in arr. An obj can be provide, but must have indexOf defined.
    iz.fileExtensionAudio(value);     // Check against mp3, ogg, wav, aac
    iz.fileExtensionImage(value);     // Check against png, jpg, jpeg, gif, bmp, svg, gif
    iz.inArray(value, arr);           // If * is in the array
    iz.anArray(arr);                  // If arr is an array
    iz.int(*, bool (optional));       // Is an int. If the 2nd variable is true (false by default) a decimal is allowed
    iz.ip(str);                       // str resembles an IPV4 or IPV6 address
    iz.minLength(val, min);           // val (str or arr) is greater than min
    iz.maxLength(val, max);           // val (str or arr) is shorter than max
    iz.multiple(num, mult);           // Number is multiple of another number
    iz.number(*);                     // Is either an int or decimal
    iz.ofType(obj, typeName);         // If it is a named object, and the name matches the string
    iz.phone(str, canHaveExtension?); // Is an american phone number. Any punctuations are allowed.
    iz.postal(*);                     // Is a postal code or zip code
    iz.required(*);                   // Is not null, undefined or an empty string
    iz.ssn(*);                        // Is a social security number
    iz.string(*);                     // Is the argument of type string

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

Custom Validators:
----
Adding custom validators is done though either the validation or iz object.  If the validator already exists, then addValidator will throw an exception.  You can force an override by adding a 3rd parameter of true.


    var dummyValidator = function(value){
        if(typeof value !=='string'){
            return false;
        }
        return value.indexOf('test') === 0;
    };
    iz.addValidator('startsWithTest', dummyValidator);
    iz.startsWithTest('test string');

    //for override of existing validator, only do this if you are sure.
    iz.addValidator('string', dummyValidator, true);




Ommissions
====
- Uniqueness: This is non-trivial since it requires db/server side/client side knowledge.
- File: Not sure what the scope should be yet. Mime types? Existence on the web?
- Email (more in depth): Right now we check for the @ symbol. There are extremely complicated regex out there. I haven't really found the need. If you have an idea send a pull request!
- Money: The scope is really large. I am thinking about having localized settings.
- URL: No real non-crazy regex exists. Checking for http:// at the front is lame, why force your user to type that in?

Did I miss a validation? Send me a message or a pull request.

Roadmap
====
- Simplify creation of Iz objects. Too much construction happens right now.
- Allow developers to pass custom rjs options for a custom iz build

Change Log
====

0.7.0
----
- Added `iz.addValidator` method to add custom validations more effectively

0.6.0
----
- Added `is.anArray` validation

0.5.2
----
- Removed a strange hidden character that was introduced

0.5.0
----
- Added interpolation to error messages
- Added bower
- Changed license and copyright info
- Fixed readme typos

0.4.1
----
- Changed AMD compile process
- Rebuilt modules as AMD
- Split out tasks into their own files
- Added roadmap
- Fixed up more docs

0.4.0
----
- Renamed private `_fields` variable in Are to `fields`
- Added `getInvalidFields` to Are
- Added `iz.string` validation
- Fixed docs

0.3.0
----
- Added JSON based validations
- Replaced previous build system with requirejs.
- Doc simplification
- Code style reformatting

0.2.0
----
- Added iz.required()
- Falsy values now pass through as valid without `.required`

0.1.0
----
- Fixed loading of iz, are and validator modules
- Added missing 'blank' validator
- Added build/test system via grunt
- Removed versions in bin
- Added version/generation number in banner
- Changed file structure

0.0.4
----
- Revalidation was added to iz
- Add are() for group validation
- Clean-up of syntax/optimizations

0.0.3
----
- Added equal method
- Added empty method
- Added not() operation

0.0.2
----
- Re-ordered parameters for fileExtension and inArray
- Added method chaining
- Added error messages
