function urlFriendly(str) {
    if (str === undefined || str == null) {
        return "";
    }
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export default {
    urlFriendly
}