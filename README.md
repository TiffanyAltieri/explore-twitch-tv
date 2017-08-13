# explore-twitch-tv

Hi! Here's my offering that I've entitled Twitch TV.  What you'll see inside is a pretty good representation of how I code though of course, if given more time...

I wanted to cover the basics of how I code. I am very big into the readability of code.  Readability affects how well code can be maintained, reused and added to. General trends you will see in my code is descriptive naming (which may seem verbose to some), an abundance of commenting, spaced out blocks of content. Let me comment on some specifics for each part:

# HTML
**Semantic elements** -
These make correctly dilineating space far easier and assist with accesibility

**Lots of classes** -
Sometimes alongside same name ids, but I use fewer ids. I try to give each element its own descriptive class to defin what it is better. Classes are used only by the CSS, while Ids are used by Javascript.

**One element per line** -
To keep the markup clean, I reserve only one line per element.  It makes adding more material easy, and it is an easy rule to remember, rather than a subjective rule that has a developer chose when to break to a new line.

# CSS
**Classes, but not a lot of elements** -
I style almost primarily on classes, which are descriptive. I will style on a few elements, but unless it is a semantic element, I will usually use it with its parent descriptive classes

**Alphabetized properties** -
These aid the scanability of the list and avoid duplication.  The only preprties I do not alphabetize arre transitions/transforms as those can get unweildy and are mostly browser prefixed

**Sectioning** -
I try to generally section my CSS to make it easier to find things

# Javascript
**Commenting** -
I comment every function, and usually several times within it if it is long.

**Small functions** -
I like to keep my functions as lightweight and "pure" as possible. It makes things easier to debug.

**Encapsulation** -
I don't want to pollute the global scope if it's not necessary to.

Those are just some things you will see in my code.  Other things like the use of ES6 variable naming and constructs are just me playing around when I don't have to supprot browsers like IE10.
