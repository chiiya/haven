# Service Injection

Haven ensures your website is GDPR-compliant by only _injecting_ third party services
once the user has given his consent. So instead of having the following code snippet 
somewhere in your HTML...

```html
<!-- Google Analytics -->
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
</script>
<!-- End Google Analytics -->
```

... you would instead tell Haven to inject this service at runtime. This should be done
for all third party services. Haven comes with the following services out of the box:
- Google Analytics
- Google Tag Manager
- Facebook Pixel

## Configuring services
The Haven configuration object takes a list of services:

```javascript
Haven.create({
    services: [],
});
```

Each service may specify the following options:

| Option     | Details                                                      | Required |
| ---------- | ------------------------------------------------------------ | -------- |
| `name`     | Name of the service. The value is used to determine whether a service has already been injected, and should thus be **unique**. | _true_   |
| `purposes` | List of cookie purposes that apply to this service. The service will only be injected if _all_ of the purposes have been consented to by the user. The purposes available by default are: `functional`, `analytics`, `marketing`, `preferences`. When specifying custom purposes, please make sure you provide a corresponding translation entry. | _true_   |
| `type`     | If you wish to make use of the default injectors provided by Haven, make sure you use one of the following types: `google-analytics`, `google-tag-manager` or `facebook-pixel`. | _false_   |
| `inject`   | The value may be a boolean or a custom injector function (see [Custom Injectors](#custom-injectors)). When set to `true`, it will attempt to use a default injector. | _false_  |
| `required` | Boolean value that describes whether the service is required. When true, the service will _always_ be injected, no matter the consent. | _false_  |
| `cookies`  | Array of cookie names provided by this service. The names may be strings or regular expressions. Haven will delete these cookies when the user revokes his consent. Cookies for any of the default injectors do not need to be specified here. | _false_  |
| `options`  | Optional options passed to the injector function. When using a default injector, specify your Google Analyitcs / Google Tag Manager / Facebook Pixel ID here (`options.id`) | _false_  |


## Custom Injectors

The `inject` property of a given service may also be a function which will then get called by Haven to inject the service once all prerequisites have been met.

```javascript
Haven.create({
    services: [
        {
            name: 'custom-script',
            purposes: ['analytics', 'custom-purpose'],
            inject: () => {
  				const firstScript = document.getElementsByTagName('script')[0];
  				const script = document.createElement('script');
  				script.src = `https://some-custom-script-source`;
  				firstScript.parentNode!.insertBefore(script, firstScript);
            }
        }
    ]
})
```

