[![Build Status](https://secure.travis-ci.org/parris/iz.png)](http://travis-ci.org/parris/iz)

Goals/Info
====
This package's goals are really simple. Just looking for a lightweight manner to validate common things. It is user
centric and ensures that they don't make typos. It does not require them to enter things in "some right way", but
rather "a right way". In other words if they like to put "." instead of "-" in their phone numbers it should let them.
We should just make sure they don't mess up and only put 8 numbers instead of 10. If we need our data in some other
format that is our job to normalize! In fact that might be a good next project... "norm.js" sounds fairly sexy to me :).
It also provides validation for required fields and separates it from whether what a user has entered is valid.

Setup
====

Node
----

    npm install iz --save

Then you can include iz, are and validators if needed

    var iz = require('iz'),
        are = iz.are,
        validators = iz.validators;

Client Side
----
Simply include `iz.js` or `iz.min.js` like so:

    <script src="iz.min.js"></script>
    <script>
        var iz = izBundle(),
            are = iz.are,
            validators = iz.validators;
    </script>


API
====

Chaining:
----

    iz(10).between(2, 15).int().multiple(5); //why yes, yes it is
    iz(10).between(2, 15).not().between(1, 5).int().multiple(5); // the fancy not operator will cause the opposite result to happen next... this is also true!

When using the chained notation an object containing an errors{array} and valid{bool} is returned. You could take the
returned object and run more validations on it later as well. This function also accepts an object with error names. If you `.not()` something
then you can provide not_* in the error_messages object to return a custom error.

    var errors = {
        between: "Is not between, please fix",
        not_between: "Value must be between!",
        int: "Not an int!!!",
        multiple: "This is terrible and you should fix it"
    }
    iz("Bob", errors).between(2, 15).int().multiple(5);

You don't need to use the chained notation. Alternatively you could call the functions more simply:

    iz.between(3, 2, 5); //is 3, between 2 and 5?

Required Fields:
----

When using iz.required(*) it can be used alone or chained with other validators to cover the following scenarios:

    iz(value).required()                       //value is required
    iz(value).required().email()               //value is required and is a valid email
    iz(value).date()                           //value is not required but must be a date if provided

This behaviour is great for validating user input or payloads sent to an api where validation of required fields is a common need.

N.B. However, it means that iz(null).date(), iz(undefined).email() and iz('').int() will all return true!!! While this seems counter intuitive, it is important to realise that iz validates only if a value is actually provided. Whether a value is required or not is a separate concern altogether and is covered by iz.required(*);

Validators:
----

All validators (apart from iz.required) return true if no value is provided (e.g. null, undefined or '').

Possible validations so far (true case in comments):

    iz.alphaNumeric(*);               // Is number or string(contains only numbers or strings)
    iz.between(number, start, end);   // Number is start or greater but less than or equal to end, all params numeric
    iz.blank(*);                      // Empty string
    iz.boolean(*);                    // true, false, 0, 1
    iz.cc(*);                         // Luhn checksum approved value
    iz.date(*);                       // Is a date obj or is a string that is easily converted to a date
    iz.decimal(*);                    // Contains 1 decimal point and potentially can have a - at the beginning
    iz.email(*);                      // Seems like a valid email address
    iz.empty(*);                      // If an object, array or function contains no properties true. All primitives return true.
    iz.equal(*, *);                   // Any 2 things are strictly equal. If 2 objects their internal properties will be checked. If the first parameter has an equals method that will be run instead
    iz.extension(ob1, ob2);           // If obj2's methods are all found in obj1
    iz.fileExtension(value, arr);     // Checks if the extension of value is in arr. An obj can be provide, but must have indexOf defined.
    iz.fileExtensionAudio(value);     // Check against mp3, ogg, wav, aac
    iz.fileExtensionImage(value);     // Check against png, jpg, jpeg, gif, bmp, svg, gif
    iz.inArray(value, arr);           // If * is in the array
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

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

Group/Saved Validations
====

You can now validate multiple fields at once!

    var iz = require("iz"),
        are = iz.are,
        validators = iz.validators

        // Bottle, is the name of the model
        wine = new Bottle({age: 30, cost: 1000.00}),

        // How I want to output my errors
        costErrors = {
            decimal: "Cost must be given as a decimal"
        },
        ageErrors = {
            int: "Must be an whole number",
            between: "This wine is too young, it's no good"
        },

        // My rules, I can look at the keys and inspect the errors
        rules = {
            cost: iz(wine.cost, costErrors).decimal(),
            age: iz(wine.age, ageErrors)
                .int().between(17, 10000)
        };

    are(rules).valid();
    // true

    rules.cost.setValue(2000.00);
    are(rules).valid();
    // true, setValue revalidates, as does are.valid

    rules.cost(100);
    rules.cost.valid;
    // still true

    are(rules).valid()
    // false, revalidate was called
    rules.cost.valid
    // false


Omissions
====

Lastly, I omitted a few typical validations (temporarily maybe) for these reasons:

- Uniqueness: I may eventually write some sort of interface for uniqueness checks within some db, but for now this is non-trivial. First up would be mongodb.
- File: Not sure what the scope should be yet. Mime types? Existence on the web?
- Email (more in depth): Right now we check for the @ symbol. This accepts all email address. Some more hard regex would be cool, but a real valid email regex is overly complicated and doesn't accept everything. The other option is an in depth check with an email provider (sbcglobal comes to mind).
- Money: The scope is really large. Thinking about having localized settings. Perhaps specifying some simple format. Not sure yet!
- URL: No real non-crazy regex exists. Checking for http:// at the front is lame, why force your user to type that in?

Did I miss a validation? Send me a message or a pull request.

Thoughts
====

- A ton of "checking" done, but the library doesn't expose calculated values (even though it finds them). For example the library doesn't tell you what type something is, it simply tells you if the type matches some string. It might be useful to provide checking methods along with calculation and sanitization.
- Getters could be used instead of the "not()" function. All it does is set _not to true and then return Iz; however, the check done to see if getters are available in the environment is the same check that would need to be done when running the validations. Since we are trying to make this tool relatively cross-platform I decided to omit this functionality.

Change Log
====

Next: Validator mixins, add source map, and refactor Iz class a bit.
Experimental: Client side include method system. Let me know what you think about it.
Note: I am creating an integration for backbone in another repo.

0.2.0
----
- Added iz.required()
- Falsy values now pass through as valid without `.required`

0.1.0
----
- Fixed loading of iz, are and validator modules
- Added missing "blank" validator
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
