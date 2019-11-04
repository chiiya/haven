# Purposes

Cookies in your application may be used for one or more _purposes_. As an example, _Google Analytics_ is used for _analytics_, while _Google Ads_ is used for _marketing_ purposes. Haven comes with the following purposes configured out of the box:

- `functional`: cookies that are _required_ for the functionality of your website. Examples include cookies used for authentication or the contents of a shopping basket.
- `analytics`: cookies used for analytics.
- `marketing`: cookies used for marketing purposes, such as ads or other campaigns.
- `preferences`: non-required cookies used to store user preferences.

On top of these pre-configured purposes, you may specify your own custom purposes by adding the corresponding translation entries:

```javascript
Haven.create({
    translations: {
        en: {
            purposes: {
                'my-custom-purpose': {
                    name: 'custom-name',
                    description: 'custom-description',
                } 
            }
        }
    }
});
```

