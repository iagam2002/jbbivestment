!(function (s) {
    var t,
        i,
        o = { hasPreview: !0, defaultThemeId: "jssDefault", fullPath: "css/", cookie: { expires: "", isManagingLoad: !0 } },
        a = "jss_selected";
    (i = {
        getItem: function (e) {
            return (e && decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"))) || null;
        },
        setItem: function (e, t, o, s, i, a) {
            if (!e || /^(?:expires|max\-age|path|domain|secure)$/i.test(e)) return !1;
            var n = "";
            if (o)
                switch (o.constructor) {
                    case Number:
                        n = o === 1 / 0 ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + o;
                        break;
                    case String:
                        n = "; expires=" + o;
                        break;
                    case Date:
                        n = "; expires=" + o.toUTCString();
                }
            return (document.cookie = encodeURIComponent(e) + "=" + encodeURIComponent(t) + n + (i ? "; domain=" + i : "") + (s ? "; path=" + s : "") + (a ? "; secure" : "")), !0;
        },
        removeItem: function (e, t, o) {
            return !!this.hasItem(e) && ((document.cookie = encodeURIComponent(e) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (o ? "; domain=" + o : "") + (t ? "; path=" + t : "")), !0);
        },
        hasItem: function (e) {
            return !!e && new RegExp("(?:^|;\\s*)" + encodeURIComponent(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
        },
        keys: function () {
            for (var e = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/), t = e.length, o = 0; o < t; o++) e[o] = decodeURIComponent(e[o]);
            return e;
        },
    }),
        ((t = function (e, t) {
            return this.init(e, t);
        }).prototype = {
            $root: null,
            config: {},
            $themeCss: null,
            defaultTheme: null,
            init: function (e, t) {
                (this.$root = e),
                    (this.config = t || {}),
                    this.setDefaultTheme(),
                    this.defaultTheme ? (this.config.cookie && this.checkCookie(), this.config.hasPreview && this.addHoverEvents(), this.addClickEvents()) : this.$root.addClass("jssError error level0");
            },
            setDefaultTheme: function () {
                (this.$themeCss = s("link[id=" + this.config.defaultThemeId + "]")), this.$themeCss.length && (this.defaultTheme = this.$themeCss.attr("href"));
            },
            resetStyle: function () {
                this.updateStyle(this.defaultTheme);
            },
            updateStyle: function (e) {
                this.$themeCss.attr("href", e);
            },
            getFullAssetPath: function (e) {
                return this.config.fullPath + e + ".css";
            },
            checkCookie: function () {
                var e;
                this.config.cookie && this.config.cookie.isManagingLoad && (e = i.getItem(a)) && ((newStyle = this.getFullAssetPath(e)), this.updateStyle(newStyle), (this.defaultTheme = newStyle));
            },
            addHoverEvents: function () {
                var t = this;
                this.$root.find("a").hover(
                    function () {
                        var e = s(this).data("theme"),
                            e = t.getFullAssetPath(e);
                        t.updateStyle(e);
                    },
                    function () {
                        t.resetStyle();
                    }
                );
            },
            addClickEvents: function () {
                var o = this;
                this.$root.find(".setColor").on("click", function () {
                    var e = s(this).data("theme"),
                        t = o.getFullAssetPath(e);
                    o.updateStyle(t), (o.defaultTheme = t), o.config.cookie && i.setItem(a, e, o.config.cookie.expires, "/");
                });
            },
        }),
        (s.fn.styleSwitcher = function (e) {
            return new t(this, s.extend(!0, o, e));
        }),
        s(function () {
            function e() {
                (styleCookieVal = s("body").hasClass("dark-mode-on") ? "dark" : "light"), Cookies.set("styleCookieName", styleCookieVal, { expires: 7 }), Cookies.set("styleCookieName", styleCookieVal);
            }
            s("#color-switcher ul").styleSwitcher({ defaultThemeId: "papr-dark-css", hasPreview: !1, fullPath: "css/", cookie: { expires: 2628e3, isManagingLoad: !0 } }),
                "dark" == Cookies.get("styleCookieName") ? s("body").addClass("dark-mode-on") : (Cookies.get("styleCookieName"), s("body").removeClass("active-light-mode"));
            var t = Cookies.get("styleCookieName");
            "dark" == t
                ? (s(".color-switcher").find(".setColor.dark").addClass("active"), s("body").removeClass("active-light-mode").addClass("dark-mode-on"))
                : "light" == t
                ? (s(".color-switcher").find(".setColor.light").addClass("active"), s("body").removeClass("dark-mode-on").addClass("active-light-mode"))
                : s("body").hasClass("dark-mode-on")
                ? (s(".color-switcher").find(".setColor.light").removeClass("active"), s(".color-switcher").find(".setColor.dark").addClass("active"))
                : (s(".color-switcher").find(".setColor.dark").removeClass("active"), s(".color-switcher").find(".setColor.light").addClass("active")),
                s(".color-switcher .setColor").on("click", function () {
                    s(this).closest("ul").find("li").siblings().find(".active").removeClass("active"), s(this).addClass("active"), e();
                }),
                s(".color-switcher .setColor.dark").on("click", function () {
                    s("body").removeClass("active-light-mode").addClass("dark-mode-on"), e();
                }),
                s(".color-switcher .setColor.light").on("click", function () {
                    s("body").removeClass("dark-mode-on").addClass("active-light-mode"), e();
                });
        });
})(jQuery);
