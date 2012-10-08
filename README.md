[![Build Status](https://secure.travis-ci.org/parris/iz.png)](http://travis-ci.org/parris/iz)

Goals/Info
----
This package's goals are really simple. Just looking for a lightweight manner to validate common things. It is user
centric and ensures that they don't make typos. It does not require them to enter things in "some right way", but
rather "a right way". In other words if they like to put "." instead of "-" in their phone numbers it should let them.
We should just make sure they don't mess up and only put 8 numbers instead of 10. If we need our data in some other
format that is our job to normalize! In fact that might be a good next project... "norm.js" sounds fairly sexy to me :).

Change Log: 0.0.3
----
- Added equal method
- Added empty method
- Added not() operation

Change Log: 0.0.2
----
- Re-ordered parameters for fileExtension and inArray
- Added method chaining
- Added error messages

API
----
Chaining:

    iz(10).between(2, 15).int().multiple(5); //why yes, yes it is
    iz(10).between(2, 15).not().between(1, 5).int().multiple(5); // ooo fancy not operator... the next thing will check not-ness

When using the chained notation an object containing an errors{array} and valid{bool} is returned. You could take the
returned object and run more validations on it later as well. This function also accepts an object with error names. If you not something
then you can provide not_* in the error_messages object.

    var errors = {
        between: "Is not between, please fix",
        not_between: "Value must be between!",
        int: "Not an int!!!",
        multiple: "This is terrible and you should fix it"
    }
    iz("Bob", errors).between(2, 15).int().multiple(5);

You don't need to use the chained notation. Alternatively you could call the functions more simply:

    iz.between(3, 2, 5); //is 3, between 2 and 5?

Possible validations so far (true case in comments):

    iz.alphaNumeric(*);               // Is number or string(contains only numbers or strings)
    iz.between(number, start, end);   // Number is start or greater but less than or equal to end, all params numeric
    iz.blank(*);                      // Empty string, undefined or null
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
    iz.minLen(val, min);              // val (str or arr) is greater than min
    iz.maxLen(val, max);              // val (str or arr) is shorter than max
    iz.multiple(num, mult);           // Number is multiple of another number
    iz.number(*);                     // Is either an int or decimal
    iz.ofType(obj, typeName);         // If it is a named object, and the name matches the string
    iz.phone(str, canHaveExtension?); // Is an american phone number. Any punctuations are allowed.
    iz.postal(*);                     // Is a postal code or zip code
    iz.ssn(*);                        // Is a social security number

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

Omissions
----
Lastly, I omitted a few typical validations (temporarily maybe) for these reasons:

- Uniqueness: I may eventually write some sort of interface for uniqueness checks within some db, but for now this is non-trivial. First up would be mongodb.
- File: Not sure what the scope should be yet. Mime types? Existance on the web?
- Email (more in depth): Right now we check for the @ symbol. This accepts all email address. Some more hard regex would be cool, but a real valid email regex is overly complicated and doesn't accept everything. The other option is an in depth check with an email provider (sbcglobal comes to mind).
- Money: The scope is really large. Thinking about having localized settings. Perhaps specifying some simple format. Not sure yet!
- URL: No real non-crazy regex exists. Checking for http:// at the front is lame, why force your user to type that in?

Did I miss a validation? Send me a message or a pull request.

Thoughts
----
There is a ton of "checking" done, but the library doesn't expose calculated values (even though it finds them). For example the library doesn't tell you what type something is, it simply tells you if the type matches some string. It might be useful to provide checking methods along with calculation and sanitization methods.

Installation
----

Install with node.js:

    npm install iz --save

Client side:
Simply include bin/iz-latest-min.js or a specific version. iz.js in the root directory is un-minified and could also be useful for debugging. I will keep all previous releases in the bin directory UNTIL it no longer becomes managable. So if you use some specific version make sure to host it client side.

We will maintain backwards compatibility between 0.0.0 releases although new features will definitely be added.
