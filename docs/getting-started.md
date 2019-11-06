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


