/*jslint browser: true, devel: true */
/*global $, jQuery, pdp */

window.pdp = (function (my, $) {
    "use strict";

    my.init_login = function (loginDivId) {

        var user, providers, signupUrls, loginButton, form;

        // Set up login splash
        form = document.body.appendChild(pdp.getLoginForm());
        form = $("#login-dialog").dialog({
            appendTo: "#main",
            autoOpen: false,
            title: "login",
            width: "40%",
            modal: true,
            dialogClass: "no-title",
            buttons: {
                "Close": function () {
                    $(this).dialog("close");
                }
            }
        });

        // Create login/logout buttons
        loginButton = document.getElementById(loginDivId).appendChild(
            pdp.createLink("login-button", undefined, undefined, "Login with OpenAuthentication")
        );
        loginButton = $(loginButton);
        loginButton.prop("loggedIn", false);
        loginButton.click(function(){form.dialog("open")});

        // Set up OAuth with Oauth.io
        OAuth.initialize('xtOY6mmfmnDcnKqBfV4O8oIScew');

        return loginButton;
    };

    my.login = function(email) {

        // Create logout button
        $("#login-button").prop("loggedIn", true);
        $("#login-button").hide();
        var link = document.createElement("a");
        link.id = "logout-button"
        link.appendChild(document.createTextNode("Logout as " + email));
        $(link).click(function() {
            pdp.logout();
         });
        document.getElementById("login-button").parentElement.appendChild(link);

        // Log into the server
        $.ajax({
            type: "POST",
            url: pdp.app_root + '/user/login',
            data: {
                "email": email
            }
        })
    };

    my.logout = function() {
        OAuth.clearCache();
        $.ajax({
            url: pdp.app_root + '/user/logout',
        })
        $(document.getElementById("logout-button")).remove();
        $("#login-button").show();
    };

    my.createCookie = function (name, value, days) {
        var expires, date;
        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };

    my.readCookie = function (name) {
        var nameEQ, ca, i, c;
        nameEQ = name + "=";
        ca = document.cookie.split(";");
        for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };

    my.eraseCookie = function (name) {
        pdp.createCookie(name, "", -1);
    };

    my.getLoginForm = function () {

        var loginDialog = pdp.createDiv('login-dialog');

        function createLoginFieldset() {
            var div = pdp.createDiv();

            var providerButton = function(provider) {
                var button = document.createElement("button");
                button.className = "zocial" + provider;
                button.appendChild(document.createTextNode('Login with ' + provider));
                button.onclick = function () {
                    $("#login-dialog").dialog("close");
                    OAuth.popup(provider, {cache: true})
                    .done(function(result) {
                        result.me()
                        .done(function(user) {
                            console.log(user);
                            pdp.login(user.email);
                            console.log(user.email);
                        })
                        .fail(function(err) {
                            console.log("Errors retrieving user data", err);
                        });
                    })
                    .fail(function(err){
                        console.log("Errors with authentication process", err)
                    });
                }
                return button;
            };

            div.appendChild(providerButton('google'));
            div.appendChild(providerButton('linkedin'));
            div.appendChild(providerButton('github'));
            div.appendChild(providerButton('dropbox'));
            return div;
        }

        function createWorksFieldset() {
            var div = pdp.createDiv();
            var h = div.appendChild(document.createElement("h2"));
            h.appendChild(document.createTextNode("How it works"));

            var p = div.appendChild(document.createElement("p"));
            p.appendChild(document.createTextNode("Click \"Login\" to use an existing OpenID account. " +
                                                  "A new window will open asking you to sign in with the account provider. " +
                                                  "Once signed in, you will be returned to the data portal. " +
                                                  "PCIC uses OpenID to allow us to communicate with users via e-mail. " +
                                                  "If you don't have an OpenID account, click \"Sign up\"." +
                                                  "For information about OpenID click "));
            var a = document.createElement("a");
            a.appendChild(document.createTextNode("here"));
            a.href = "http://openid.net/get-an-openid/what-is-openid/";
            p.appendChild(a);
            return div;
        }

        function createWhyFieldset() {
            var div = pdp.createDiv();
            var h = div.appendChild(document.createElement('h2'));
            h.appendChild(document.createTextNode("Why do you want my e-mail address?"));
            var p = div.appendChild(document.createElement("p"));
            p.appendChild(document.createTextNode("PCIC will use your address only to contact you in the event major errors  are found in the data or when major changes to the data in the portal are made. " +
                                                  "Your e-mail address is the only personal information that PCIC will gather and will be kept secure."));
            return div;
        }

        loginDialog.appendChild(createLoginFieldset());
        loginDialog.appendChild(createWorksFieldset());
        loginDialog.appendChild(createWhyFieldset());
        return loginDialog;
    };

    my.checkAuthBeforeDownload = function(e) {
	var loginButton = e.data;
        if (!$(loginButton).prop("loggedIn")) {
            alert("Please log in before downloading data");
            e.preventDefault();
        }
    };

    return my;
}(window.pdp, jQuery));
