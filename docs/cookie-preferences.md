# Cookie Preferences

Users should have the option to revoke their consent at any time. They should also be able
to configure their consent for all of the available purposes separately. Haven makes this
very easy: just add a wrapper element with the id `#cookie-preferences` to your cookie policy
page, and Haven will automatically inject a preferences section. The cookie preferences may be customized using the preferences option:

```javascript
Haven.create({
    preferences: {
        ... // customizations
    }
})
```

## Options

| Option   | Description                                |
| -------- | ------------------------------------------ |
| `styles` | Custom styles for the preferences section. |

The following styles may be configured:

| Option                  | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `textColor`             | Custom text color.                                      |
| `toggleBackground`      | Custom background color for the (active) toggle switch. |
| `toggleBorder`          | Custom border color for the toggle switch.              |
| `buttonBackground`      | Custom background for the `Save` button.                |
| `buttonBackgroundHover` | Custom background color on hover for the `Save` button. |
| `buttonColor`           | Custom text color for the `Save` button.                |

## Custom Cookie Preferences

You may also use a completely custom cookie preferences component, just make sure to use the following IDs on your elements:

- `#cookie-preferences--${purpose}` checkbox for a given `purpose`.
- `#cookie-preferences__save`: button for saving the preferences.

## Accessing Cookie Preferences

```js
const haven = Haven.create({});
haven.preferences.init();
```
