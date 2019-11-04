Haven will fire events on an event bus for most actions taken by the user or Haven. You may 
register custom event listeners using `Haven.on()`:

```javascript
/**
 * Create secondary GA instance.
 */
Haven.on('services-loaded', () => {
  window.ga('create', 'UA-XXXXXXXX-X', 'auto', 'custom');
  window.ga('custom.set', 'anonymizeIp', true);
  window.ga('custom.send', 'pageview');
});
```

The following events are fired by Haven. The first parameter is the event name, the second parameter (if present) the event payload.

| Event                    | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `service-loaded`, `name` | Fired whenever a service has been injected. The service `name` is passed as the payload. |
| `services-loaded`        | Fired once all services that meet the requirements have been injected. |
| `${purpose}-enabled`     | Fired once cookies for a given purpose (e.g. `functional` or `analytics`) have been accepted by the user. |
| `${purpose}-disabled`    | Fired when cookies for a given purpose have been declined by the user. |

