'use strict';
let constants = {
	COMMANDS : { on   : 0x0001,
                      off  : 0x0002,
                      bell : 0x0004,
                      dim  : 0x0010,
                      up   : 0x0080,
                      down : 0x0100
                  },
	METHODS : {
        0x0001: 'on',
        0x0002: 'off',
        0x0004: 'bell',
        0x0010: 'dim',
        0x0080: 'up',
        0x0100: 'down'
    },
	DEFAULT_LOGGER : {  error   : function(msg, props) { console.log(msg); if (!!props) console.log(props);},
						warning : function(msg, props) { console.log(msg); if (!!props) console.log(props);},
						notice  : function(msg, props) { console.log(msg); if (!!props) console.log(props);},
						info    : function(msg, props) { console.log(msg); if (!!props) console.log(props);},
						debug   : function(msg, props) { console.log(msg); if (!!props) console.log(props);}
                  }
};
constants.SUPPORTED_METHODS = Object.keys(constants.COMMANDS).reduce(function(previous, key) { return previous + constants.COMMANDS[key]; }, 0);

module.exports = constants;