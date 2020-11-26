/**
 * FROM https://github.com/TehShrike/deepmerge
 * The MIT License (MIT)
 *
 * Copyright (c) 2012 James Halliday, Josh Duff, and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { isMergeableObject } from './is-mergeable';

function cloneUnlessOtherwiseSpecified(value: any): any {
  return isMergeableObject(value)
    ? deepmerge(Array.isArray(value) ? [] : {}, value)
    : value
}

function arrayMerge(target: any, source: any): any {
  return target.concat(source).map(function(element: any) {
    return cloneUnlessOtherwiseSpecified(element)
  })
}

function getEnumerableOwnPropertySymbols(target: any): any {
  return Object.getOwnPropertySymbols
    ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
      return target.propertyIsEnumerable(symbol)
    })
    : []
}

function getKeys(target: any) {
  return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object: any, property: string) {
  try {
    return property in object
  } catch(_) {
    return false
  }
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target: any, key: string) {
  return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
      && Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target: any, source: any) {
  const destination = {};
  if (isMergeableObject(target)) {
    getKeys(target).forEach(function(key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key]);
    })
  }
  getKeys(source).forEach(function(key) {
    if (propertyIsUnsafe(target, key)) {
      return
    }

    if (propertyIsOnObject(target, key) && isMergeableObject(source[key])) {
      destination[key] = deepmerge(target[key], source[key]);
    } else {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key]);
    }
  });
  return destination
}

export function deepmerge(target: any, source: any) {
  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source)
  } else if (sourceIsArray) {
    return arrayMerge(target, source)
  } else {
    return mergeObject(target, source)
  }
}
