<div align="center"><img src="https://i.postimg.cc/9Mfsfmf0/haven.png" alt="Haven"></div>
<p align="center"><strong>GDPR-ready cookie consent manager with zero dependencies.</strong></p>
<p align="center">
  <a href="https://codeclimate.com/github/chiiya/haven/maintainability"><img src="https://api.codeclimate.com/v1/badges/b3dfae642bc14fec2160/maintainability" /></a>
</p>
<br>

# Overview
Haven is a simple-to-use cookie consent manager enabling GDPR and ePrivacy compliance with just a few lines of code. Haven comes with the following features included out of the box:

|      | Feature                                                      |
| ---- | ------------------------------------------------------------ |
| 📣    | **Cookie notification** for opt-in and opt-out strategies.   |
| 🔧    | **Cookie preferences** enabling users to revoke or change their consent at any time. |
| 📥    | **Automatic injection of services** (google-analytics, google-tag-manager, facebook-pixel or any custom solution) at runtime, after the user has given their consent. |
| 🗑️ | **Removal of all tracking cookies** after a user has revoked their consent. |
| 📙 | **Translations** for multiple languages with easy customization. |
| 🤖 | Written in TS, and as such compatible with **ES5, ES6+ and TS** projects out of the box. |

# Quickstart

## Installation
```bash
npm i @chiiya/haven -S
```

## Usage
To use Haven in your project, either load the library via a `script` tag in your
HTML, or import it as a module in your Javascript.

<details>
  <summary>Script Tag</summary>

```html
<script src="https://unpkg.com/@chiiya/haven"></script>
<script>
Haven.create({
    services: [
        {
            name: 'google-analytics',
            options: {
                    id: 'UA-XXXXXXXX-1',
            },
            purposes: ['analytics'],
            inject: true,
        }
    ]
});
</script>
```

</details>

<details>
  <summary>ES5 Import</summary>

```javascript
var { Haven } = require('haven');

Haven.create({
    services: [
        {
            name: 'google-analytics',
            options: {
                    id: 'UA-XXXXXXXX-1',
            },
            purposes: ['analytics'],
            inject: true,
        }
    ]
});
```

</details>

<details>
  <summary>ES6+ Import</summary>

```javascript
import Haven from '@chiiya@haven';

Haven.create({
    services: [
        {
            name: 'google-analytics',
            options: {
                    id: 'UA-XXXXXXXX-1',
            },
            purposes: ['analytics'],
            inject: true,
        }
    ]
});
```

</details>

With that, users will get a cookie notification asking for their consent. Google 
Analytics will only be loaded once this consent has been given. Users may revoke 
their consent at any time by using the settings injected into your privacy policy 
page. Upon consent revoke, all tracking cookies set by Google Analytics will be 
removed.

For further information and configuration details, check out the 
[documentation](https://chiiya.github.io/haven/).

## Polyfills

Haven is compiled using [Babel](https://babeljs.io/) targeting browsers [with more than 1% of global usage](https://github.com/jshjohnson/Choices/blob/master/.browserslistrc) and expecting that all features listed below are available or polyfilled in browser:

```
Object.keys()
Object.values()
Object.assign()
String.startsWith()
Array.flat()
Array.forEach()
Set
```

If you need to support a browser that does not have one of the features listed above, I suggest including a polyfill from [polyfill.io](https://polyfill.io/v3/):

``` html
<script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=Object.keys%2CObject.values%2CObject.assign%2CSet%2CString.prototype.startsWith%2CArray.prototype.flat"></script>
```

