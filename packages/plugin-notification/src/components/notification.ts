import Component from './component';

export default class NotificationComponent extends Component {
  protected element: HTMLElement|null = null;

  /**
   * Render the default cookie notification component.
   */
  public render(): void {
    this.eventStore.removeAll();
    if (this.element === null) {
      this.element = this.mount();
    }
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
        this.store.dispatch('ENABLE_ALL_COOKIES');
      })
      .add(decline, 'click', () => {
        this.store.dispatch('DISABLE_ALL_COOKIES');
      });
  }

  protected mount(): HTMLElement {
    const element = document.createElement('div');
    document.body.prepend(element);
    return element;
  }

  /**
   * Get the resolved cookie notification classes.
   */
  protected get classes(): string {
    const posX = this.options.notification.positionX;
    const posY = this.options.notification.positionY;

    return `hv-notification hv-notification--${posX} hv-notification--${posY}`;
  }

  /**
   * Get the display property (shown or hidden).
   */
  protected get display(): string {
    if (this.store.getters.HAS_ALL_COOKIES_SET) {
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
    if (this.options.notification.includePolicyUrl) {
      const url = this.options.notification.policyUrl;
      return `
        <a href="${url}" target="_blank">${store.getters.TRANS('notification.policy')}</a>
      `;
    }

    return '';
  }
}
