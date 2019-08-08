/*!
 * cookie-consent-manager v1.0.0
 * (c) Elisha Witte <elishawitte@gmail.com>
 * Released under the MIT License.
 */
import Cookies from 'js-cookie';

var CookieManager = function () {
  function CookieManager(_a) {
    var _b = _a === void 0 ? {} : _a,
        prefix = _b.prefix,
        gaId = _b.gaId,
        type = _b.type;

    this.prefix = 'ap';
    this.type = type || 'opt-in';
    this.prefix = prefix || 'ap';
    this.gaId = gaId;
  }

  CookieManager.getCookie = function (name) {
    return Cookies.get(name);
  };

  CookieManager.setCookie = function (name, value, options) {
    Cookies.set(name, value, options || {});
  };

  CookieManager.removeCookie = function (name) {
    Cookies.remove(name);
  };

  CookieManager.cookieExists = function (name) {
    return Cookies.get(name) !== undefined && Cookies.get(name) !== '';
  };

  CookieManager.prototype.enableFunctionalCookie = function () {
    CookieManager.setCookie(this.prefix + "-functional", 'true', {
      expires: 365
    });
  };

  CookieManager.prototype.disableFunctionalCookie = function () {
    CookieManager.removeCookie(this.prefix + "-functional");
  };

  CookieManager.prototype.hasFunctionalCookie = function () {
    return CookieManager.cookieExists(this.prefix + "-functional");
  };

  CookieManager.prototype.enableAnalyticsCookie = function () {
    CookieManager.setCookie(this.prefix + "-analytics", 'true', {
      expires: 365
    });

    if (this.gaId !== undefined) {
      CookieManager.removeCookie("ga-disable-" + this.gaId);
    }
  };

  CookieManager.prototype.disableAnalyticsCookie = function () {
    CookieManager.setCookie(this.prefix + "-analytics", 'false', {
      expires: 365
    });

    if (this.gaId !== undefined) {
      CookieManager.setCookie("ga-disable-" + this.gaId, 'true', {
        expires: 365
      });
    }
  };

  CookieManager.prototype.hasAnalyticsEnabled = function () {
    var cookie = CookieManager.getCookie(this.prefix + "-analytics");

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  };

  CookieManager.prototype.enableMarketingCookie = function () {
    CookieManager.setCookie(this.prefix + "-marketing", 'true', {
      expires: 365
    });
  };

  CookieManager.prototype.disableMarketingCookie = function () {
    CookieManager.setCookie(this.prefix + "-marketing", 'false', {
      expires: 365
    });
  };

  CookieManager.prototype.hasMarketingEnabled = function () {
    var cookie = CookieManager.getCookie(this.prefix + "-marketing");

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  };

  CookieManager.prototype.acceptAll = function () {
    this.enableFunctionalCookie();
    this.enableAnalyticsCookie();
    this.enableMarketingCookie();
  };

  return CookieManager;
}();

var CookieNotification = function () {
  function CookieNotification(options) {
    if (options === void 0) {
      options = {};
    }

    this.cookieNotification = null;
    this.cookiesAccept = null;
    this.cookiesDecline = null;
    this.cookieManager = new CookieManager(options);
    this.cookieNotification = document.getElementById('cookie-notification');
    this.cookiesAccept = document.getElementById('cookie-notification__accept');
    this.cookiesDecline = document.getElementById('cookie-notification__decline');
  }

  CookieNotification.prototype.init = function () {
    var _this = this;

    if (this.cookieNotification !== null && !this.cookieManager.hasFunctionalCookie()) {
      this.showCookieNotification();
    }

    if (this.cookiesAccept !== null) {
      this.cookiesAccept.addEventListener('click', function (event) {
        event.preventDefault();

        _this.cookieManager.acceptAll();

        _this.hideCookieNotification();
      });
    }

    if (this.cookiesDecline !== null) {
      this.cookiesDecline.addEventListener('click', function (event) {
        event.preventDefault();

        _this.cookieManager.enableFunctionalCookie();

        _this.hideCookieNotification();
      });
    }
  };

  CookieNotification.prototype.showCookieNotification = function () {
    if (this.cookieNotification !== null) {
      this.cookieNotification.style.display = 'block';
    }
  };

  CookieNotification.prototype.hideCookieNotification = function () {
    if (this.cookieNotification !== null) {
      this.cookieNotification.style.display = 'none';
    }
  };

  return CookieNotification;
}();

var CookiePreferences = function () {
  function CookiePreferences(options) {
    if (options === void 0) {
      options = {};
    }

    this.checkboxAnalytics = null;
    this.checkboxMarketing = null;
    this.saveButton = null;
    this.saveButtonInitialText = '';
    this.saveButtonSavedText = '';
    this.cookieManager = new CookieManager(options);
    this.checkboxAnalytics = document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = document.getElementById('cookie-preferences__marketing');
    this.saveButton = document.getElementById('cookie-preferences__save');
  }

  CookiePreferences.prototype.init = function () {
    var _this = this;

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingEnabled();
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsEnabled();
    }

    if (this.saveButton !== null) {
      this.saveButtonInitialText = this.saveButton.innerText;
      this.saveButtonSavedText = this.saveButton.dataset.saved || 'Saved';
      this.saveButton.addEventListener('click', function () {
        _this.disableButton();

        _this.cookieManager.enableFunctionalCookie();

        if (_this.checkboxMarketing && _this.checkboxMarketing.checked) {
          _this.cookieManager.enableMarketingCookie();
        } else {
          _this.cookieManager.disableMarketingCookie();
        }

        if (_this.checkboxAnalytics && _this.checkboxAnalytics.checked) {
          _this.cookieManager.enableAnalyticsCookie();
        } else {
          _this.cookieManager.disableAnalyticsCookie();
        }
      });
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.addEventListener('change', function () {
        _this.enableButton();
      });
    }

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.addEventListener('change', function () {
        _this.enableButton();
      });
    }
  };

  CookiePreferences.prototype.enableButton = function () {
    this.saveButton.disabled = false;
    this.saveButton.innerText = this.saveButtonInitialText;
  };

  CookiePreferences.prototype.disableButton = function () {
    this.saveButton.disabled = true;
    this.saveButton.innerText = this.saveButtonSavedText;
  };

  return CookiePreferences;
}();

var CookieConsent = function () {
  function CookieConsent(options) {
    if (options === void 0) {
      options = {};
    }

    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
  }

  CookieConsent.prototype.init = function () {
    this.cookieNotification.init();
    this.cookiePreferences.init();
  };

  CookieConsent.create = function (options) {
    if (options === void 0) {
      options = {};
    }

    var consent = new CookieConsent(options);
    consent.init();
    return consent;
  };

  return CookieConsent;
}();

export default CookieConsent;
export { CookieConsent, CookieManager, CookieNotification, CookiePreferences };
