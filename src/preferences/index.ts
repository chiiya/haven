import CookieManager from "../cookies/cookie-manager";
import store from "../store";
import DefaultPreferences from "./default-preferences";
import { getAllPurposes, trans } from "../utils";

export default class CookiePreferences {
  /** Cookie manager instance */
  protected cookieManager: CookieManager;
  /** Button for saving preferences */
  protected saveButton: HTMLButtonElement | null = null;

  /**
   * Fetch DOM elements.
   */
  constructor() {
    this.cookieManager = new CookieManager(store.prefix, store.type);
  }

  /**
   * Initialize cookie preferences initial states and event listeners.
   */
  public init(): void {
    const wrapper = document.getElementById("cookie-preferences");
    if (wrapper !== null) {
      DefaultPreferences.create(wrapper);
    }
    this.attachListeners();
  }

  /**
   * Attach event listeners to all checkboxes.
   */
  public attachListeners(): void {
    const purposes = getAllPurposes();
    const checkboxes: { [purpose: string]: HTMLInputElement } = {};
    for (const purpose of purposes) {
      const checkbox = <HTMLInputElement | null>(
        document.getElementById(`cookie-preferences--${purpose}`)
      );
      if (checkbox !== null) {
        checkboxes[purpose] = checkbox;
        checkbox.checked = this.cookieManager.hasCookiesEnabled(purpose);
        checkbox.addEventListener("change", () => {
          this.cookieManager.enableFunctionalCookie();
          if (checkbox.checked) {
            this.cookieManager.enableCookies(purpose);
          } else {
            this.cookieManager.disableCookies(purpose);
          }
        });
      }
    }

    const saveButton = document.getElementById("cookie-preferences__save");
    if (saveButton !== null) {
      saveButton.addEventListener("click", () => {
        this.cookieManager.enableFunctionalCookie();
        for (const purpose of purposes) {
          if (checkboxes[purpose].checked) {
            this.cookieManager.enableCookies(purpose);
          } else {
            this.cookieManager.disableCookies(purpose);
          }
        }
        const notification = document.getElementById("cookie-notification");
        if (notification !== null) {
          notification.style.display = "none";
        }
      });
    }
  }
}
