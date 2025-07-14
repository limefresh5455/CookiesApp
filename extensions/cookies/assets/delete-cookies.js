function byecookies() {
    var cookies = $.cookie();
    for (var cookie in cookies) {
        $.removeCookie(cookie);
    }
}
setTimeout(() => {
    byecookies();
}, 1000)
