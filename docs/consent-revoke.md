# Consent Revoke

When users revoke their consent, all cookies set by third party services should be removed.
Haven will try to detect the possible cookie domains used on a website; however this is only
possible in ~80-90% of scenarios without using a list of all [available domains](https://publicsuffix.org/). 
If Haven is not removing cookies correctly, try specifying a custom domain list:

```javascript
Haven.create({
    domains: ['.subdomain.host.tld', '.host.tld'],
});
```
