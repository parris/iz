Goals
----
This package's goals are really simple. Just looking for a lightweight manner to validate common things. Zuul is reference to ghostbusters (and mythology I SUPPOSE). Apparently he is some sort of gatekeeper. As such zuul will act as your gatekeeper and keep your data's integrity intact! I also named it zuul for conflict purposes. It is less likely that zull will conflict that word validate or validation.

API (sorta)
----
Possible validations so far. All return true or false. The comment next to each is the true case:

zuul.alphaNumeric(*);               // is number or string(contains only numbers or strings)
zuul.between(number, start, end);   // number is start or greater but less than or equal to end, all params numeric
zuul.blank(*);                      // empty string, undefined or null
zuul.boolean(*);                    //true, false, 0, 1
zuul.cc(*);                         // luhn checksum approved value
zuul.date(*);                       // is a data obj or is a string that is easily converted to a date
zuul.decimal(*);                    // contains 1 decimal point and potentially can have a - at the beginning
zuul.email(*);                      // seems like a valid email address
zuul.extension(ob1, ob2);           // if obj2's methods are all found in obj1
zuul.inList(*, list);               // if * is in the list
zuul.int(*, bool);                  // Is an int. If the 2nd variable is true (default), the decimals points are strictly not allowed
zuul.ip(str);                       // str resembles an IPV4 or IPV6 address
zuul.minLen(str, min);              // str is greater than min
zuul.maxLen(str, max);              // str is shorter than max
zuul.money(str);                    // contains monetary 1 monetary symbol and decimal with 2 digits
zuul.multiple(num, mult);           // number is multiple of another number
zuul.notEmpty(arr);                 // array or object has at least member or item
zuul.number(*);                     // is either an int or decimal
zuul.ofType(obj, typeName);         // if it is a named object, and the name matches the string
zuul.phone(*);                      // is a phone number of some type
zuul.postal(*);                     // is a postal code or zip code
zuul.ssn(*);                        // is a social security number
zuul.url(*);                        // seems like a valid url

The check the possible cases that will definitely work take a look at the spec folder.

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
