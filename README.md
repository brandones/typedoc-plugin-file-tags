## typedoc-plugin-file-tags


A plugin for [Typedoc](http://typedoc.org) to allow setting `category` tags at the file level.

[![npm](https://img.shields.io/npm/v/typedoc-plugin-file-tags.svg)](https://www.npmjs.com/package/typedoc-plugin-file-tags)

### Installation

```
npm install typedoc-plugin-file-tags --save-dev
```

### Usage

Include `@category` tags at the file level.

```ts
/**
 * These tags will be applied to all the exports of this file.
 * @module
 * @category Math
 */

export function add(a, b) {
  return a + b;
}

/** Subtracts `b` from `a` */
export function subtract(a, b) {
  return a - b;
}
```
