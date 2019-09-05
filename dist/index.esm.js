/*!
 * haven v1.0.0
 * (c) Elisha Witte <elishawitte@gmail.com>
 * Released under the MIT License.
 */
import Cookies from 'js-cookie';

var EventBus = function () {
  function EventBus() {
    this.subscriptions = {};
  }

  EventBus.prototype.on = function (event, callback) {
    var _this = this;

    var id = Symbol('id');
    console.log(id);

    if (this.subscriptions[event] === undefined) {
      this.subscriptions[event] = {};
    }

    this.subscriptions[event][id] = callback;
    return {
      unsubscribe: function unsubscribe() {
        delete _this.subscriptions[event][id];
      }
    };
  };

  EventBus.prototype.emit = function (event, payload) {
    console.log(event);

    if (this.subscriptions[event] === undefined) {
      return;
    }

    for (var _i = 0, _a = Object.getOwnPropertySymbols(this.subscriptions[event]); _i < _a.length; _i++) {
      var id = _a[_i];
      console.log('Found', id);
      this.subscriptions[event][id](payload);
    }
  };

  return EventBus;
}();

var EventBus$1 = new EventBus();

var CookieManager = function () {
  function CookieManager(_a) {
    var _b = _a === void 0 ? {} : _a,
        prefix = _b.prefix,
        type = _b.type;

    this.type = type || 'opt-in';
    this.prefix = prefix;
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
    CookieManager.setCookie(this.getPrefixedCookieName('functional'), 'true', {
      expires: 365
    });
    EventBus$1.emit('functional-enabled');
  };

  CookieManager.prototype.disableFunctionalCookie = function () {
    CookieManager.removeCookie(this.getPrefixedCookieName('functional'));
  };

  CookieManager.prototype.hasFunctionalCookie = function () {
    return CookieManager.cookieExists(this.getPrefixedCookieName('functional'));
  };

  CookieManager.prototype.enableAnalyticsCookie = function () {
    CookieManager.setCookie(this.getPrefixedCookieName('analytics'), 'true', {
      expires: 365
    });
    EventBus$1.emit('analytics-enabled');
  };

  CookieManager.prototype.disableAnalyticsCookie = function () {
    CookieManager.setCookie(this.getPrefixedCookieName('analytics'), 'false', {
      expires: 365
    });
    EventBus$1.emit('analytics-disabled');
  };

  CookieManager.prototype.hasAnalyticsEnabled = function () {
    var cookie = CookieManager.getCookie(this.getPrefixedCookieName('analytics'));

    if (this.type === 'opt-in') {
      return cookie === 'true';
    }

    return cookie === undefined || cookie === 'true';
  };

  CookieManager.prototype.enableMarketingCookie = function () {
    CookieManager.setCookie(this.getPrefixedCookieName('marketing'), 'true', {
      expires: 365
    });
    EventBus$1.emit('marketing-enabled');
  };

  CookieManager.prototype.disableMarketingCookie = function () {
    CookieManager.setCookie(this.getPrefixedCookieName('marketing'), 'false', {
      expires: 365
    });
    EventBus$1.emit('marketing-enabled');
  };

  CookieManager.prototype.hasMarketingEnabled = function () {
    var cookie = CookieManager.getCookie(this.getPrefixedCookieName('marketing'));

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

  CookieManager.prototype.getPrefixedCookieName = function (name) {
    if (this.prefix !== undefined) {
      return this.prefix + "-" + name;
    }

    return name;
  };

  return CookieManager;
}();

var CookieNotification = function () {
  function CookieNotification(options) {
    this.cookieNotification = null;
    this.cookiesAccept = null;
    this.cookiesDecline = null;
    this.cookieManager = new CookieManager(options);
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
    this.checkboxAnalytics = null;
    this.checkboxMarketing = null;
    this.saveButton = null;
    this.saveButtonInitialText = '';
    this.saveButtonSavedText = '';
    this.cookieManager = new CookieManager(options);
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

var ServiceLoader = function () {
  function ServiceLoader(options) {
    this.services = options.services || {};
  }

  ServiceLoader.prototype.loadAnalyticsServices = function () {
    if (this.services.gtm && this.services.gtm.id) {
      this.loadGtm();
    }

    EventBus$1.emit('services-loaded');
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

  ServiceLoader.prototype.hasLoadedGtm = function () {
    var src = "https://www.googletagmanager.com/gtm.js?id=" + this.services.gtm.id;
    return document.querySelector("script[src=\"" + src + "\"") !== null;
  };

  return ServiceLoader;
}();

var ConfigurationResolver = function () {
  function ConfigurationResolver() {}

  ConfigurationResolver.resolve = function (options) {
    return Object.assign({
      type: 'opt-in',
      injectServices: true
    }, options);
  };

  return ConfigurationResolver;
}();

var ConsentRevoke = function () {
  function ConsentRevoke(options) {
    this.services = options.services || {};
  }

  ConsentRevoke.prototype.destroyAnalyticsServices = function () {
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

  ConsentRevoke.prototype.destroyGtm = function () {
    CookieManager.removeCookie('_ga');
    CookieManager.removeCookie('_gid');
    CookieManager.removeCookie('_gat');

    if (this.services.ga && this.services.ga.id) {
      CookieManager.removeCookie("_dc_gtm_" + this.services.ga.id);
      CookieManager.removeCookie("_gac_" + this.services.ga.id);
      CookieManager.removeCookie("_gat_gtag_" + this.services.ga.id);
      CookieManager.removeCookie("_gat_" + this.services.ga.id);
    }
  };

  ConsentRevoke.prototype.destroyAam = function () {
    CookieManager.removeCookie('aam_uuid');
  };

  ConsentRevoke.prototype.destroyNavitas = function () {
    CookieManager.removeCookie('AAMC_navitas_0');
    CookieManager.removeCookie('DST');
    CookieManager.removeCookie('demdex');
    CookieManager.removeCookie('dextp');
    CookieManager.removeCookie('navitas');
  };

  return ConsentRevoke;
}();

var Haven = function () {
  function Haven(options) {
    if (options === void 0) {
      options = {};
    }

    var config = ConfigurationResolver.resolve(options);
    this.cookieNotification = new CookieNotification(config);
    this.cookiePreferences = new CookiePreferences(config);
    this.cookieManager = new CookieManager(config);
    this.serviceLoader = new ServiceLoader(config);
    this.consentRevoke = new ConsentRevoke(config);
    this.options = config;
  }

  Haven.prototype.init = function () {
    var _this = this;

    document.addEventListener('DOMContentLoaded', function () {
      _this.cookieNotification.init();

      _this.cookiePreferences.init();
    });
    this.registerDefaultListeners();
    this.checkInitialState();
  };

  Haven.prototype.checkInitialState = function () {
    if (this.cookieManager.hasFunctionalCookie()) {
      EventBus$1.emit('functional-enabled');
    }

    if (this.cookieManager.hasAnalyticsEnabled()) {
      EventBus$1.emit('analytics-enabled');
    }

    if (this.cookieManager.hasMarketingEnabled()) {
      EventBus$1.emit('marketing-enabled');
    }
  };

  Haven.prototype.registerDefaultListeners = function () {
    var _this = this;

    EventBus$1.on('analytics-enabled', function () {
      if (_this.options.injectServices) {
        _this.serviceLoader.loadAnalyticsServices();
      }
    });
    EventBus$1.on('analytics-disabled', function () {
      _this.consentRevoke.destroyAnalyticsServices();
    });
  };

  Haven.on = function (event, callback) {
    return EventBus$1.on(event, callback);
  };

  Haven.create = function (options) {
    if (options === void 0) {
      options = {};
    }

    var haven = new Haven(options);
    haven.init();
    return haven;
  };

  return Haven;
}();

window.Haven = Haven;

export default Haven;
export { CookieManager, CookieNotification, CookiePreferences, Haven };
