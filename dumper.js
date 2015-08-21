/*!
 * Dumper.js (a PHP var_dump like function)
 * https://github.com/LotarProject/Dumper.js
 *
 * @version   v1.0.0 (2015-08-20)
 * @copyright (C)2015, Giuseppe Di Terlizzi
 * @author    Giuseppe Di Terlizzi <giuseppe.diterlizzi@gmail.com>
 * @license   GPLv2
 */

/**
 * @function Dumper
 * @param {Object}
 * @example
 *
 *  Dumper({foo: 'bar', baz: [1,2,3]}).toString();
 *
 *  // object (size=2)
 *  //  foo => string 'bar' (length=3) 
 *  //  baz =>
 *  //   array (size=3)
 *  //    0 => number 1 
 *  //    1 => number 2 
 *  //    2 => number 3
 *
 */


function Dumper (object) {

  'use strict';

  if (this instanceof Dumper) {
    this._object = object;
  } else {
    return new Dumper(object);
  }

}

Dumper.prototype = {

  CHR_SPACE   : ' ',
  CHR_NEWLINE : '\n',
  CHR_ARROW   : '=>',

  COLOR_NUMBER  : 'green',
  COLOR_STRING  : 'red',
  COLOR_NULL    : 'blue',
  COLOR_BOOLEAN : 'purple',
  COLOR_ARROW   : 'gray',

  FONT_FAMILY : 'monospace',
  FONT_SIZE   : '1em',
  FONT_SPACE  : 'pre-wrap',

  TEMPLATE_NUMBER   : '<span style="color:{COLOR}">{VALUE}</span>',
  TEMPLATE_STRING   : '<span style="color:{COLOR}">\'{VALUE}\'</span> <em>(length={LENGTH})</em>',
  TEMPLATE_NULL     : '<span style="color:{COLOR}">null</span>',
  TEMPLATE_OBJECT   : '<em>(size={SIZE})</em>',
  TEMPLATE_BOOLEAN  : '<span style="color:{COLOR}">{VALUE}</span>',
  TEMPLATE_ARROW    : '<span style="color:{COLOR}">{ARROW}</span>',
  TEMPLATE_DUMP     : '<div class="dump" style="font-family:{FONT};font-size:{SIZE};white-space:{SPACE}">{DUMP}</div>',
  TEMPLATE_TYPE     : '<small>{TYPE}</small> ',
  TEMPLATE_TYPE_OBJ : '<strong>{TYPE}</strong> ',
  TEMPLATE_KEY      : '<span style="cursor:pointer" onclick="javascript:(document.getElementById(\'{KEYID}\').style.display=(document.getElementById(\'{KEYID}\').style.display)?\'\':\'none\');">{KEY}</span>',
  TEMPLATE_ITEMS    : '<span id="{KEYID}">{ITEMS}</span>',

  /**
   * @function toString
   * @public
   * @returns {String} Dump of object
   */
  toString: function () {
    var node = document.createElement('div');
    node.innerHTML = this._dump();
    return node.innerText;
  },

  /**
   * @function toHTML
   * @public
   * @returns {String} HTML dump of object
   */
  toHTML: function () {
    return this._dump();
  },


  /**
    * @function _indent
    * @private
    * @param  {Number} n
    * @return {String}
    */
  _indent: function (n) {
    var res = '';
    for (i = 0; i < n; i++) {
      res += this.CHR_SPACE;
    }
    return res;
  },

  /**
   * @function _template
   * @private
   * @param {String} string
   * @param {Object} object
   * @return {String}
   */
  _template: function (string, object) {
    return string.replace(/{(\w+)}/g, function (matches, item) {
      return object[item] + '' || '{' + item + '}'; // FIX "0" and "false" value
    });
  },

  _isArray: function (object) {
    return typeof object === 'object' && object instanceof Array;
  },

  _isNull: function (object) {
    return typeof object === 'object' && object === null;
  },

  _randId: function () {
    return Math.floor(Math.random() * (1024 * 64));
  },

  _render: function (value) {

    var result = (typeof value === 'object')
      ? ((value === null)
          ? ''
          : this._template(this.TEMPLATE_TYPE_OBJ, { 'TYPE' : (this._isArray(value) ? 'array' : 'object' ) })
        )
      : this._template(this.TEMPLATE_TYPE, { 'TYPE': typeof(value) });

    switch (typeof value) {

      case 'number':
        result += this._template(this.TEMPLATE_NUMBER, { 'VALUE' : value,
                                                         'COLOR' : this.COLOR_NUMBER });
        break;

      case 'string' :
        result += this._template(this.TEMPLATE_STRING, { 'VALUE'  : value,
                                                         'COLOR'  : this.COLOR_STRING,
                                                         'LENGTH' : value.length });
        break;

      case 'object' :
        result += (value === null)
                    ? this._template(this.TEMPLATE_NULL, { 'COLOR' : this.COLOR_NULL })
                    : this._template(this.TEMPLATE_OBJECT, { 'SIZE' : Object.keys(value).length });
        break;

      case 'boolean' :
        result += this._template(this.TEMPLATE_BOOLEAN, { 'COLOR' : this.COLOR_BOOLEAN ,
                                                          'VALUE' : value });

    }

    return result;

  },

  _dumper: function (object) {

    var dump   = '',
        args   = arguments,
        indent = ((args.length > 1) ? args[args.length-1] : 0);

    if (   typeof object === 'object'
        && object !== null ) {

      dump += this._indent(indent) + this._render(object) + this.CHR_NEWLINE;
      indent++;

      for (item in object) {

        var _id = this._randId();

        dump += this._indent(indent) +

          (typeof object[item] === 'object' && object[item] !== null
            ? ''
            : item + ' ' + this._template(this.TEMPLATE_ARROW, { 'ARROW' : this.CHR_ARROW, 'COLOR' : this.COLOR_ARROW }) + ' '
          ) + 

          (typeof object[item] === 'object'
            ? (object[item] === null
              ? this._render(null)
              : this._template(this.TEMPLATE_KEY, { 'KEY'   : item,
                                                    'KEYID' : 'key-'+_id }) + ' ' +
                this._template(this.TEMPLATE_ARROW, { 'ARROW' : this.CHR_ARROW,
                                                      'COLOR' : this.COLOR_ARROW })
            )
            : this._render(object[item]) + ' '
          ) +

          this.CHR_NEWLINE + 

          (typeof object[item] === 'object' && object[item]
            ? this._template(this.TEMPLATE_ITEMS, { 'KEYID' : 'key-'+ _id, 'ITEMS' : this._dumper(object[item], indent + 1) })
            : ''
          );

      }

    }
    else if ( typeof object !== 'object' ) {
      dump += this._render(object) + this.CHR_NEWLINE;
    }

    return dump;

  },

  /**
    * @function _dump
    * @private
    * @return {String}
    */
  _dump: function () {

    return this._template(this.TEMPLATE_DUMP, { 'DUMP' : this._dumper(this._object),
                                                'FONT' : this.FONT_FAMILY,
                                                'SIZE' : this.FONT_SIZE,
                                                'SPACE': this.FONT_SPACE });

  }

}
