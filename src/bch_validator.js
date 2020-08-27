var cryptoUtils = require('./crypto/utils');
var bech32 = require('./crypto/bech32');
var BTCValidator = require('./bitcoin_validator');

function validateAddress(address, currency, networkType) {
    var prefix = 'bitcoincash';
    var regexp = new RegExp(currency.regexp);
    var raw_address;

    var res = address.split(':');
    if (currency.symbol === 'bch') {
        // allow only addresses with prefix bitcoincash for BCH
        if (res.length !== 2 && res[0] !== 'bitcoincash') {
            return false;
        }
        raw_address = res[1];
    } else {
        if (res.length > 2) {
            return false;
        }
        if (res.length === 1) {
            raw_address = address
        } else {
            if (res[0] !== 'bitcoincash') {
                return false;
            }
            raw_address = res[1];
        }
    }

    if (!regexp.test(raw_address)) {
        return false;
    }

    if (raw_address.toLowerCase() != raw_address && raw_address.toUpperCase() != raw_address) {
        return false;
    }

    var decoded = cryptoUtils.base32.b32decode(raw_address);
    if (networkType === 'testnet') {
        prefix = 'bchtest';
    }

    try {
        if (bech32.verifyChecksum(prefix, decoded)) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

module.exports = {
    isValidAddress: function (address, currency, networkType) {
        return validateAddress(address, currency, networkType) ||
            (currency.symbol !== 'bch' && BTCValidator.isValidAddress(address, currency, networkType));
    }
}