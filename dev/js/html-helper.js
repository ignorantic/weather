/**
 * html-helper.js
 * Created by Andrii Sorokin on 08/21/17
 * https://github.com/ignorantic/weather.git
 */

let html = {};

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
html.tag = function (htmlTag, innerHTML, attrs, style) {

    let element;

    function addAttrs () {
        for (let key in attrs) {
            if (!Object.prototype.hasOwnProperty.call(attrs, key)) {
                continue;
            }
            let valueStr;
            if (Array.isArray(attrs[key])) {
                valueStr = attrs[key].join(' ');
            } else {
                valueStr = attrs[key];
            }
            element.setAttribute(key, valueStr);
        }
    }

    function addChildren () {
        if (typeof innerHTML === 'string') {
            element.innerHTML = innerHTML;
            return;
        }
        if (innerHTML instanceof HTMLElement) {
            element.appendChild(innerHTML);
            return;
        }
        if (Array.isArray(innerHTML)) {
            innerHTML.forEach(value => {
                if (value instanceof HTMLElement) {
                    element.appendChild(value);
                }
            });
        }
    }

    function addStyles () {
        let key;
        for (key in style) {
            if (!Object.prototype.hasOwnProperty.call(style, key)) {
                continue;
            }
            if (typeof style[key] === 'string') {
                element.style[key] = style[key];
            }
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
html.a = function (innerHTML, url, attrs, style) {
    let element = html.tag('a', innerHTML, attrs, style);
    if (typeof url === 'string') {
        element.setAttribute('href', url);
    }
    return element;
};

export default html;
