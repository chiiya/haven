/*!
 * cookie-consent-manager v1.0.0
 * (c) Elisha Witte <elishawitte@gmail.com>
 * Released under the MIT License.
 */
import Cookies from 'js-cookie';

var CookieManager = function () {
  function CookieManager(_a) {
    var prefix = (_a === void 0 ? {} : _a).prefix;
    this.prefix = 'ap';
    this.prefix = prefix || 'ap';
  }

  CookieManager.getCookie = function (name) {
    return Cookies.get(name);
  };

  CookieManager.setCookie = function (name, value, options) {
    Cookies.set(name, value, options);
  };

  CookieManager.removeCookie = function (name) {
    Cookies.remove(name);
  };

  CookieManager.cookieExists = function (name) {
    return Cookies.get(name) !== undefined && Cookies.get(name) !== '';
  };

  CookieManager.prototype.setFunctionalCookie = function (enabled) {
    if (enabled) {
      CookieManager.setCookie(this.prefix + "-functional", enabled.toString(), {
        expires: 365
      });
    } else {
      CookieManager.removeCookie(this.prefix + "-functional");
    }
  };

  CookieManager.prototype.hasFunctionalCookie = function () {
    return CookieManager.cookieExists(this.prefix + "-functional");
  };

  CookieManager.prototype.setAnalyticsCookie = function (enabled) {
    if (enabled) {
      CookieManager.setCookie(this.prefix + "-analytics", enabled.toString(), {
        expires: 365
      });
    } else {
      CookieManager.removeCookie(this.prefix + "-analytics");
    }
  };

  CookieManager.prototype.hasAnalyticsCookie = function () {
    return CookieManager.cookieExists(this.prefix + "-analytics");
  };

  CookieManager.prototype.setMarketingCookie = function (enabled) {
    if (enabled) {
      CookieManager.setCookie(this.prefix + "-marketing", enabled.toString(), {
        expires: 365
      });
    } else {
      CookieManager.removeCookie(this.prefix + "-marketing");
    }
  };

  CookieManager.prototype.hasMarketingCookie = function () {
    return CookieManager.cookieExists(this.prefix + "-marketing");
  };

  CookieManager.prototype.acceptAll = function () {
    this.setFunctionalCookie(true);
    this.setAnalyticsCookie(true);
    this.setMarketingCookie(true);
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

        _this.cookieManager.setFunctionalCookie(true);

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
    this.cookieManager = new CookieManager(options);
    this.checkboxAnalytics = document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = document.getElementById('cookie-preferences__marketing');
    this.saveButton = document.getElementById('cookie-preferences__save');
  }

  CookiePreferences.prototype.init = function () {
    var _this = this;

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingCookie();
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsCookie();
    }

    if (this.saveButton !== null) {
      this.saveButton.addEventListener('click', function () {
        _this.cookieManager.setFunctionalCookie(true);

        if (_this.checkboxMarketing && _this.checkboxMarketing.checked) {
          _this.cookieManager.setMarketingCookie(true);
        } else {
          _this.cookieManager.setMarketingCookie(false);
        }

        if (_this.checkboxAnalytics && _this.checkboxAnalytics.checked) {
          _this.cookieManager.setAnalyticsCookie(true);
        } else {
          _this.cookieManager.setMarketingCookie(false);
        }
      });
    }
  };

  return CookiePreferences;
}();

var CookieConsent = function () {
  function CookieConsent(options) {
    if (options === void 0) {
      options = {};
    }

    this.cookieManager = new CookieManager(options);
    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
  }

  CookieConsent.prototype.init = function () {
    var gtm = dataLayer;

    if (gtm !== undefined) {
      if (this.cookieManager.hasMarketingCookie()) {
        gtm.push({
          event: 'cookie-consent.marketing'
        });
      }

      if (this.cookieManager.hasAnalyticsCookie()) {
        gtm.push({
          event: 'cookie-consent.analytics'
        });
      }
    }

    this.cookieNotification.init();
    this.cookiePreferences.init();
  };

  return CookieConsent;
}();

var index = new CookieConsent();

export default index;
export { CookieConsent, CookieManager, CookieNotification, CookiePreferences };
