Goals/Info
----
This package's goals are really simple. Just looking for a lightweight manner to validate common things. I was going to
name it "is", but there is another project called "is" that handles type validations. "Iz will have to do for now!

API (sorta)
----
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
    iz.fileExtension(arr, value);     // Checks if the extension of value is in arr. An obj can be provide, but must have indexOf defined.
    iz.fileExtensionAudio(value);     // Check against mp3, ogg, wav, aac
    iz.fileExtensionImage(value);     // Check against png, jpg, jpeg, gif, bmp, svg, gif
    iz.inArray(arr, value);           // If * is in the array
    iz.int(*, bool (optional));       // Is an int. If the 2nd variable is true (false by default) a decimal is allowed
    iz.ip(str);                       // str resembles an IPV4 or IPV6 address
    iz.minLen(val, min);              // val (str or arr) is greater than min
    iz.maxLen(val, max);              // val (str or arr) is shorter than max
    iz.multiple(num, mult);           // Number is multiple of another number
    iz.number(*);                     // Is either an int or decimal
    iz.ofType(obj, typeName);         // If it is a named object, and the name matches the string
    /*iz.phone(*);                      // Is a phone number of some type
    iz.postal(*);                     // Is a postal code or zip code
    iz.ssn(*);                        // Is a social security number
    iz.url(*);                        // Seems like a valid url*/

Almost all possible use cases that will definitely work (and definitely not work) are in the spec folder.

Omissions
----
Lastly, I omitted a few typical validations (temporarily maybe) for these reasons:

- Equality: There is no guarantee of an equalTo method for objects and even if there were object equality can mean a variety of things. The 'primitives' are easily compared, which makes this check sort of useless. If this catches on maybe I'll enforce equalTo methods on objects?
- Uniqueness: I would LOVE to check for uniqueness; however, since that implementation is extremely dependant on environment it is not possible within the scope of this package. Also it is somewhat a difficult problem to solve async type requests synchronously in node without some other library being involved. I have one I am working for mongo. I'll post a gist eventually.
- File: Requires async not ready yet.
- ExpDate: Just make it so an old date can't be entered. You can't check for this until the bank reports a failure
- In depth email address regex: Not really possible it seems. You can either write some really complicated regex that will likely pass 99.9% of things or write something simple that will pass everything with the @ symbol. I choose the later. The other option was to ask the ISPs. Once again async is required. Not ready for that yet. Also some ISPs have blocked those features (sbcglobal for instance).
- Money: The scope is just too large. I started making this and realize there was about 50x ways to skin this. If you have ideas I'd love to hear them. I started doing it by locale then realized that was too limiting. Then I had about 7 "modes" and an optional regex, which also sucked. I think I'll settle on it depends too much on specification and as such it shouldn't be part of a library. If you need help search google for "regex money" you'll find a TON of resources.
- Empty: Underscore's implementation is awesome :).

Did I miss a validation? Send me a message or a pull request.

Thoughts
----
- There is a ton of "checking" done, but the library doesn't expose calculated values (even though it finds them). For example the library doesn't tell you what type something is, it simply tells you if the type matches some string. It might be useful to provide both checking methods and value methods.
- I may expand the scope of this project to have client/server side validations for mongo.

Integration
----
I am integrating this with backbone.js. I am writing some code to make backbone.js transportable between server side and client side and the way I am integrating it is by extending the model prototype. There are other ways, but this might be the easiest solution! You can use underscores extend functionality to modify backbone just a bit to include this functions.

Installation
----
I am going to publish this on svn once everything is done. For now you can throw this into node_modules.
