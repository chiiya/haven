import store from '../store';
import { trans } from '../utils';

const fontStack = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  'Oxygen',
  'Ubuntu',
  'Cantarell',
  '"Fira Sans"',
  '"Droid Sans"',
  '"Helvetica Neue"',
  'Arial',
  '"Noto Sans"',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

const createStyles = (): string => {
  const options = store.notification.styles;

  return `
    .hv-notification {
      align-items: center;
      background: ${options.background};
      box-sizing: border-box;
      color: ${options.textColor};
      display: flex;
      font-family: ${fontStack.join(', ')};
      font-size: 16px;
      justify-content: space-between;
      left: 0;
      line-height: 1.5;
      opacity: 1;
      overflow: hidden;
      padding: 16px 32px;
      position: fixed;
      right: 0;
      transition: opacity 1s ease;
      width: 100%;
      z-index: 9999;
    }

    .hv-notification--hidden {
      opacity: 0;
    }

    .hv-notification--top {
      top: 0;
    }

    .hv-notification--bottom {
      bottom: 0;
    }

    .hv-notification__message {
      margin: 0 16px 0 0;
    }

    .hv-notification__message a {
      color: ${options.linkColor};
      text-decoration: underline;
    }

    .hv-notification__message a:hover {
      color: ${options.textColor};
    }

    .hv-notification-button {
      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      font-size: 14px;
      font-weight: 500;
      justify-content: center;
      outline: 0;
      padding: 8px 32px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .hv-notification__decline {
      background: transparent;
      color: ${options.textColor};
    }

    .hv-notification__decline:hover {
      text-decoration: underline;
    }

    .hv-notification__accept {
      background: ${options.buttonBackgroundColor};
      color: ${options.buttonTextColor};
    }

    .hv-notification__accept:hover {
      background: ${options.buttonBackgroundColorHover};
    }
  `;
};

const createNotification = (): string => {
  const options = store.notification;
  return `
  <div id="cookie-notification" role="alert" class="hv-notification hv-notification--${options.position}" data-display="flex" style="display: none;">
    <p class="hv-notification__message">
        ${trans('notification.message')} <a href="${options.policyUrl}" target="_blank">${trans('notification.policy')}</a>
    </p>
    <div class="hv-notification__actions">
        <button id="cookie-notification__decline" class="hv-notification-button hv-notification__decline">${trans('notification.decline')}</button>
        <button id="cookie-notification__accept" class="hv-notification-button hv-notification__accept">${trans('notification.accept')}</button>
    </div>
  </div>
  `;
};

export default class DefaultNotification {
  /**
   * Create and inject the default cookie notification.
   */
  public static create() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(createStyles()));
    document.head.appendChild(style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createNotification();
    document.body.appendChild(wrapper);
  }
}
