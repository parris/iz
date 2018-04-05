[![Build Status](https://secure.travis-ci.org/parris/iz.png)](http://travis-ci.org/parris/iz)

What is it?
====
A validation library written for client/server side needs in javascript. Oh and awesome syntax is important to us too.

Setup
====

Installation

    npm install iz --save
    # or
    yarn add iz

Then you can include iz, are and validators if needed

    import iz from 'iz';
    import are from 'iz/lib/are';
    import validators from 'iz/lib/validators';

Once you do this, you should decide which validations you'd like to include.
The default setup will include everything. This is how you can set that up:

    import iz from 'iz';
    import validators from 'iz/lib/validators';

    iz.register(validators);

If you'd like to do something more custom (to reduce bundle size):

    import iz from 'iz';
    import between from 'iz/lib/basicValidators/between';
    import int from 'iz/lib/basicValidators/int';

    iz.register({
        between: between,
        int: int,
        custom: function alwaysFalse() { return false; },
    });

Note - iz.register can be called repeatedly. If you'd like to override old validators you can pass "force" as the 2nd argument.

Requirements
----

Iz v2.0.0 heavily relies on many es6 features including: promises, proxies, objects and arrays. You **MUST** polyfill proxy and promise, the other features will compile to es5. If something doesn't work please report it.

API
====

Chaining:
----

    iz(10).between(2, 15).int().multiple(5); //why yes, yes it is
    iz(10).notBetween(1, 5); // all validators (custom or not) have a not variant available

iz(), and all validation commands return an Iz object. An iz object always contains an `errors`{array} and `valid`{bool}. `errors` will be filled with a default error messsage for each incorrect field. To provide custom error messages you can do the following:

    var errors = {
        notBetween: 'Value must be between!',
        int: 'Not an int!!!',
        multiple: 'This is terrible and you should fix it'
    }
    iz('Bob', errors).notBetween(2, 15).int().multiple(5);

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

    are(rules).for({
        cost: 20,
        producer: {
            id: 1,
            name: {
                first: 'bob'
            }
        }
    }).valid;

It is often useful to get back error messages from an Are object.
You can use the "invalidFields" property to get back errorMessages.

    var result = Are(...).for(someAttributeObject);

    if (!result.valid) {
        return rules.invalidFields;
    }

Async Validations
---

You can create custom validations that run asynchronously.
This works with both iz and are functions. IMPORTANT: If you have an async
validator and don't use the async property, you'll get false positives.

    iz.register({
        unique: function() {
            return fetch(...).then(() => true).catch(false);
        }
    });

    iz('name').unique().async.then((result) => {
        result.valid; // can be true or false;
    })

    // we also support async/await
    let result = await iz('name').unique().async;
    return result.valid;

    let result = await are(...).for(obj).async;
    return result.valid;

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
    iz(value).email().required() //value is required and is a valid email
    iz(value).date() //value is not required but must be a date if provided

Validators:
----
All validators (apart from iz.required) return true if no value is provided (e.g. null, undefined or '').

Validations (true case in comments):

    alphaNumeric(*);                // Is number or string(contains only numbers or strings)
    between(number, start, end);    // Number is start or greater but less than or equal to end, all params numeric
    blank(*);                       // Empty string
    boolean(*);                     // true, false, 0, 1
    cc(*);                          // Luhn checksum approved value
    date(*);                        // Is a date obj or is a string that is easily converted to a date
    decimal(*);                     // int or float
    email(*);                       // Seems like a valid email address
    empty(*);                       // If an object, array or function contains no properties true. All primitives return true.
    equal(*, *);                    // Any 2 things are strictly equal. If 2 objects their internal properties will be checked. If the first parameter has an equals method that will be run instead
    extension(ob1, ob2);            // If obj2's methods are all found in obj1
    fileExtension(value, arr);      // Checks if the extension of value is in arr. An obj can be provide, but must have indexOf defined.
    fileExtensionAudio(value);      // Check against mp3, ogg, wav, aac
    fileExtensionImage(value);      // Check against png, jpg, jpeg, gif, bmp, svg, gif
    inArray(value, arr);            // If * is in the array
    anArray(arr);                   // If arr is an array
    int(*, bool (optional));        // Is an int. If the 2nd variable is true (false by default) a decimal is allowed
    ip(str);                        // str resembles an IPV4 or IPV6 address
    minLength(val, min);            // val (str or arr) is greater than min
    match(str, tester, flags?);     // RegExp matching of a string. Accepts RegExps and strings as the tester
    maxLength(val, max);            // val (str or arr) is shorter than max
    multiple(num, mult);            // Number is multiple of another number
    number(*);                      // Is either an int or decimal
    ofType(obj, typeName);          // If it is a named object, and the name matches the string
    phone(str, canHaveExtension?);  // Is an american phone number. Any punctuations are allowed.
    postal(*);                      // Is a postal code or zip code
    required(*, allowEmptyString?); // Is not null, undefined or an empty string (unless allowEmptyString is set to true).
    ssn(*);                         // Is a social security number
    string(*);                      // Is the argument of type string

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

TODO
----

Add nested error rules within are. The current implementation doesn't allow for composition.

Change Log
====

2.2.1
----

- Bug fixes
- Unit tests are stricter
- Email validation is vastly improved

2.1.0
----

- Added RegExp (match) validation

2.0.0
----
Goals - Modernize, make the library smaller and add more features.

New features:
- Async/Await and Promise based validations.
- Better email validator

Improvements:
- Only import the validators you need
- Simplified creation of Iz/Are objects
- ofType validator now accounts for minification

Other:
- Switched not validations from .not().xyz() to notXYZ format to reduce library size.
- Changed API for Iz
  - Removed "setValue" and revalidation methods
- Required validations
  - They no longer apply on the validation function but work through iz and its proxy
- Changed API for Are
  - Dropped iz validations mixed with are validations. Are only supports JSON now.
  - Removed revalidation and setValue methods
- Trimmed docs, it was getting complicated for no reason

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
