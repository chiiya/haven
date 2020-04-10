import Component from './component';
import store from '../store';

export default class CookieNotification extends Component {
  /**
   * Render the default cookie notification component.
   */
  public render(): void {
    this.eventStore.removeAll();
    this.element.className = this.classes;
    this.element.style.display = this.display;
    this.element.innerHTML = `
    <div class="container">
      <p class="hv-notification__message">
        ${this.message}
      </p>
      <div class="hv-notification__actions">
        <button id="cookie-notification__accept" class="hv-notification-button hv-notification__accept">
          ${store.getters.TRANS('notification.accept')}
        </button>
        <button id="cookie-notification__decline" class="hv-notification-button hv-notification__decline">
          ${store.getters.TRANS('notification.decline')}
        </button>
        <button id="cookie-notification__configure" class="hv-notification-button hv-notification__configure">
          ${store.getters.TRANS('notification.configure')}
        </button>
      </div>
    </div>
    `;

    const accept = <HTMLButtonElement>(
      this.element.querySelector('#cookie-notification__accept')
    );
    const decline = <HTMLButtonElement>(
      this.element.querySelector('#cookie-notification__decline')
    );
    this.eventStore
      .add(accept, 'click', () => {
        store.dispatch('ENABLE_ALL_COOKIES');
      })
      .add(decline, 'click', () => {
        store.dispatch('DISABLE_ALL_COOKIES');
      });
  }

  /**
   * Get the resolved cookie notification classes.
   */
  protected get classes(): string {
    return `hv-notification hv-notification--${store.state.notification.options.positionX} hv-notification--${store.state.notification.options.positionY}`;
  }

  /**
   * Get the display property (shown or hidden).
   */
  protected get display(): string {
    if (store.getters.HAS_ALL_COOKIES_SET) {
      return 'none';
    }

    return 'flex';
  }

  /**
   * Get the cookie notification message.
   */
  protected get message(): string {
    return `${store.getters.TRANS('notification.message')} ${this.policy}`;
  }

  /**
   * Get the cookie policy link.
   */
  protected get policy(): string {
    if (store.state.notification.options.includePolicyUrl) {
      return `
        <a href="${
        store.state.notification.options.policyUrl
      }" target="_blank">${store.getters.TRANS('notification.policy')}</a>
      `;
    }

    return '';
  }
}
