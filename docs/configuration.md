# Configuration

The following options may be configured:

| Option         | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `prefix`       | Custom prefix for the consent cookies created by Haven (e.g. `cs-functional` instead of `cookies-functional`). **Default**: `cookies`. |
| `domains`      | List of cookie domains. See [Consent Revoke](/consent-revoke). |
| `cookies`      | Custom cookies grouped by purpose that should be deleted on consent revoke. Should be an object with the purpose as the key and an array of strings (cookie names) as the values. |
| `lang`         | Default language used. **Default**: `en`.                    |
| `type`         | Consent type: `opt-in` / `opt-out`. **Default**: `opt-in`.   |
| `services`     | List of services used in the application. See [Service Injection](/service-injection) |
| `purposes`     | Custom list of purposes used in the application. Haven will gather all purposes from the purposes specified in your services. Use this option to overwrite that behavior when necessary. |
| `notification` | Customization options for the [cookie notification](/cookie-notification). |
| `preferences`  | Customization options for the [cookie preferences](/cookie-preferences). |
| `translations` | Custom translations.                                         |

