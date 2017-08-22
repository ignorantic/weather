/**
 * html-helper.js
 * Created by Andrii Sorokin on 08/21/17
 * https://github.com/ignorantic/weather.git
 */

const html = {};

/**
 * Create and return DOM element
 *
 * @param  {String}         htmlTag         HTML tag
 * @param  {String}         innerHTML       HTML text
 *         {Object}         DOM element
 *         {Array}          array of DOM elements
 * @param  {Object}         attrs
 * @param  {Object}         style
 * @return {Object}         DOM element
 */
html.tag = (htmlTag, innerHTML, attrs, style) => {
  let element;
  function addAttrs() {
    if (attrs) {
      Object.keys(attrs).forEach((item) => {
        let valueStr;
        if (Array.isArray(attrs[item])) {
          valueStr = attrs[item].join(' ');
        } else {
          valueStr = attrs[item];
        }
        element.setAttribute(item, valueStr);
      });
    }
  }

  function addChildren() {
    if (typeof innerHTML === 'string') {
      element.innerHTML = innerHTML;
      return;
    }
    if (innerHTML instanceof HTMLElement) {
      element.appendChild(innerHTML);
      return;
    }
    if (Array.isArray(innerHTML)) {
      innerHTML.forEach((value) => {
        if (value instanceof HTMLElement) {
          element.appendChild(value);
        }
      });
    }
  }

  function addStyles() {
    if (style) {
      Object.keys(style).forEach((item) => {
        if (typeof style[item] === 'string') {
          element.style[item] = style[item];
        }
      });
    }
  }

  /* BEGIN */

  if (typeof htmlTag === 'string') {
    element = document.createElement(htmlTag);
  } else {
    element = document.createElement('div');
  }

  if (typeof attrs === 'object') {
    addAttrs();
  }

  if (innerHTML) {
    addChildren();
  }

  if (typeof style === 'object') {
    addStyles();
  }

  return element;
};

/**
 * Create and return DOM element of link
 *
 * @param  {String}         innerHTML       HTML text
 *         {Object}         DOM element
 *         {Array}          array of DOM elements
 * @param  {String}         url             Web address
 * @param  {Object}         attrs
 * @param  {Object}         style
 * @return {Object}         DOM element     Link element
 */
html.a = (innerHTML, url, attrs, style) => {
  const element = html.tag('a', innerHTML, attrs, style);
  if (typeof url === 'string') {
    element.setAttribute('href', url);
  }
  return element;
};

export default html;
