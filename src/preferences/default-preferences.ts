import store from '../store';
import { getAllPurposes, trans } from '../utils';

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
  const options = store.preferences.styles;

  return `
    .hv-preference {
      align-items: center;
      box-sizing: border-box;
      display: flex;
      font-family: ${fontStack.join(', ')};
      font-size: 16px;
      justify-content: space-between;
      line-height: 1.5;
      width: 100%;
    }

    .hv-preference__purpose {
      font-size: 20px;
      margin: 0;
    }

    .hv-preference__description {
      margin-top: 10px;
      width: 100%;
    }

    .hv-toggle {
      display: none;
    }

    .hv-toggle:checked + label::before {
      background: ${options.toggleBackground};
      left: auto;
      right: 20px;
      transform: translateX(16px);
    }

    .hv-toggle:disabled + label {
      cursor: not-allowed;
      opacity: .5;
    }

    .hv-toggle-label {
      border: 1px solid ${options.toggleBorder};
      border-radius: 9999px;
      cursor: pointer;
      display: inline-block;
      height: 24px;
      margin: 0;
      position: relative;
      width: 48px;
    }

    .hv-toggle-label::before {
      background: ${options.toggleBorder};
      border-radius: 9999px;
      content: "";
      height: 16px;
      left: 4px;
      position: absolute;
      transition: transform .3s ease, background-color .3s ease;
      top: 3px;
      width: 16px;
    }
  `;
};

const createPreferences = (): string => {
  const purposes = [
    'functional',
    ...getAllPurposes(),
  ];
  return `
    <p>${trans('preferences.description')}</p>
    ${purposes.map((purpose) => {
      return `
        <div class="hv-preference">
          <h3 class="hv-preference__purpose">${trans(`purposes.${purpose}.name`)}</h3>
          <input type="checkbox" class="hv-toggle" id="cookie-preferences--${purpose}" ${purpose === 'functional' ? 'disabled checked' : ''}>
          <label for="cookie-preferences--${purpose}" class="hv-toggle-label"></label>
        </div>
        <p class="hv-preference__description">${trans(`purposes.${purpose}.description`)}</p>
      `;
    }).join('')}
  `;
};

export default class DefaultPreferences {
  /**
   * Create and inject the default cookie preferences.
   */
  public static create(container: HTMLElement) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(createStyles()));
    document.head.appendChild(style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = createPreferences();
    container.appendChild(wrapper);
  }
}
