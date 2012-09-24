Goals
----
This package's goals are really simple. Just looking for a lightweight manner to validate common things. Zuul is reference to ghostbusters (and mythology I SUPPOSE). Apparently he is some sort of gatekeeper. As such zuul will act as your gatekeeper and keep your data's integrity intact! I also named it zuul for conflict purposes. It is less likely that zull will conflict that word validate or validation.

BTW I did intend for some of this is like a greatest hits of the web in terms of validation and I attempted to provide credit where it was due.

API (sorta)
----
Possible validations so far. All return true or false. The comment next to each is the true case:

    zuul.alphaNumeric(*);               // Is number or string(contains only numbers or strings)
    zuul.between(number, start, end);   // Number is start or greater but less than or equal to end, all params numeric
    zuul.blank(*);                      // Empty string, undefined or null
    zuul.boolean(*);                    // true, false, 0, 1
    zuul.cc(*);                         // Luhn checksum approved value
    zuul.date(*);                       // Is a data obj or is a string that is easily converted to a date
    zuul.decimal(*);                    // Contains 1 decimal point and potentially can have a - at the beginning
    zuul.email(*);                      // Seems like a valid email address
    zuul.extension(ob1, ob2);           // If obj2's methods are all found in obj1
    zuul.fileExtension(arr, value);     // Checks if the extension of value is in arr. An obj can be provide, but must have indexOf defined.
    zuul.fileExtensionAudio(value);     // Check against mp3, ogg, wav, aac
    zuul.fileExtensionImage(value);     // Check against png, jpg, jpeg, gif, bmp, svg, gif
    zuul.inArray(arr, value);           // If * is in the array
    zuul.int(*, bool (optional));       // Is an int. If the 2nd variable is true (false by default) a decimal is allowed
    zuul.ip(str);                       // str resembles an IPV4 or IPV6 address
    zuul.minLen(str, min);              // str is greater than min
    zuul.maxLen(str, max);              // str is shorter than max
    zuul.money(str);                    // Contains monetary 1 monetary symbol and decimal with 2 digits
    zuul.multiple(num, mult);           // Number is multiple of another number
    zuul.notEmpty(arr);                 // Array or object has at least member or item
    zuul.number(*);                     // Is either an int or decimal
    zuul.ofType(obj, typeName);         // Ff it is a named object, and the name matches the string
    zuul.phone(*);                      // Is a phone number of some type
    zuul.postal(*);                     // Is a postal code or zip code
    zuul.ssn(*);                        // Is a social security number
    zuul.url(*);                        // Seems like a valid url

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

Omissions
----
Lastly, I omitted a few typical validations (temporarily maybe) for these reasons:

- Equality: There is no guarantee of an equalTo method for objects and even if there were object equality can mean a variety of things. The 'primitives' are easily compared, which makes this check sort of useless. If this catches on maybe I'll enforce equalTo methods on objects?
- Uniqueness: I would LOVE to check for uniqueness; however, since that implementation is extremely dependant on environment it is not possible within the scope of this package. Also it is somewhat a difficult problem to solve async type requests synchronously in node without some other library being involved. I have one I am working for mongo. I'll post a gist eventually.
- File: Requires async not ready yet.
- ExpDate: Just make it so an old date can't be entered. You can't check for this until the bank reports a failure
- In depth email address regex: Not really possible it seems. You can either write some really complicated regex that will likely pass 99.9% of things or write something simple that will pass everything with the @ symbol. I choose the later. The other option was to ask the ISPs. Once again async is required. Not ready for that yet. Also some ISPs have blocked those features (sbcglobal for instance).

Integration
----
I am integrating this with backbone.js. I am writing some code to make backbone.js transportable between server side and client side and the way I am integrating it is by extending the model prototype. There are other ways, but this might be the easiest solution! You can use underscores extend functionality to modify backbone just a bit to include this functions.

Installation
----
I am going to publish this on svn once everything is done. For now you can throw this into node_modules.
