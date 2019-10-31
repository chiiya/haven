import { HavenNotificationStyles } from '../../types';

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

export const styles = (options:  HavenNotificationStyles) => {
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

    .hv-notification--top {
      top: 0;
    }

    .hv-notification--bottom {
      bottom: 0;
    }

    .hv-notification__message {
      margin-right: 16px;
    }

    .hv-notification-button {
      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      font-size: 14px;
      justify-content: center;
      outline: 0;
      padding: 8px 32px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .hv-notification__decline {
      background: transparent;
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
