// Vendor scripts go here
// -----------------------
import { IWindowEx } from 'app/interfaces';
import 'jquery';
import '../vendor/jquery-ui/development-bundle/ui/jquery-ui.custom.js';
import '../vendor/jquery.confirm/jquery.confirm.min.js';
import '../vendor/jquery.hammer/jquery.hammer.js';
import '../vendor/jquery-contextmenu/jquery.contextMenu.js';
// import '../vendor/select2/select2.full.min.js';
import '../vendor/select2/js/select2.full.js';

// CryptoJS
import '../vendor/cryptojs/rollups/sha512.js';
// DOM4 Polyfills for IE
import '../platform/helpers/dom4.js';

require('datatables.net')(window, $);
require('datatables.net-bs')(window, $);
require('datatables.net-buttons')(window, $);
require('datatables.net-buttons/js/buttons.colVis.js')(window, $); // Column visibility
require('datatables.net-buttons/js/buttons.html5.js')(window, $);  // HTML 5 file export
require('datatables.net-buttons/js/buttons.flash.js')(window, $);  // Flash file export
require('datatables.net-buttons/js/buttons.print.js')(window, $);  // Print view button
require('datatables.net-colreorder')(window, $);
require('datatables.net-fixedcolumns')(window, $);
require('datatables.net-fixedheader')(window, $);
require('datatables.net-keytable')(window, $);
require('datatables.net-responsive')(window, $);
require('datatables.net-scroller')(window, $);
require('datatables.net-autofill')(window, $);
require('datatables.net-select')(window, $);

import '../vendor/bootstrap-dialog/bootstrap-dialog.min';
import * as toastr from '../vendor/toastr/toastr';
(<IWindowEx>window).toastr = toastr;

// Hammjer.js
import 'hammerjs';

// Lodash
import * as _ from 'lodash';
// Themes
import 'bootstrap-loader';
import 'font-awesome-sass-loader';

require('../vendor/bootstrap.fileinput/js/fileinput.min');
require('../vendor/bootstrap-filestyle/src/bootstrap-filestyle.min');

// Prevent Ghost Clicks (for Hammer.js)
import '../platform/helpers/browser-events';

// Circular JSON (for better serializing of complex objects)
import 'circular-json';

