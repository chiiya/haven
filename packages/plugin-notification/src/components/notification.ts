import Component from './component';
import { translate } from '../helpers/translate';

export default class NotificationComponent extends Component {
  /**
   * Render the default cookie notification component.
   */
  public render(): void {
    this.events.removeAll();
    if (this.element === null) {
      this.element = this.createMount();
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
          ${translate(this.options, 'notification.accept')}
        </button>
        <button id="cookie-notification__decline" class="hv-notification-button hv-notification__decline">
          ${translate(this.options, 'notification.decline')}
        </button>
        <button id="cookie-notification__configure" class="hv-notification-button hv-notification__configure">
          ${translate(this.options, 'notification.configure')}
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
    this.events
      .add(accept, 'click', () => {
        this.commit('ENABLE_ALL_COOKIES');
      })
      .add(decline, 'click', () => {
        this.commit('DISABLE_ALL_COOKIES');
      });
  }

  protected createMount(): HTMLElement {
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
    if (this.getters.HAS_ALL_COOKIES_SET()) {
      return 'none';
    }

    return 'flex';
  }

  /**
   * Get the cookie notification message.
   */
  protected get message(): string {
    return `${translate(this.options, 'notification.message')} ${this.policy}`;
  }

  /**
   * Get the cookie policy link.
   */
  protected get policy(): string {
    if (this.options.notification.includePolicyUrl) {
      const url = this.options.notification.policyUrl;
      return `
        <a href="${url}" target="_blank">${translate(this.options, 'notification.policy')}</a>
      `;
    }

    return '';
  }
}
