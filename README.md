[![Build Status](https://secure.travis-ci.org/parris/iz.png)](http://travis-ci.org/parris/iz)

Goals/Info
----
This package's goals are really simple. Just looking for a lightweight manner to validate common things. It is user
centric and ensures that they don't make typos. It does not require them to enter things in "some right way", but
rather "a right way". In other words if they like to put "." instead of "-" in their phone numbers it should let them.
We should just make sure they don't mess up and only put 8 numbers instead of 10. If we need our data in some other
format that is our job to normalize! In fact that might be a good next project... "norm.js" sounds fairly sexy to me :).

Change Log: 0.0.2
----
- Re-ordered parameters for fileExtension and inArray
- Added method chaining
- Added error messages

API
----
Chaining:

    iz(10).between(2, 15).int().multiple(5);

When using the chained notation an object containing an errors{array} and valid{bool} is returned. You could take the
returned object and run more validations on it later as well. This function also accepts an object with error names.

    var errors = {
        between: "Is not between",
        int: "Not an int!!!",
        multiple: "This is terrible and you should fix it"
    }
    iz("Bob", errors).between(2, 15).int().multiple(5);

You don't need to use the chained notation. Alternatively you could call the functions more simply:

    iz.between(3, 2, 5); //is 3, between 2 and 5?

Possible validations so far. All return true or false. The comment next to each is the true case:

    iz.alphaNumeric(*);               // Is number or string(contains only numbers or strings)
    iz.between(number, start, end);   // Number is start or greater but less than or equal to end, all params numeric
    iz.blank(*);                      // Empty string, undefined or null
    iz.boolean(*);                    // true, false, 0, 1
    iz.cc(*);                         // Luhn checksum approved value
    iz.date(*);                       // Is a data obj or is a string that is easily converted to a date
    iz.decimal(*);                    // Contains 1 decimal point and potentially can have a - at the beginning
    iz.email(*);                      // Seems like a valid email address
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

- Equality: There is no guarantee of an equalTo method for objects and even if there were object equality can mean a variety of things. The 'primitives' are easily compared, which makes this check sort of useless. If this catches on maybe I'll enforce equalTo methods on objects?
- Uniqueness: I would LOVE to check for uniqueness; however, since that implementation is dependant on environment it is not possible within the scope of this package. Also it is non-trivial in EVERY case to solve async type requests synchronously. I am working on uniqueness currently in mongo and I'll post a gist or something eventually.
- File: Requires async not ready yet to do that yet.
- ExpDate: Just make it so an old date can't be entered. You can't validate this number until the bank reports a failure anyways.
- In depth email address regex: Not really possible it seems. You can either write some really complicated regex that will likely pass 99.9% of things or write something simple that will pass everything with the @ symbol. I choose the later. The other option was to ask the ISPs. Once again async is required. Not ready for that yet. Also some ISPs have blocked those features (sbcglobal for instance). Just make the user "confirm" their email address. That should be your validation.
- Money: The scope is just too large. I started making this and realized there are about 50x ways to skin this. If you have ideas I'd love to hear them. I started doing it by locale then realized that was too limiting. Then I had about 7 "modes" and an optional regex, which also sucked. I think I'll settle on it depends too much on specification and as such it shouldn't be part of a library.
- Empty: Underscore's implementation is awesome :).
- URL: No real non-crazy regex exists. Checking for http:// at the front is lame, why force your user to type that in? The alternative is AJAX.

Did I miss a validation? Send me a message or a pull request.

Thoughts
----
- There is a ton of "checking" done, but the library doesn't expose calculated values (even though it finds them). For example the library doesn't tell you what type something is, it simply tells you if the type matches some string. It might be useful to provide both checking methods and value methods.
- I may expand the scope of this project to have client/server side validations for mongo.
- It may be cool to define locals since some of the functions depend on it. Then for each locale have different tests set-up. I'll wait till this gains some more steam or I have a need for such a system.

Installation
----

Install with node.js:

    npm install iz --save

Client side: simply include bin/iz-latest-min.js (if you are feeling bold) or a specific version. iz.js in the root directory is un-minified and could also be useful for debugging.
