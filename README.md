<div align="center"><img src="https://i.postimg.cc/9Mfsfmf0/haven.png" alt="Haven"></div>
<div align="center"><strong>GDPR-ready cookie consent manager with zero dependencies.</strong></div>  
<br>

# Overview
Haven is a simple-to-use cookie consent manager enabling GDPR and ePrivacy compliance with just a few lines of code. Haven comes with the following features included out of the box:
- Cookie notification for opt-in and opt-out strategies.
- Cookie preferences enabling users to revoke or change their consent at any time.
- Automatic injection of services (google-analytics, google-tag-manager, facebook-pixel or any custom solution) at 
runtime, after the user has given their consent.
- Deletion of all tracking cookies after a user has revoked their consent.
- Translation for multiple languages and easy customization.
- Written in TS, and as such compatible with ES5, ES6+ and TS projects out of the box.

## Example
The following code snippet shows how easy it is to get started with Haven.

```html
<script>
    Haven.create({
        services: [
            {
                name: 'google-analytics',
                id: 'UA-XXXXXXXX-1',
                purposes: ['analytics'],
                inject: true,
            }
        ]
    })
</script>
```

And in your privacy policy:

```html
<div id="cookie-preferences"></div>
```

With that, users will get a cookie notification asking for their consent. Google Analytics will only be loaded once this consent has been given. Users may revoke their consent at any time by using the settings injected into your privacy policy page. Upon consent revoke, all tracking cookies set by Google Analytics will be removed.

 