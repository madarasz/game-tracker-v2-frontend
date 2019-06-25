function urlFriendly(str) {
    if (str === undefined || str == null) {
        return "";
    }
    const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœøṕŕßśșțùúüûǘẃẍÿź';
    const b = 'aaaaaaaaceeeeghiiiimnnnooooooprssstuuuuuwxyz';
    const p = new RegExp(a.split('').join('|'), 'g');
    return str.toLowerCase().replace(p, c => b.charAt(a.indexOf(c))).replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

export default {
    urlFriendly
}