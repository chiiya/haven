/*!
 * cookie-consent-manager v1.0.0
 * (c) Elisha Witte <elishawitte@gmail.com>
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Cookies = _interopDefault(require('js-cookie'));

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
      this.cookiesAccept.addEventListener('click', function () {
        _this.cookieManager.acceptAll();

        _this.hideCookieNotification();
      });
    }

    if (this.cookiesDecline !== null) {
      this.cookiesDecline.addEventListener('click', function () {
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
    this.cookieManager = new CookieManager(options);
    this.checkboxAnalytics = document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = document.getElementById('cookie-preferences__marketing');
  }

  CookiePreferences.prototype.init = function () {
    var _this = this;

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingCookie();
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsCookie();
    }

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.addEventListener('change', function (event) {
        _this.cookieManager.setMarketingCookie(_this.checkboxMarketing.checked);
      });
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.addEventListener('change', function (event) {
        _this.cookieManager.setAnalyticsCookie(_this.checkboxAnalytics.checked);
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

    this.cookieNotification = new CookieNotification(options);
    this.cookiePreferences = new CookiePreferences(options);
  }

  CookieConsent.prototype.init = function () {
    this.cookieNotification.init();
    this.cookiePreferences.init();
  };

  return CookieConsent;
}();

var index = new CookieConsent();

exports.CookieConsent = CookieConsent;
exports.CookieManager = CookieManager;
exports.CookieNotification = CookieNotification;
exports.CookiePreferences = CookiePreferences;
exports.default = index;
