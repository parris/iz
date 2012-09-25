/*global module*/
var zuul = zuul || {};

(function () {
    'use strict';
    var locales = {
        sq: {},         //Albanian
        sq_AL: {},      //  Albania
        ar: {},         //Arabic
        ar_DZ: {},      //  Algeria
        ar_BH: {},      //  Bahrain
        ar_EG: {},      //  Egypt
        ar_IQ: {},      //  Iraq
        ar_JO: {},      //  Jordan,
        ar_KW: {},      //  Kuwait
        ar_LB: {},      //  Lebanon
        ar_LY: {},      //  Libya
        ar_MA: {},      //  Morocco
        ar_OM: {},      //  Oman
        ar_QA: {},      //  Qatar
        ar_SA: {},      //  Saudi Arabia
        ar_SD: {},      //  Sudan
        ar_SY: {},      //  Syria
        ar_TN: {},      //  Tunisia
        ar_AE: {},      //  United Arab Emirates
        ar_YE: {},      //  Yemen
        be: {},         //Belarusian
        be_BY: {},      //  Belarus
        bg: {},         //Bulgarian
        bg_BG: {},      //  Bulgaria
        ca: {},         //Catalan
        ca_ES: {},      //  Spain
        zh: {},         //Chinese
        zh_CN: {},      //  China
        zh_HK: {},      //  Hong Kong
        zh_SG: {},      //  Singapore
        zh_TW: {},      //  Taiwan
        hr: {},         //Croatian
        hr_HR: {},      //  Croatia
        cs: {},         //Czech
        cs_CZ: {},      //  Czech Republic
        da: {},         //Danish
        da_DK: {},      //  Denmark
        nl: {},         //Dutch
        nl_BE: {},      //  Belgium
        nl_NL: {},      //  Netherlands
        en: {},         //English
        en_AU: {},      //  Australia
        en_CA: {},      //  Canada
        en_IN: {},      //  India
        en_IE: {},      //  Ireland
        en_MT: {},      //  Malta
        en_NZ: {},      //  New Zealand
        en_PH: {},      //  Philippines
        en_SG: {},      //  Singapore
        en_GB: {},      //  United Kingdom
        en_US: {},      //  United States
        et: {},         //Estonian
        et_EE: {},      //  Estonia
        fi: {},         //Finish
        fi_FI: {},      //  Finland
        fr: {},         //French
        fr_BE: {},      //  Belgium
        fr_CA: {},      //  Canada
        fr_FR: {},      //  France
        fr_LU: {},      //  Luxembourg
        fr_CH: {},      //  Switzerland
        de: {},         //German
        de_AT: {},      //  Austria
        de_DE: {},      //  Germany
        de_LU: {},      //  Luxembourg
        de_CH: {},      //  Switzerland
        el: {},         //Greek
        el_CY: {},      //  Cyprus
        el_GR: {},      //  Greece
        iw: {},         //Hebrew
        iw_IL: {},      //  Israel
        hi_IN: {},      //Hindi India
        hu: {},         //Hungarian
        hu_HU: {},      //  Hungary
        is: {},         //Icelandic
        is_IS: {},      //  Iceland
        in: {},         //Indonesian
        in_ID: {},      //  Indonesia
        ga: {},         //Irish
        ga_IE: {},      //  Ireland
        it: {},         //Italian
        it_IT: {},      //  Italy
        it_CH: {},      //  Switzerland
        ja: {},         //Japanese
        ja_JP: {},      //  Japan
        ja_JP_JP: {},   //  Japan, JP
        ko: {},         //Korean
        ko_KR: {},      //  South Korea
        lv: {},         //Latvian
        lv_LV: {},      //  Latvia
        lt: {},         //Lithuanian
        lt_LT: {},      //  Lithuania
        mk: {},         //Macedonian
        mk_MK: {},      //  Macedonia
        ms: {},         //Malay
        ms_MY: {},      //  Malaysia
        mt: {},         //Maltese
        mt_MT: {},      //  Malta
        no: {},         //Norwegian
        no_NO: {},      //  Norway,
        no_NO_NY: {},   //  Noway, Nynorsk
        pl: {},         //Polish
        pl_PL: {},      //  Poland
        pt: {},         //Portuguese
        pt_BR: {},      //  Brazil
        pt_PT: {},      //  Portugal
        ro: {},         //Romanian
        ro_RO: {},      //  Romania
        ru: {},         //Russian
        ru_RU: {},      //  Russia
        sr: {},         //Serbian
        sr_BA: {},      //  Bosnia and Herzegovina
        sr_ME: {},      //  Montenegro
        sr_CS: {},      //  Serbia and Montenegro
        sr_RS: {},      //  Serbia
        sk: {},         //Slovak
        sk_SK: {},      //  Slovakia
        sl: {},         //Slovenian
        sl_SI: {},      //  Slovenia
        es: {},         //Spanish
        es_AR: {},      //  Argentina
        es_BO: {},      //  Bolivia
        es_CL: {},      //  Chile
        es_CO: {},      //  Colombia
        es_CR: {},      //  Costa Rica
        es_DO: {},      //  Dominican Republic
        es_EC: {},      //  Ecuador
        es_SV: {},      //  El Salvador
        es_GT: {},      //  Guatemala
        es_HN: {},      //  Honduras
        es_MX: {},      //  Mexico
        es_NI: {},      //  Nicaragua
        es_PA: {},      //  Panama
        es_PY: {},      //  Paraguay
        es_PE: {},      //  Peru
        es_PR: {},      //  Puerto Rico
        es_ES: {},      //  Spain
        es_US: {},      //  United States
        es_UY: {},      //  Uruguay
        es_VE: {},      //  Venezuela
        sv: {},         //Swedish
        sv_SE: {},      //  Sweden
        th: {},         //Thai
        th_TH: {},      //  Thailand
        th_TH_TH: {},   //  Thailand,TH
        tr: {},         //Turkish
        tr_TR: {},      //  Turkey
        uk: {},         //Ukrainian
        uk_UA: {},      //  Ukraine
        vi: {},         //Vietnamese
        vi_VN: {}      //Vietnam
    };

    function zuul_alphaNumeric(value) {
        return (/^[a-z0-9]+$/i).test(value);
    }

    function zuul_number(val) {
        if ((/^[\-]?[0-9]+[\.]?[0-9]+$/).test(val)) {
            return true;
        }
        return false;
    }

    function zuul_between(val, start, end) {
        if ((typeof val === "object" || typeof val === "function") ||
                (typeof start === "object" || typeof start === "function") ||
                (typeof end === "object" || typeof end === "function")) {
            return false;
        }

        if ((val >= start && val <= end)) {
            return true;
        }
        return false;
    }

    function zuul_boolean(value) {
        if (typeof value === "boolean" || (typeof value === "number" && (value === 0 || value === 1))) {
            return true;
        }
        return false;
    }

    function zuul_int(value, allowDecimal) {
        if (typeof allowDecimal !== "boolean") {
            allowDecimal = false;
        }

        if (!allowDecimal) {
            return (/^\s*(\+|-)?\d+\s*$/).test(value);
        } else if (zuul_number(value) && value % 1 === 0) {
            return true;
        }
        return false;
    }

    /**
     * @author Phil Green (ShirtlessKirk) https://gist.github.com/2134376
     */
    function luhnChk(luhn) {
        var len = luhn.length,
            mul = 0,
            prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
            sum = 0;

        while (len--) {
            sum += prodArr[mul][parseInt(luhn.charAt(len), 10)];
            mul ^= 1;
        }

        return sum % 10 === 0 && sum > 0;
    }

    /**
     * Returns the name of the class that the object is
     * @author Ateş Göral: http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
     * @param object
     * @return String name of the class
     */
    function zuul_getObjectClass(obj) {
        if (obj && obj.constructor && obj.constructor.toString) {
            var arr = obj.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length === 2) {
                return arr[1];
            }
        }

        return undefined;
    }

    function zuul_cc(value) {
        if (typeof value !== "string" && typeof value !== "number") {
            return false;
        }

        value = value.replace(/[ -]/g, ""); // normalizing
        if (zuul_int(value)) {
            return luhnChk(value);
        }
        return false;
    }

    /**
     * TODO: maybe provide format and use: http://www.mattkruse.com/javascript/date/source.html
     * but that seems in elegant. Then again dates in general are in elegant... *shrug*
     * @param value
     * @return {Boolean}
     */
    function zuul_date(value) {
        if (zuul_getObjectClass(value) === "Date") {
            return true;
        }

        if (new Date(value).toString() !== "Invalid Date" || !isNaN(new Date(value))) { //some IEs return NaN
            return true;
        }

        return false;
    }

    function zuul_decimal(value) {
        if (zuul_number(value) && value % 1 !== 0) {
            return true;
        }
        return false;
    }

    /**
     * Basically just expects the @ symbol. There was a full discussion about it here:
     * http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
     *
     * Might make this more complicated in the future... or not *shrug*
     * @param value
     * @return {Boolean}
     */
    function zuul_email(value) {
        if (typeof value !== "string") {
            return false;
        }
        return (/\S+@\S+/).test(value);
    }

    function zuul_extension(obj1, obj2) {
        var key;
        if (typeof obj1 !== "object" || typeof obj2 !== "object") {
            return false;
        }

        for (key in obj2) {
            if (obj2.hasOwnProperty(key) && typeof obj1[key] === "undefined") {
                return false;
            }
        }

        return true;
    }

    /**
     * Accepts anything.anything.anything.ext.ext and matches the last ext
     * @param value a file extension of a file name
     */
    function zuul_fileExtension(validExtensions, value) {
        var ext;

        if (typeof validExtensions !== "object"
                || typeof validExtensions.indexOf === "undefined"
                || typeof value !== "string") {
            return false;
        }

        ext = value.split(".").pop().toLowerCase(); //split by '.' and get me the last thing, then lowercase it
        if (validExtensions.indexOf(ext) !== -1) {
            return true;
        }
        return false;
    }

    function zuul_fileExtensionAudio(value) {
        var validExtensions = ["mp3", "ogg", "aac", "wav"];
        return zuul_fileExtension(validExtensions, value);
    }

    function zuul_fileExtensionImage(value) {
        var validExtensions = ["gif", "png", "jpeg", "jpg", "svg", "bmp"];
        return zuul_fileExtension(validExtensions, value);
    }

    function zuul_fileExtensionVideo(value) {
        var validExtensions = ["mp4", "ogv", "m4v", "mov", "avi"];
        return zuul_fileExtension(validExtensions, value);
    }

    function zuul_inArray(arr, value) {
        if (typeof arr !== "object"
                || typeof arr.indexOf === "undefined") {
            return false;
        }

        if (arr.indexOf(value) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * Matches IPv4, IPv6 or hostname
     * @author Mikulas Dite http://stackoverflow.com/questions/9208814/validate-ipv4-ipv6-and-hostname
     * @param str
     * @return boolean
     */
    function zuul_ip(str) {
        var re = (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::))))$/);
        return re.test(str);
    }

    function zuul_minLength(val, len) {
        if ((typeof val === "string"
                || typeof val === "object")
                && typeof val.length !== "undefined"
                && zuul_int(len)
                && val.length >= len) {
            return true;
        }

        return false;
    }

    function zuul_maxLength(val, len) {
        if ((typeof val === "string"
                || typeof val === "object")
                && typeof val.length !== "undefined"
                && zuul_int(len)
                && val.length <= len) {
            return true;
        }

        return false;
    }

    /**
     * Checks if some string is in a monetary format.
     * @param str moniesssssss
     * @param format A RegExp or a Locale
     * @return {Boolean}
     */
    function zuul_money(str, format) {
        var i = 0,
            form = "";
        if (typeof str === "string" && (format instanceof RegExp
                || (typeof format === "object" && typeof format.length !== "undefined"))) {

            if (format instanceof RegExp && format.test(str)) {
                return true;
            }

            return true;
        }
        return false;
    }

    //This is just static, no need to make a new instance here
    zuul.alphaNumeric = zuul_alphaNumeric;
    zuul.between = zuul_between;
    zuul.boolean = zuul_boolean;
    zuul.cc = zuul_cc;
    zuul.date = zuul_date;
    zuul.decimal = zuul_decimal;
    zuul.email = zuul_email;
    zuul.extension = zuul_extension;
    zuul.fileExtension = zuul_fileExtension;
    zuul.fileExtensionAudio = zuul_fileExtensionAudio;
    zuul.fileExtensionImage = zuul_fileExtensionImage;
    zuul.fileExtensionVideo = zuul_fileExtensionVideo;
    zuul.inArray = zuul_inArray;
    zuul.int = zuul_int;
    zuul.ip = zuul_ip;
    zuul.minLength = zuul_minLength;
    zuul.maxLength = zuul_maxLength;
    zuul.money = zuul_money;
}());

module.exports = zuul;
