Dumper.js
=========

a PHP var_dump like function

## Installation

Download Dumper.js from GitHub.

Include the `dumper.js` file (or `dumper.min.js`) in your webpage.

```html
<script src="dumper.js"></script>
```

## Usage

Dumper.js have `toString()` and `toHTML()` methods.

```js
Dumper({foo: 'bar', baz: [1,2,3]}).toString();

// object (size=2)
//  foo => string 'bar' (length=3) 
//  baz =>
//   array (size=3)
//    0 => number 1 
//    1 => number 2 
//    2 => number 3
```

**NOTE**: `toHTML()` method add colors and collapsible nodes

## Compatibility

Currently Supports: IE9+ and modern browsers

----
Copyright (C) Giuseppe Di Terlizzi <giuseppe.diterlizzi@gmail.com>

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; version 2 of the License

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
