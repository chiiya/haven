import { HavenNotificationOptions } from '../../types';
import { styles } from './default-styles';
import store from '../store';
import { trans } from '../utils';

export const notification = (options: HavenNotificationOptions) => {
  return `
  <div id="cookie-notification" role="alert" class="hv-notification hv-notification--${options.position}" data-display="flex" style="display: none;">
    <p class="hv-notification__message">
        ${trans('notification.message')} <a href="${options.policyUrl}" target="_blank">${trans('notification.policy')}</a>
    </p>
    <div class="hv-notification__actions">
        <button id="cookie-notification__decline" class="hv-notification__decline">${trans('notification.decline')}</button>
        <button id="cookie-notification__accept" class="hv-notification__accept">${trans('notification.accept')}</button>
    </div>
  </div>
  `;
};

export default class DefaultNotification {
  public static create() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles(store.notification.styles)));
    document.head.appendChild(style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = notification(store.notification);
    document.body.appendChild(wrapper);
  }
}
