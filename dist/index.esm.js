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
        type = _b.type,
        callbacks = _b.callbacks;

    this.prefix = 'ap';
    this.type = type || 'opt-in';
    this.prefix = prefix || 'ap';
    this.callbacks = callbacks;
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

    if (this.callbacks && this.callbacks.onFunctionalEnabled) {
      this.callbacks.onFunctionalEnabled();
    }
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

    if (this.callbacks && this.callbacks.onAnalyticsEnabled) {
      this.callbacks.onAnalyticsEnabled();
    }
  };

  CookieManager.prototype.disableAnalyticsCookie = function () {
    CookieManager.setCookie(this.prefix + "-analytics", 'false', {
      expires: 365
    });

    if (this.callbacks && this.callbacks.onAnalyticsDisabled) {
      this.callbacks.onAnalyticsDisabled();
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

    if (this.callbacks && this.callbacks.onMarketingEnabled) {
      this.callbacks.onMarketingEnabled();
    }
  };

  CookieManager.prototype.disableMarketingCookie = function () {
    CookieManager.setCookie(this.prefix + "-marketing", 'false', {
      expires: 365
    });

    if (this.callbacks && this.callbacks.onMarketingDisabled) {
      this.callbacks.onMarketingDisabled();
    }
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

    if (this.callbacks && this.callbacks.onAcceptAll) {
      this.callbacks.onAcceptAll();
    }
  };

  return CookieManager;
}();

var ServiceLoader = function () {
  function ServiceLoader(options) {
    if (options === void 0) {
      options = {};
    }

    this.cookieManager = new CookieManager(options);
    this.services = options.services || {};
  }

  ServiceLoader.prototype.loadAnalyticsServices = function () {
    if (this.services.gtm && this.services.gtm.id) {
      this.loadGtm();
    }
  };

  ServiceLoader.prototype.destroyAnalyticsServices = function () {
    if (this.services.gtm && this.services.gtm.id) {
      this.destroyGtm();
    }

    if (this.services.aam) {
      this.destroyAam();
    }

    if (this.services.navitas) {
      this.destroyNavitas();
    }

    window.location.reload();
  };

  ServiceLoader.prototype.loadGtm = function () {
    if (this.hasLoadedGtm()) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      'event': 'gtm.js'
    });
    var firstScript = document.getElementsByTagName('script')[0];
    var script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + this.services.gtm.id;
    firstScript.parentNode.insertBefore(script, firstScript);
  };

  ServiceLoader.prototype.destroyGtm = function () {
    CookieManager.removeCookie('_ga');
    CookieManager.removeCookie('_gid');

    if (this.services.ga && this.services.ga.id) {
      CookieManager.removeCookie("_gat_gtag_" + this.services.ga.id);
    }
  };

  ServiceLoader.prototype.destroyAam = function () {
    CookieManager.removeCookie('aam_uuid');
  };

  ServiceLoader.prototype.destroyNavitas = function () {
    CookieManager.removeCookie('AAMC_navitas_0');
    CookieManager.removeCookie('DST');
    CookieManager.removeCookie('demdex');
    CookieManager.removeCookie('dextp');
    CookieManager.removeCookie('navitas');
  };

  ServiceLoader.prototype.hasLoadedGtm = function () {
    var src = "https://www.googletagmanager.com/gtm.js?id=" + this.services.gtm.id;
    return document.querySelector("script[src=\"" + src + "\"") !== null;
  };

  return ServiceLoader;
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
    this.serviceLoader = new ServiceLoader(options);
  }

  CookieNotification.prototype.init = function () {
    var _this = this;

    this.cookieNotification = document.getElementById('cookie-notification');
    this.cookiesAccept = document.getElementById('cookie-notification__accept');
    this.cookiesDecline = document.getElementById('cookie-notification__decline');

    if (this.cookieNotification !== null && !this.cookieManager.hasFunctionalCookie()) {
      this.showCookieNotification();
    }

    if (this.cookiesAccept !== null) {
      this.cookiesAccept.addEventListener('click', function (event) {
        event.preventDefault();

        _this.cookieManager.acceptAll();

        _this.hideCookieNotification();

        _this.serviceLoader.loadAnalyticsServices();
      });
    }

    if (this.cookiesDecline !== null) {
      this.cookiesDecline.addEventListener('click', function (event) {
        event.preventDefault();

        _this.cookieManager.enableFunctionalCookie();

        _this.hideCookieNotification();

        _this.serviceLoader.destroyAnalyticsServices();
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
    this.serviceLoader = new ServiceLoader(options);
  }

  CookiePreferences.prototype.init = function () {
    var _this = this;

    this.checkboxAnalytics = document.getElementById('cookie-preferences__analytics');
    this.checkboxMarketing = document.getElementById('cookie-preferences__marketing');
    this.saveButton = document.getElementById('cookie-preferences__save');

    if (this.checkboxMarketing !== null) {
      this.checkboxMarketing.checked = this.cookieManager.hasMarketingEnabled();
      this.checkboxAnalytics.addEventListener('change', function () {
        _this.enableButton();
      });
    }

    if (this.checkboxAnalytics !== null) {
      this.checkboxAnalytics.checked = this.cookieManager.hasAnalyticsEnabled();
      this.checkboxMarketing.addEventListener('change', function () {
        _this.enableButton();
      });
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

        if (_this.cookieManager.hasAnalyticsEnabled()) {
          _this.serviceLoader.loadAnalyticsServices();
        } else {
          _this.serviceLoader.destroyAnalyticsServices();
        }
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
    this.cookieManager = new CookieManager(options);
    this.serviceLoader = new ServiceLoader(options);
    this.options = options;
  }

  CookieConsent.prototype.init = function () {
    var _this = this;

    if (this.cookieManager.hasAnalyticsEnabled()) {
      this.serviceLoader.loadAnalyticsServices();
    }

    document.addEventListener('DOMContentLoaded', function () {
      _this.cookieNotification.init();

      _this.cookiePreferences.init();
    });
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
