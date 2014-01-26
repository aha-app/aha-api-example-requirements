(function() {
  var AhaApi,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AhaApi = AhaApi = (function() {
    function AhaApi(options) {
      this.options = options;
      this.authenticateInPopup = __bind(this.authenticateInPopup, this);
      this.get = __bind(this.get, this);
      this.authenticate = __bind(this.authenticate, this);
    }

    AhaApi.prototype.authenticate = function(callback) {
      if (this.accessToken != null) {
        return callback(this, true, "Authentication success");
      } else {
        return this.authenticateInPopup(callback);
      }
    };

    AhaApi.prototype.get = function(url, params, callback) {
      var _this = this;
      params["access_token"] = this.accessToken;
      return $.get("" + (this.apiUrl()) + url, params, function(result) {
        console.log(result);
        return callback(result);
      });
    };

    AhaApi.prototype.authenticateInPopup = function(callback) {
      var authWindow, pollTimer,
        _this = this;
      authWindow = window.open(this.authUrl(), "aha-auth-window", 'width=800, height=600');
      return pollTimer = setInterval(function() {
        var e, tokenUrl;
        if (authWindow == null) {
          clearInterval(pollTimer);
          return;
        }
        tokenUrl = null;
        try {
          tokenUrl = authWindow.document.URL;
        } catch (_error) {
          e = _error;
        }
        if (tokenUrl.indexOf(_this.options['redirectUri']) !== -1) {
          authWindow.close();
          clearInterval(pollTimer);
          _this.accessToken = _this.extractUrlParam(tokenUrl, 'access_token');
          return callback(_this, true, "Authentication success");
        }
      }, 500);
    };

    AhaApi.prototype.extractUrlParam = function(url, name) {
      var regex, regexS, results;
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      regexS = "[\\?&#]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(url);
      if (results != null) {
        return results[1];
      } else {
        return "";
      }
    };

    AhaApi.prototype.apiUrl = function() {
      return "https://" + this.options['accountDomain'] + ".aha.io/api/v1";
    };

    AhaApi.prototype.authUrl = function() {
      return "https://" + this.options['accountDomain'] + ".aha.io/oauth/authorize?response_type=token&client_id=" + this.options['clientId'] + "&redirect_uri=" + (escape(this.options['redirectUri']));
    };

    return AhaApi;

  })();

}).call(this);
