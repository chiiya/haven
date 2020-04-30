# Getting Started

## Installation

```bash
npm i @chiiya/haven -S
```
or
```bash
yarn add @chiiya/haven
```

## Usage
To use Haven in your project, either load the library via a CDN in your HTML, or import 
it as a module in your Javascript.

### CDN
```html
<script src="https://unpkg.com/@chiiya/haven"></script>
<script>
Haven.create({
    services: [
        {
            name: 'google-analytics',
            purposes: ['analytics'],
            type: 'google-analytics',
            inject: true,
            options: {
              id: 'UA-XXXXXXXX-1',
            }
        }
    ]
});
</script>
```

### ES5 Import
```javascript
var { Haven } = require('haven');

Haven.create({
    services: [
        {
            name: 'google-analytics',
            purposes: ['analytics'],
            type: 'google-analytics',
            inject: true,
            options: {
                id: 'UA-XXXXXXXX-1',
            }
        }
    ]
});
```

### ES6+ Import
```javascript
import Haven from '@chiiya@haven';

Haven.create({
    services: [
        {
            name: 'google-analytics',
            purposes: ['analytics'],
            type: 'google-analytics',
            inject: true,
            options: {
                id: 'UA-XXXXXXXX-1',
            }
        }
    ]
});
```

### Polyfills

Haven is compiled using [Babel](https://babeljs.io/) targeting browsers [with more than 1% of global usage](https://github.com/jshjohnson/Choices/blob/master/.browserslistrc) and expecting that all features listed below are available or polyfilled in browser:

```
Object.prototype.keys
Object.prototype.values
Object.prototype.assign
String.prototype.startsWith
Array.prototype.flat
Array.prototype.forEach
Set
```

If you need to support a browser that does not have one of the features listed below, I suggest including a polyfill from the very good [polyfill.io](https://polyfill.io/v3/):

``` html
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=Object.keys%2CObject.values%2CObject.assign%2CSet%2CString.prototype.startsWith%2CArray.prototype.flat"></script>


