const moment = require("moment")

module.exports = {
    formatDate: function(Date, format) {
        return moment(Date).format(format)
    },

    turncate: function(str, len) {
        if (str.length > len) {
            let new_str = str + ' ';
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(' '));
            new_str = new_str.length > 0 ? new_str : str.substr(0, len);

            return new_str + '...';
        }

        return str;
    },

    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
}