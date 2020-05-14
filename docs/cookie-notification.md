# Cookie Notification

If not otherwise specified, Haven will automatically create a cookie notification asking users for their consent. The cookie notification may be customized using the `notification` option:

```javascript
Haven.create({
    notification: {
        ... // customizations
    }
})
```

## Options

| Option      | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| `position`  | Position of the cookie notification. May be either `top` or `bottom`.                  |
| `policyUrl` | URL to your cookie or privacy policy where the user can configure his cookie settings. |
| `styles`    | Custom style options for the cookie notification, see below.                           |

The following style options may be configured:

| Option                       | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| `background`                 | Background for the cookie notification banner.            |
| `textColor`                  | Custom text color.                                        |
| `linkColor`                  | Custom link color.                                        |
| `buttonBackgroundColor`      | Custom background color for the `Accept` button.          |
| `buttonBackgroundColorHover` | Custom background color on hover for the `Accept` button. |
| `buttonTextColor`            | Custom text color for the `Accept` button.                |

```javascript
Haven.create({
  notification: {
    position: "top",
    policyUrl: "/cookie-information",
    styles: {
      background: "#428bca",
      textColor: "#ffffff"
    }
  }
});
```

## Custom Cookie Notification

You may also use a completely custom cookie notification component, just make sure to use the following IDs on your elements:

- `#cookie-notification`: wrapper element of the cookie notification. Haven will show or hide this element depending on consent status.
- `#cookie-notification__accept`: button or link element to accept all cookies.
- `#cookie-notification__decline`: (optional) button or link element to decline all non-functional cookies.

If you are using a display option other than `block` for the wrapper element, you may specify this using the `data-display` property on the wrapper element. Haven will then use this value when toggling the view status (shown or hidden).

```html
<div
  id="cookie-notification"
  class="bg-white fixed md:relative z-20 h-full md:h-auto flex items-center justify-center shadow-md"
  role="alert"
  data-display="flex"
  style="display:none"
>
  <div class="container mx-auto">
    <div
      class="flex items-center flex-row pt-12 pb-8 px-8 lg:px-0 justify-between"
    >
      <div class="flex flex-wrap items-center">
        <div class="w-full lg:w-7/12">
          <p class="mt-3">
            We use cookies to collect and analyse information on our site's
            performance and to enable the site to function. You can choose to
            allow all cookies by clicking 'Allow all' or manage them
            individually by clicking 'Manage cookie preferences', where you will
            also find more information.
          </p>
        </div>
        <div class="w-full lg:w-5/12 mt-8 md:mt-0 flex flex-col items-center">
          <a href="/cookie-policy" class="text-center"
            >Manage cookie preferences</a
          >
          <button
            type="button"
            id="cookie-notification__accept"
            class="mt-3 ap-btn ap-btn--primary"
          >
            Allow all
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```
