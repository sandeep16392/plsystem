function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
  /***/
  "./$$_lazy_route_resource lazy recursive":
  /*!******************************************************!*\
    !*** ./$$_lazy_route_resource lazy namespace object ***!
    \******************************************************/

  /*! no static exports found */

  /***/
  function $$_lazy_route_resourceLazyRecursive(module, exports) {
    function webpackEmptyAsyncContext(req) {
      // Here Promise.resolve().then() is used instead of new Promise() to prevent
      // uncaught exception popping up in devtools
      return Promise.resolve().then(function () {
        var e = new Error("Cannot find module '" + req + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      });
    }

    webpackEmptyAsyncContext.keys = function () {
      return [];
    };

    webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
    module.exports = webpackEmptyAsyncContext;
    webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/PLApproval/PLApproval.component.html":
  /*!********************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/PLApproval/PLApproval.component.html ***!
    \********************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppPLApprovalPLApprovalComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"card row\">\n  <div class=\"card-header\">\n    <h5 class=\"card-title\">P&L Approval</h5><br>\n    <h6 class=\"card-subtitle mb-2 text-muted\">Product Controller to enter commentary and approval per desk</h6>\n  </div>\n</div>\n<div class=\"card-body\">\n  <form [formGroup]=\"queryForm\">\n    <div class=\"row align-items-center\">\n      <div class=\"col-4\">\n        <div class=\"row align-items-center\">\n          <div class=\"col-2\">\n            <label class=\"my-1 mr-2\" for=\"desk\">Desk</label>\n          </div>\n          <div class=\"col-6\">\n            <select formControlName=\"desk\" required  class=\"custom-select my-1 mr-sm-2\" id=\"desk\">\n              <option *ngFor=\"let desk of desks\" value=\"{{desk.deskId}}\">{{desk.desk}}</option>\n            </select>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-4\">\n        <div class=\"row align-items-center\">\n          <div class=\"col-5\">\n            <label class=\"my-1 mr-2\" for=\"businessDate\">Business Date</label>\n          </div>\n          <div class=\"col-7\">\n            <input formControlName=\"businessDate\" class=\"form-control\" type=\"date\" name=\"businessDate\" required>\n          </div>\n        </div>\n      </div>\n      <div class=\"col-4 align-btn\">\n        <button [disabled]=\"!queryForm.valid\" type=\"submit\" class=\"btn btn-warning my-1\" (click)=\"getPLDetails()\">View</button>\n      </div>\n    </div>\n  </form>\n  <hr>\n  <div class=\"row align-items-center\" *ngIf=\"!isFound && !dataReceived\">\n    <div class=\"col-12\">\n      <h4>{{error}}</h4>\n    </div>\n  </div>\n  <div *ngIf=\"dataReceived\">\n    <br>\n    <div class=\"row align-items-center\">\n      <div class=\"col-6 align-btn\">\n        <strong>{{plData?.desk}}</strong>\n      </div>\n      <div class=\"col-6 align-btn\">\n        <strong>{{plData?.businessDate| date:'dd-MMM-yyyy'}}</strong>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-6\">\n        <div class=\"row\">\n          <div class=\"col-4\">\n            <label for=\"currency\"><strong>Reporting Currency: </strong></label>\n          </div>\n          <div class=\"col-6 align-lft\">\n            <strong>{{plData?.currency}}</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n    <hr>\n    <div class=\"row\">\n      <div class=\"col-12\">\n        <table class=\"table table-bordered\">\n          <thead>\n            <tr>\n              <th scope=\"col\">Portfolio</th>\n              <th scope=\"col\">Actual P&L</th>\n              <th scope=\"col\">New Trades</th>\n              <th scope=\"col\">Ammendments</th>\n              <th scope=\"col\">Adjustments</th>\n              <th scope=\"col\">Clean P&L</th>\n              <th scope=\"col\">Unexplained</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let port of plData?.dailyPLTrades\">\n              <td>{{port?.portfolio_Name}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.actualPL < 0 }\">{{port?.actualPL}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.newTrades < 0 }\">{{port?.newTrades}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.ammends < 0 }\">{{port?.ammends}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.adjustment < 0 }\">{{port?.adjustment}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.cleanPL < 0 }\">{{port?.cleanPL}}</td>\n              <td [ngClass]=\"{ 'negativeNums': port?.unexplained < 0 }\">{{port?.unexplained}}</td>\n            </tr>\n            <tr>\n              <td><strong>Total</strong></td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalPL < 0 }\">{{plData?.totalPL}}</td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalNewTrades < 0 }\">{{plData?.totalNewTrades}}</td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalAmmendments < 0 }\">{{plData?.totalAmmendments}}</td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalAdjustments < 0 }\">{{plData?.totalAdjustments}}</td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalCleanPL < 0 }\">{{plData?.totalCleanPL}}</td>\n              <td [ngClass]=\"{ 'negativeNums': plData?.totalUnexplained < 0 }\">{{plData?.totalUnexplained}}</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n    <hr>\n    <form>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"dealerEstimate\">Dealer Estimate: </label>\n            </div>\n            <div [ngClass]=\"{ 'negativeNums': plData?.dealerEstimate < 0 }\" class=\"col-6 align-lft\">\n              {{plData?.dealerEstimate}}\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"variance\">Variance: </label>\n            </div>\n            <div [ngClass]=\"{ 'negativeNums': plData?.variance < 0 }\" class=\"col-6 align-lft\">\n              {{plData?.variance}}\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"explainedVariance\">Explained Variance: </label>\n            </div>\n            <div class=\"col-6 align-lft\">\n              <input name=\"explainedVariance\" [(ngModel)]=\"plData.explainedVariance\" type=\"text\" class=\"form-control\"\n                id=\"explainedVariance\" [ngClass]=\"{ 'negativeNums': plData?.explainedVariance < 0 }\"\n                placeholder=\"Explained Variance\" (ngModelChange)=\"onVarianceChange()\">\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"unexplainedVariance\">Unexplained Variance: </label>\n            </div>\n            <div class=\"col-6 align-lft\" [ngClass]=\"{ 'negativeNums': plData?.unExplainedVariance < 0 }\">\n              {{plData?.unExplainedVariance}}\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"plCommentary\">P&L Commentary</label>\n            </div>\n            <div class=\"col-6 align-lft\">\n              <select class=\"custom-select my-1 mr-sm-2\" id=\"plComment\" [(ngModel)]=\"plData.plCommentary\" [ngModelOptions]=\"{standalone: true}\">\n                <option *ngFor=\"let c of comments\" value=\"{{c.Value}}\">{{c.Value}}</option>\n              </select>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-8\">\n          <div class=\"row align-items-center\">\n            <div class=\"col-4\">\n              <label for=\"plCommentary\">Variance Commentary</label>\n            </div>\n            <div class=\"col-6 align-lft\">\n              <select [ngModelOptions]=\"{standalone: true}\" class=\"custom-select my-1 mr-sm-2\" id=\"varianceComment\" [(ngModel)]=\"plData.varianceComentary\">\n                <option *ngFor=\"let c of comments\" value=\"{{c.Value}}\" [selected]=\"c.Value === plData.varianceComentary\">\n                  {{c.Value}}</option>\n              </select>\n            </div>\n          </div>\n        </div>\n      </div>\n      <hr>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-12\">\n          <label for=\"approval\">Approval</label>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-12\">\n          <div class=\"form-check\">\n            <input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"isReviewed\" [(ngModel)]=\"plData.isReviewed\"\n              [ngModelOptions]=\"{standalone: true}\" [checked]=\"plData?.isReviewed\">\n            <label class=\"form-check-label\" for=\"isReviewed\">\n              The values have been reviewed.\n            </label>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-12\">\n          <div class=\"form-check\">\n            <input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"isApproved\" [(ngModel)]=\"plData.isApproved\"\n              [ngModelOptions]=\"{standalone: true}\" [checked]=\"plData?.isApproved\">\n            <label class=\"form-check-label\" for=\"isApproved\">\n              The Front Office contact responsible for the P&L has approved the published P&L.\n            </label>\n            <div class=\"invalid-feedback\" *ngIf=\"!plData.isApproved\">Check to proceed.</div>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-12\">\n          <div class=\"form-check form-check-inline\" *ngFor=\"let option of fileOptions\">\n            <input required [disabled]=\"option.disabled\" class=\"form-check-input\" type=\"radio\" name=\"fileDownloadOptions\" id=\"fileRadio-{{option.id}}\" [value]=\"option.value\" [(ngModel)]=\"type\">\n            <label class=\"form-check-label\" for=\"fileRadio1\">{{option.id}}</label>\n          </div>\n        </div>\n      </div>\n      <div class=\"row form-group align-items-center\">\n        <div class=\"col-12\">\n          <button type=\"button\" [disabled]=\"!plData?.isApproved || !plData?.isReviewed\" class=\"btn btn-success\"\n            (click)=\"onSubmit()\">Submit</button>&nbsp;\n          <button type=\"button\" class=\"btn btn-success\" (click)=\"downloadFile()\">Download</button>&nbsp;\n          <button type=\"button\" class=\"btn btn-success\" (click)=\"sendEmail()\">Email Front Office</button>\n        </div>\n      </div>\n    </form>\n  </div>\n</div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
  /*!**************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
    \**************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppAppComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"container card\">\n  <app-navigation></app-navigation>\n  <router-outlet></router-outlet>\n</div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.component.html":
  /*!********************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.component.html ***!
    \********************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppHomeHomeComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div class=\"row align-items-center\" *ngIf=\"!authService.loggedIn()\">\n  <br><br><br>\n  <h1 class=\"align-items-center\">Profit & Loss System</h1>\n  <br><br><br>\n</div>\n<div *ngIf=\"authService.loggedIn()\">\n  <br>\n  <form [formGroup]=\"queryForm\">\n    <div class=\"row align-items-center\">\n      <div class=\"col-2\">\n        <label class=\"my-1 mr-2\" for=\"desk\"><strong>Desk</strong></label>\n      </div>\n      <div class=\"col-2\">\n        <select formControlName=\"desk\" (change)=\"getSelectedDeskDetails()\" required class=\"custom-select my-1 mr-sm-2\"\n          id=\"desk\">\n          <option *ngFor=\"let desk of desks\" value=\"{{desk.deskId}}\">{{desk.desk}}</option>\n        </select>\n      </div>\n    </div>\n  </form>\n  <hr>\n  <div class=\"row align-items-center\" *ngIf=\"!detailsAvailable\">\n    <div class=\"col-12\">\n      <h4><strong>Data not available for selected desk.</strong></h4>\n    </div>\n  </div>\n  <div class=\"row align-items-center\" *ngIf=\"detailsAvailable\">\n    <div class=\"col-12\">\n      <table class=\"table table-bordered table-dark\">\n        <thead>\n          <tr>\n            <th scope=\"col\">Portfolio</th>\n            <th scope=\"col\">Approved By</th>\n            <th scope=\"col\">Currency</th>\n            <th scope=\"col\">Business Date</th>\n            <th scope=\"col\">Approval Date</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let d of selectedDeskDetails\">\n            <td>{{d.portfolio_Name}}</td>\n            <td>{{d.approvedBy}}</td>\n            <td>{{d.currency}}</td>\n            <td>{{d.businessDate | date:'dd-MMM-yyyy'}}</td>\n            <td>{{d.approvalDate | date:'dd-MMM-yyyy'}}</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n  </div>\n</div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/login/login.component.html":
  /*!**********************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/login/login.component.html ***!
    \**********************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppLoginLoginComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div>\n  <!-- <form>\n    <div class=\"form-group row\">\n      <label for=\"username\" class=\"col-sm-2 col-form-label\">Username</label>\n      <div class=\"col-sm-10\">\n        <input type=\"text\" name=\"username\" [(ngModel)]=\"model.username\" class=\"form-control\" id=\"username\" placeholder=\"Username\">\n      </div>\n    </div>\n    <div class=\"form-group row\">\n      <label for=\"password\" class=\"col-sm-2 col-form-label\">Password</label>\n      <div class=\"col-sm-10\">\n        <input type=\"password\" name=\"password\" [(ngModel)]=\"model.password\" class=\"form-control\" id=\"password\" placeholder=\"Password\">\n      </div>\n    </div>\n    <button type=\"submit\" class=\"btn btn-primary\" (click)=\"login()\">Submit</button>\n  </form> -->\n  <form name=\"myForm\">\n    <div class=\"login-container\">\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <div class=\"form-group\">\n            <label>Username</label>\n            <input type=\"text\" name=\"username\" [(ngModel)]=\"model.username\" required class=\"form-control\">\n            <!-- <div ng-show=\"myForm.email.$error.email\" class=\"error\">Invalid email!</div> -->\n            <!-- <div ng-show=\"myForm.email.$error.required &amp;&amp; myForm.email.$touched\" class=\"error\">Required!</div> -->\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"form-group\">\n            <label>Password</label>\n            <input type=\"password\" name=\"password\" [(ngModel)]=\"model.password\" required class=\"form-control\">\n            <!-- <div ng-show=\"myForm.pass.$error.required &amp;&amp; myForm.pass.$touched\" class=\"error\">Required!</div> -->\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"form-group\">\n            <button (click)=\"login()\" class=\"btn btn-success pull-right\">Login</button>\n            <div class=\"clearfix\"></div>\n          </div>\n        </div>\n      </div>\n      <!-- <div class=\"row\">\n        <div class=\"col-md-12\">\n          <div ng-show=\"showError\" class=\"alert alert-danger\">Wrong credentials!</div>\n          <div ng-show=\"showSuccess\" class=\"alert alert-success\">Login Successful!</div>\n        </div>\n      </div> -->\n    </div>\n  </form>\n</div>";
    /***/
  },

  /***/
  "./node_modules/raw-loader/dist/cjs.js!./src/app/navigation/navigation.component.html":
  /*!********************************************************************************************!*\
    !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/navigation/navigation.component.html ***!
    \********************************************************************************************/

  /*! exports provided: default */

  /***/
  function node_modulesRawLoaderDistCjsJsSrcAppNavigationNavigationComponentHtml(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "<div>\n  <div class=\"card row\">\n    <nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\">\n      <div class=\"collapse navbar-collapse\">\n        <ul class=\"navbar-nav mr-auto mt-2 mt-lg-0\">\n          <li class=\"nav-item active\">\n            <a class=\"nav-link\" href=\"#\">Home <span class=\"sr-only\">(current)</span></a>\n          </li>\n          <li class=\"nav-item\">\n            <a class=\"nav-link\" href=\"plapproval\">P&L Approval</a>\n          </li>\n        </ul>\n        <div>\n          <a class=\"text-light\" *ngIf=\"authService.loggedIn()\">\n            Welcome {{authService.decodedToken.unique_name | titlecase}}\n          </a>&nbsp;\n        </div>\n        <div>\n          <a *ngIf=\"authService.loggedIn()\" class=\"btn btn-warning\" (click)=\"logout()\"><i class=\"fa fa-sign-out mr-2\"></i>Logout</a>\n        </div>\n        <form class=\"form-inline my-2 my-lg-0\" *ngIf=\"!authService.loggedIn()\">\n          <a class=\"btn btn-outline-warning my-2 my-sm-0\" href=\"login\">Log On</a>\n        </form>\n      </div>\n    </nav>\n  </div>\n</div>";
    /***/
  },

  /***/
  "./node_modules/tslib/tslib.es6.js":
  /*!*****************************************!*\
    !*** ./node_modules/tslib/tslib.es6.js ***!
    \*****************************************/

  /*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */

  /***/
  function node_modulesTslibTslibEs6Js(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__extends", function () {
      return __extends;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__assign", function () {
      return _assign;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__rest", function () {
      return __rest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__decorate", function () {
      return __decorate;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__param", function () {
      return __param;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__metadata", function () {
      return __metadata;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__awaiter", function () {
      return __awaiter;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__generator", function () {
      return __generator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__exportStar", function () {
      return __exportStar;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__values", function () {
      return __values;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__read", function () {
      return __read;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__spread", function () {
      return __spread;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__spreadArrays", function () {
      return __spreadArrays;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__await", function () {
      return __await;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function () {
      return __asyncGenerator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function () {
      return __asyncDelegator;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__asyncValues", function () {
      return __asyncValues;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function () {
      return __makeTemplateObject;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__importStar", function () {
      return __importStar;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__importDefault", function () {
      return __importDefault;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function () {
      return __classPrivateFieldGet;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function () {
      return __classPrivateFieldSet;
    });
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
    
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
    
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */


    var _extendStatics = function extendStatics(d, b) {
      _extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) {
          if (b.hasOwnProperty(p)) d[p] = b[p];
        }
      };

      return _extendStatics(d, b);
    };

    function __extends(d, b) {
      _extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var _assign = function __assign() {
      _assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

      return _assign.apply(this, arguments);
    };

    function __rest(s, e) {
      var t = {};

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      }

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function __decorate(decorators, target, key, desc) {
      var c = arguments.length,
          r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
          d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      }
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
      return function (target, key) {
        decorator(target, key, paramIndex);
      };
    }

    function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
          resolve(value);
        });
      }

      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }

        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }

        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    }

    function __generator(thisArg, body) {
      var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
          f,
          y,
          t,
          g;
      return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
      }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
      }), g;

      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }

      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");

        while (_) {
          try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];

            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;

              case 4:
                _.label++;
                return {
                  value: op[1],
                  done: false
                };

              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;

              case 7:
                op = _.ops.pop();

                _.trys.pop();

                continue;

              default:
                if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                  _ = 0;
                  continue;
                }

                if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                  _.label = op[1];
                  break;
                }

                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }

                if (t && _.label < t[2]) {
                  _.label = t[2];

                  _.ops.push(op);

                  break;
                }

                if (t[2]) _.ops.pop();

                _.trys.pop();

                continue;
            }

            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        }

        if (op[0] & 5) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    }

    function __exportStar(m, exports) {
      for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
      }
    }

    function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator,
          m = s && o[s],
          i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
        next: function next() {
          if (o && i >= o.length) o = void 0;
          return {
            value: o && o[i++],
            done: !o
          };
        }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
          r,
          ar = [],
          e;

      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
          ar.push(r.value);
        }
      } catch (error) {
        e = {
          error: error
        };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }

      return ar;
    }

    function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++) {
        ar = ar.concat(__read(arguments[i]));
      }

      return ar;
    }

    function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
        s += arguments[i].length;
      }

      for (var r = Array(s), k = 0, i = 0; i < il; i++) {
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
          r[k] = a[j];
        }
      }

      return r;
    }

    ;

    function __await(v) {
      return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var g = generator.apply(thisArg, _arguments || []),
          i,
          q = [];
      return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
      }, i;

      function verb(n) {
        if (g[n]) i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
      }

      function resume(n, v) {
        try {
          step(g[n](v));
        } catch (e) {
          settle(q[0][3], e);
        }
      }

      function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
      }

      function fulfill(value) {
        resume("next", value);
      }

      function reject(value) {
        resume("throw", value);
      }

      function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
      }
    }

    function __asyncDelegator(o) {
      var i, p;
      return i = {}, verb("next"), verb("throw", function (e) {
        throw e;
      }), verb("return"), i[Symbol.iterator] = function () {
        return this;
      }, i;

      function verb(n, f) {
        i[n] = o[n] ? function (v) {
          return (p = !p) ? {
            value: __await(o[n](v)),
            done: n === "return"
          } : f ? f(v) : v;
        } : f;
      }
    }

    function __asyncValues(o) {
      if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
      var m = o[Symbol.asyncIterator],
          i;
      return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
      }, i);

      function verb(n) {
        i[n] = o[n] && function (v) {
          return new Promise(function (resolve, reject) {
            v = o[n](v), settle(resolve, reject, v.done, v.value);
          });
        };
      }

      function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function (v) {
          resolve({
            value: v,
            done: d
          });
        }, reject);
      }
    }

    function __makeTemplateObject(cooked, raw) {
      if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", {
          value: raw
        });
      } else {
        cooked.raw = raw;
      }

      return cooked;
    }

    ;

    function __importStar(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
      }
      result.default = mod;
      return result;
    }

    function __importDefault(mod) {
      return mod && mod.__esModule ? mod : {
        default: mod
      };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
      if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
      }

      return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
      if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
      }

      privateMap.set(receiver, value);
      return value;
    }
    /***/

  },

  /***/
  "./src/app/PLApproval/PLApproval.component.scss":
  /*!******************************************************!*\
    !*** ./src/app/PLApproval/PLApproval.component.scss ***!
    \******************************************************/

  /*! exports provided: default */

  /***/
  function srcAppPLApprovalPLApprovalComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".align-btn {\n  text-align: center;\n}\n\n.align-lft {\n  text-align: left;\n}\n\n.negativeNums {\n  color: red;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvUExBcHByb3ZhbC9DOlxcRCBEcml2ZVxcLm5ldGNvcmVcXFBMU3lzdGVtXFxQTFN5c3RlbS1VSS9zcmNcXGFwcFxcUExBcHByb3ZhbFxcUExBcHByb3ZhbC5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvUExBcHByb3ZhbC9QTEFwcHJvdmFsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksa0JBQUE7QUNDSjs7QURDQTtFQUNJLGdCQUFBO0FDRUo7O0FEQ0E7RUFDSSxVQUFBO0FDRUoiLCJmaWxlIjoic3JjL2FwcC9QTEFwcHJvdmFsL1BMQXBwcm92YWwuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYWxpZ24tYnRuIHsgXHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbn1cclxuLmFsaWduLWxmdHtcclxuICAgIHRleHQtYWxpZ246IGxlZnQ7XHJcbn1cclxuXHJcbi5uZWdhdGl2ZU51bXMgeyBcclxuICAgIGNvbG9yOiByZWQ7XHJcbn0iLCIuYWxpZ24tYnRuIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uYWxpZ24tbGZ0IHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLm5lZ2F0aXZlTnVtcyB7XG4gIGNvbG9yOiByZWQ7XG59Il19 */";
    /***/
  },

  /***/
  "./src/app/PLApproval/PLApproval.component.ts":
  /*!****************************************************!*\
    !*** ./src/app/PLApproval/PLApproval.component.ts ***!
    \****************************************************/

  /*! exports provided: PLApprovalComponent */

  /***/
  function srcAppPLApprovalPLApprovalComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PLApprovalComponent", function () {
      return PLApprovalComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var file_saver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! file-saver */
    "./node_modules/file-saver/dist/FileSaver.min.js");
    /* harmony import */


    var file_saver__WEBPACK_IMPORTED_MODULE_3___default =
    /*#__PURE__*/
    __webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_3__);
    /* harmony import */


    var _services_plApproval_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../services/plApproval.service */
    "./src/app/services/plApproval.service.ts");
    /* harmony import */


    var _services_configuration_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../services/configuration.service */
    "./src/app/services/configuration.service.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ../services/alertify.service */
    "./src/app/services/alertify.service.ts");

    var PLApprovalComponent =
    /*#__PURE__*/
    function () {
      function PLApprovalComponent(route, plService, configService, formBuilder, alertify) {
        _classCallCheck(this, PLApprovalComponent);

        this.route = route;
        this.plService = plService;
        this.configService = configService;
        this.formBuilder = formBuilder;
        this.alertify = alertify;
        this.desks = [];
        this.dataReceived = false;
        this.isFound = true;
        this.fileOptions = [{
          value: 0,
          id: 'PDF',
          disabled: false
        }, {
          value: 1,
          id: 'CSV',
          disabled: false
        }, {
          value: 2,
          id: 'Excel',
          disabled: false
        }];
      }

      _createClass(PLApprovalComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this = this;

          this.route.data.subscribe(function (data) {
            _this.desks = data.desks;
          }); // this.configService.getDesks().subscribe(resp => {
          //   this.desks = resp;
          // });

          this.configService.getCommentaries().subscribe(function (resp) {
            _this.comments = resp;
          });
          this.queryForm = this.formBuilder.group({
            desk: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required],
            businessDate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]
          });
        }
      }, {
        key: "getPLDetails",
        value: function getPLDetails() {
          var _this2 = this;

          this.dataReceived = false;
          this.plService.getPLDetails(this.queryForm.get('desk').value, this.queryForm.get('businessDate').value).subscribe(function (resp) {
            _this2.plData = resp;
            _this2.plData.unExplainedVariance = _this2.plData.variance - _this2.plData.explainedVariance;
            _this2.dataReceived = true;
            console.log(resp);
          }, function (error) {
            if (error.status == 404) {
              _this2.isFound = false;
              _this2.error = error.error.message;
            }
          });
        }
      }, {
        key: "onVarianceChange",
        value: function onVarianceChange() {
          this.plData.unExplainedVariance = this.plData.variance - this.plData.explainedVariance;
        }
      }, {
        key: "onDeskChange",
        value: function onDeskChange(newDesk) {
          var _this3 = this;

          var items = this.desks.filter(function (e) {
            return e.deskId === _this3.selectedValue;
          });
          this.selectedDesk = items[0];
        }
      }, {
        key: "onSubmit",
        value: function onSubmit() {
          var _this4 = this;

          this.alertify.confirm('Are you sure about approval?', function () {
            _this4.plData.explainedVariance = +_this4.plData.explainedVariance;

            _this4.plService.approveTrade(_this4.plData).subscribe(function (resp) {
              if (resp) {
                _this4.alertify.success('Approved!');
              }
            });
          });
        }
      }, {
        key: "sendEmail",
        value: function sendEmail() {
          var _this5 = this;

          this.alertify.confirm('Send email to Front Office?', function () {
            _this5.plService.sendEmail(_this5.queryForm.get('desk').value, _this5.queryForm.get('businessDate').value).subscribe(function (res) {
              _this5.alertify.success(res.message);
            }, function (err) {
              _this5.alertify.error('Email Failure');
            });
          });
        }
      }, {
        key: "downloadFile",
        value: function downloadFile() {
          var _this6 = this;

          this.alertify.confirm('Download File?', function () {
            _this6.plService.downloadFile(_this6.type, _this6.queryForm.get('desk').value, _this6.queryForm.get('businessDate').value).subscribe(function (res) {
              var blob = new Blob([res], {
                type: 'application/octet-stream'
              });
              var fileName = 'desk.csv';
              Object(file_saver__WEBPACK_IMPORTED_MODULE_3__["saveAs"])(blob, fileName);

              _this6.alertify.success('File Downloaded.');
            }, function (err) {
              _this6.alertify.error('File Download failed!');
            });
          });
        }
      }]);

      return PLApprovalComponent;
    }();

    PLApprovalComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]
      }, {
        type: _services_plApproval_service__WEBPACK_IMPORTED_MODULE_4__["PlApprovalService"]
      }, {
        type: _services_configuration_service__WEBPACK_IMPORTED_MODULE_5__["ConfigurationService"]
      }, {
        type: _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"]
      }, {
        type: _services_alertify_service__WEBPACK_IMPORTED_MODULE_7__["AlertifyService"]
      }];
    };

    PLApprovalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./PLApproval.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/PLApproval/PLApproval.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./PLApproval.component.scss */
      "./src/app/PLApproval/PLApproval.component.scss")).default]
    })], PLApprovalComponent);
    /***/
  },

  /***/
  "./src/app/app-routing.module.ts":
  /*!***************************************!*\
    !*** ./src/app/app-routing.module.ts ***!
    \***************************************/

  /*! exports provided: AppRoutingModule */

  /***/
  function srcAppAppRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
      return AppRoutingModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./login/login.component */
    "./src/app/login/login.component.ts");
    /* harmony import */


    var _PLApproval_PLApproval_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./PLApproval/PLApproval.component */
    "./src/app/PLApproval/PLApproval.component.ts");
    /* harmony import */


    var _resolver_config_resolver__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./resolver/config.resolver */
    "./src/app/resolver/config.resolver.ts");
    /* harmony import */


    var _resolver_auth_guard_ts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./resolver/auth.guard.ts */
    "./src/app/resolver/auth.guard.ts.ts");
    /* harmony import */


    var _home_home_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./home/home.component */
    "./src/app/home/home.component.ts");
    /* harmony import */


    var _resolver_desk_resolver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./resolver/desk.resolver */
    "./src/app/resolver/desk.resolver.ts");

    var routes = [{
      path: '',
      component: _home_home_component__WEBPACK_IMPORTED_MODULE_7__["HomeComponent"],
      resolve: {
        desks: _resolver_desk_resolver__WEBPACK_IMPORTED_MODULE_8__["DeskResolver"]
      },
      runGuardsAndResolvers: 'always'
    }, {
      path: 'login',
      component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]
    }, {
      path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [_resolver_auth_guard_ts__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]],
      children: [{
        path: 'plapproval',
        component: _PLApproval_PLApproval_component__WEBPACK_IMPORTED_MODULE_4__["PLApprovalComponent"],
        resolve: {
          desks: _resolver_config_resolver__WEBPACK_IMPORTED_MODULE_5__["ConfigResolver"]
        },
        runGuardsAndResolvers: 'always',
        canActivate: [_resolver_auth_guard_ts__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]]
      }]
    }, {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
    }];

    var AppRoutingModule = function AppRoutingModule() {
      _classCallCheck(this, AppRoutingModule);
    };

    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })], AppRoutingModule);
    /***/
  },

  /***/
  "./src/app/app.component.scss":
  /*!************************************!*\
    !*** ./src/app/app.component.scss ***!
    \************************************/

  /*! exports provided: default */

  /***/
  function srcAppAppComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */";
    /***/
  },

  /***/
  "./src/app/app.component.ts":
  /*!**********************************!*\
    !*** ./src/app/app.component.ts ***!
    \**********************************/

  /*! exports provided: AppComponent */

  /***/
  function srcAppAppComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
      return AppComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @auth0/angular-jwt */
    "./node_modules/@auth0/angular-jwt/index.js");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./services/auth.service */
    "./src/app/services/auth.service.ts");

    var AppComponent =
    /*#__PURE__*/
    function () {
      function AppComponent(authService) {
        _classCallCheck(this, AppComponent);

        this.authService = authService;
        this.jwtHelper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_2__["JwtHelperService"]();
      }

      _createClass(AppComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var token = localStorage.getItem('token');
          var user = JSON.parse(localStorage.getItem('user'));

          if (token) {
            this.authService.decodedToken = this.jwtHelper.decodeToken(token);
          }

          if (user) {
            this.authService.currentUser = user;
          }
        }
      }]);

      return AppComponent;
    }();

    AppComponent.ctorParameters = function () {
      return [{
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]
      }];
    };

    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-root',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./app.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./app.component.scss */
      "./src/app/app.component.scss")).default]
    })], AppComponent);
    /***/
  },

  /***/
  "./src/app/app.module.ts":
  /*!*******************************!*\
    !*** ./src/app/app.module.ts ***!
    \*******************************/

  /*! exports provided: tokenGetter, AppModule */

  /***/
  function srcAppAppModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "tokenGetter", function () {
      return tokenGetter;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AppModule", function () {
      return AppModule;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/platform-browser */
    "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @auth0/angular-jwt */
    "./node_modules/@auth0/angular-jwt/index.js");
    /* harmony import */


    var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./app-routing.module */
    "./src/app/app-routing.module.ts");
    /* harmony import */


    var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./app.component */
    "./src/app/app.component.ts");
    /* harmony import */


    var _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./navigation/navigation.component */
    "./src/app/navigation/navigation.component.ts");
    /* harmony import */


    var _login_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./login/login.component */
    "./src/app/login/login.component.ts");
    /* harmony import */


    var _PLApproval_PLApproval_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./PLApproval/PLApproval.component */
    "./src/app/PLApproval/PLApproval.component.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var _guards_prevent_unsaved_changes_guard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./guards/prevent-unsaved-changes.guard */
    "./src/app/guards/prevent-unsaved-changes.guard.ts");
    /* harmony import */


    var _services_configuration_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! ./services/configuration.service */
    "./src/app/services/configuration.service.ts");
    /* harmony import */


    var _services_plApproval_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ./services/plApproval.service */
    "./src/app/services/plApproval.service.ts");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! ./services/alertify.service */
    "./src/app/services/alertify.service.ts");
    /* harmony import */


    var _resolver_auth_guard_ts__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
    /*! ./resolver/auth.guard.ts */
    "./src/app/resolver/auth.guard.ts.ts");
    /* harmony import */


    var _resolver_config_resolver__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
    /*! ./resolver/config.resolver */
    "./src/app/resolver/config.resolver.ts");
    /* harmony import */


    var _home_home_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
    /*! ./home/home.component */
    "./src/app/home/home.component.ts");
    /* harmony import */


    var _resolver_CustomHttpInterceptor__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
    /*! ./resolver/CustomHttpInterceptor */
    "./src/app/resolver/CustomHttpInterceptor.ts");
    /* harmony import */


    var _resolver_desk_resolver__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
    /*! ./resolver/desk.resolver */
    "./src/app/resolver/desk.resolver.ts");

    function tokenGetter() {
      return localStorage.getItem('token');
    }

    var AppModule = function AppModule() {
      _classCallCheck(this, AppModule);
    };

    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
      declarations: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"], _navigation_navigation_component__WEBPACK_IMPORTED_MODULE_6__["NavigationComponent"], _login_login_component__WEBPACK_IMPORTED_MODULE_7__["LoginComponent"], _PLApproval_PLApproval_component__WEBPACK_IMPORTED_MODULE_8__["PLApprovalComponent"], _home_home_component__WEBPACK_IMPORTED_MODULE_17__["HomeComponent"]],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormsModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ReactiveFormsModule"], _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_3__["JwtModule"].forRoot({
        config: {
          tokenGetter: tokenGetter
        }
      })],
      providers: [_guards_prevent_unsaved_changes_guard__WEBPACK_IMPORTED_MODULE_11__["PreventUnsavedChangesGuard"], _services_configuration_service__WEBPACK_IMPORTED_MODULE_12__["ConfigurationService"], _services_plApproval_service__WEBPACK_IMPORTED_MODULE_13__["PlApprovalService"], _services_alertify_service__WEBPACK_IMPORTED_MODULE_14__["AlertifyService"], _resolver_auth_guard_ts__WEBPACK_IMPORTED_MODULE_15__["AuthGuard"], _resolver_config_resolver__WEBPACK_IMPORTED_MODULE_16__["ConfigResolver"], {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HTTP_INTERCEPTORS"],
        useClass: _resolver_CustomHttpInterceptor__WEBPACK_IMPORTED_MODULE_18__["CustomHttpInterceptor"],
        multi: true
      }, _resolver_desk_resolver__WEBPACK_IMPORTED_MODULE_19__["DeskResolver"]],
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
    })], AppModule);
    /***/
  },

  /***/
  "./src/app/guards/prevent-unsaved-changes.guard.ts":
  /*!*********************************************************!*\
    !*** ./src/app/guards/prevent-unsaved-changes.guard.ts ***!
    \*********************************************************/

  /*! exports provided: PreventUnsavedChangesGuard */

  /***/
  function srcAppGuardsPreventUnsavedChangesGuardTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PreventUnsavedChangesGuard", function () {
      return PreventUnsavedChangesGuard;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");

    var PreventUnsavedChangesGuard =
    /*#__PURE__*/
    function () {
      function PreventUnsavedChangesGuard() {
        _classCallCheck(this, PreventUnsavedChangesGuard);
      }

      _createClass(PreventUnsavedChangesGuard, [{
        key: "canDeactivate",
        value: function canDeactivate(component) {
          if (component) {
            return confirm('Are you sure you want to continue? Any unsaved changes would be lost.');
          }

          return true;
        }
      }]);

      return PreventUnsavedChangesGuard;
    }();

    PreventUnsavedChangesGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()], PreventUnsavedChangesGuard);
    /***/
  },

  /***/
  "./src/app/home/home.component.css":
  /*!*****************************************!*\
    !*** ./src/app/home/home.component.css ***!
    \*****************************************/

  /*! exports provided: default */

  /***/
  function srcAppHomeHomeComponentCss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5jb21wb25lbnQuY3NzIn0= */";
    /***/
  },

  /***/
  "./src/app/home/home.component.ts":
  /*!****************************************!*\
    !*** ./src/app/home/home.component.ts ***!
    \****************************************/

  /*! exports provided: HomeComponent */

  /***/
  function srcAppHomeHomeComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "HomeComponent", function () {
      return HomeComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _services_plApproval_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/plApproval.service */
    "./src/app/services/plApproval.service.ts");
    /* harmony import */


    var _services_configuration_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../services/configuration.service */
    "./src/app/services/configuration.service.ts");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/fesm2015/forms.js");

    var HomeComponent =
    /*#__PURE__*/
    function () {
      function HomeComponent(route, plService, configService, authService, formBuilder) {
        _classCallCheck(this, HomeComponent);

        this.route = route;
        this.plService = plService;
        this.configService = configService;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.desks = [];
        this.detailsAvailable = false;
      }

      _createClass(HomeComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var _this7 = this;

          this.queryForm = this.formBuilder.group({
            desk: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required]
          });

          if (this.authService.loggedIn()) {
            this.configService.getDesks().subscribe(function (resp) {
              _this7.desks = resp;
            });
            this.route.data.subscribe(function (data) {
              _this7.deskPortfolios = data.desks;
              _this7.selectedDeskDetails = _this7.deskPortfolios && _this7.deskPortfolios[0].portfolioTrades;

              _this7.queryForm.controls.desk.setValue(_this7.deskPortfolios[0].deskId);

              _this7.detailsAvailable = true;
            });
          } // this.plService.getAllDeskDetails().subscribe(res => {
          //   this.deskPortfolios = res;
          // });

        }
      }, {
        key: "getSelectedDeskDetails",
        value: function getSelectedDeskDetails() {
          var _this8 = this;

          this.detailsAvailable = false;
          var details;
          this.deskPortfolios.forEach(function (elt) {
            if (elt.deskId === _this8.queryForm.get('desk').value) {
              details = elt.portfolioTrades;
              _this8.detailsAvailable = true;
            }
          });
          this.selectedDeskDetails = details;
        }
      }]);

      return HomeComponent;
    }();

    HomeComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]
      }, {
        type: _services_plApproval_service__WEBPACK_IMPORTED_MODULE_3__["PlApprovalService"]
      }, {
        type: _services_configuration_service__WEBPACK_IMPORTED_MODULE_4__["ConfigurationService"]
      }, {
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]
      }, {
        type: _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormBuilder"]
      }];
    };

    HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-home',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./home.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./home.component.css */
      "./src/app/home/home.component.css")).default]
    })], HomeComponent);
    /***/
  },

  /***/
  "./src/app/login/login.component.scss":
  /*!********************************************!*\
    !*** ./src/app/login/login.component.scss ***!
    \********************************************/

  /*! exports provided: default */

  /***/
  function srcAppLoginLoginComponentScss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = ".login-container {\n  max-width: 400px;\n  margin: 60px auto 0;\n}\n\n.error {\n  color: tomato;\n  font-size: 12px;\n  padding-top: 4px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbG9naW4vQzpcXEQgRHJpdmVcXC5uZXRjb3JlXFxQTFN5c3RlbVxcUExTeXN0ZW0tVUkvc3JjXFxhcHBcXGxvZ2luXFxsb2dpbi5jb21wb25lbnQuc2NzcyIsInNyYy9hcHAvbG9naW4vbG9naW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxnQkFBQTtFQUNBLG1CQUFBO0FDQ0o7O0FERUU7RUFDRSxhQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FDQ0oiLCJmaWxlIjoic3JjL2FwcC9sb2dpbi9sb2dpbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dpbi1jb250YWluZXJ7XHJcbiAgICBtYXgtd2lkdGg6IDQwMHB4OyBcclxuICAgIG1hcmdpbjogNjBweCBhdXRvIDA7XHJcbiAgfVxyXG4gIFxyXG4gIC5lcnJvcntcclxuICAgIGNvbG9yOiB0b21hdG87IFxyXG4gICAgZm9udC1zaXplOiAxMnB4OyBcclxuICAgIHBhZGRpbmctdG9wOiA0cHhcclxuICB9IiwiLmxvZ2luLWNvbnRhaW5lciB7XG4gIG1heC13aWR0aDogNDAwcHg7XG4gIG1hcmdpbjogNjBweCBhdXRvIDA7XG59XG5cbi5lcnJvciB7XG4gIGNvbG9yOiB0b21hdG87XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgcGFkZGluZy10b3A6IDRweDtcbn0iXX0= */";
    /***/
  },

  /***/
  "./src/app/login/login.component.ts":
  /*!******************************************!*\
    !*** ./src/app/login/login.component.ts ***!
    \******************************************/

  /*! exports provided: LoginComponent */

  /***/
  function srcAppLoginLoginComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LoginComponent", function () {
      return LoginComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../services/alertify.service */
    "./src/app/services/alertify.service.ts");

    var LoginComponent =
    /*#__PURE__*/
    function () {
      function LoginComponent(router, authService, alertify, route) {
        _classCallCheck(this, LoginComponent);

        this.router = router;
        this.authService = authService;
        this.alertify = alertify;
        this.route = route;
        this.model = {
          username: '',
          password: ''
        };
      }

      _createClass(LoginComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "login",
        value: function login() {
          var _this9 = this;

          this.authService.login(this.model).subscribe(function (next) {
            _this9.alertify.success('Logged In!');

            _this9.route.navigate(['/home']);
          }, function (error) {
            _this9.alertify.error(error);
          }, function () {
            _this9.route.navigate(['/home']);
          });
        }
      }, {
        key: "cancel",
        value: function cancel() {
          this.router.navigate(['/home']);
        }
      }]);

      return LoginComponent;
    }();

    LoginComponent.ctorParameters = function () {
      return [{
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }, {
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]
      }, {
        type: _services_alertify_service__WEBPACK_IMPORTED_MODULE_4__["AlertifyService"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }];
    };

    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-login',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./login.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/login/login.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./login.component.scss */
      "./src/app/login/login.component.scss")).default]
    })], LoginComponent);
    /***/
  },

  /***/
  "./src/app/navigation/navigation.component.css":
  /*!*****************************************************!*\
    !*** ./src/app/navigation/navigation.component.css ***!
    \*****************************************************/

  /*! exports provided: default */

  /***/
  function srcAppNavigationNavigationComponentCss(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony default export */


    __webpack_exports__["default"] = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQuY3NzIn0= */";
    /***/
  },

  /***/
  "./src/app/navigation/navigation.component.ts":
  /*!****************************************************!*\
    !*** ./src/app/navigation/navigation.component.ts ***!
    \****************************************************/

  /*! exports provided: NavigationComponent */

  /***/
  function srcAppNavigationNavigationComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "NavigationComponent", function () {
      return NavigationComponent;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/alertify.service */
    "./src/app/services/alertify.service.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");

    var NavigationComponent =
    /*#__PURE__*/
    function () {
      function NavigationComponent(authService, alertify, route) {
        _classCallCheck(this, NavigationComponent);

        this.authService = authService;
        this.alertify = alertify;
        this.route = route;
      }

      _createClass(NavigationComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "logout",
        value: function logout() {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.authService.currentUser = null;
          this.authService.decodedToken = null;
          this.alertify.message('Logged Out!');
          this.route.navigate(['/home']);
        }
      }]);

      return NavigationComponent;
    }();

    NavigationComponent.ctorParameters = function () {
      return [{
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]
      }, {
        type: _services_alertify_service__WEBPACK_IMPORTED_MODULE_3__["AlertifyService"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]
      }];
    };

    NavigationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
      selector: 'app-navigation',
      template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! raw-loader!./navigation.component.html */
      "./node_modules/raw-loader/dist/cjs.js!./src/app/navigation/navigation.component.html")).default,
      styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(
      /*! ./navigation.component.css */
      "./src/app/navigation/navigation.component.css")).default]
    })], NavigationComponent);
    /***/
  },

  /***/
  "./src/app/resolver/CustomHttpInterceptor.ts":
  /*!***************************************************!*\
    !*** ./src/app/resolver/CustomHttpInterceptor.ts ***!
    \***************************************************/

  /*! exports provided: CustomHttpInterceptor */

  /***/
  function srcAppResolverCustomHttpInterceptorTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CustomHttpInterceptor", function () {
      return CustomHttpInterceptor;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../services/alertify.service */
    "./src/app/services/alertify.service.ts");

    var CustomHttpInterceptor =
    /*#__PURE__*/
    function () {
      function CustomHttpInterceptor(authService, alertify) {
        _classCallCheck(this, CustomHttpInterceptor);

        this.authService = authService;
        this.alertify = alertify;
      } // Add authozization token to the request


      _createClass(CustomHttpInterceptor, [{
        key: "setHeaders",
        value: function setHeaders(request) {
          var token = localStorage.getItem('token');

          if (token) {
            request = request.clone({
              setHeaders: {
                'content-type': 'application/json',
                Authorization: "Bearer ".concat(token)
              }
            });
          }

          return request;
        }
      }, {
        key: "intercept",
        value: function intercept(request, next) {
          var _this10 = this;

          request = this.setHeaders(request);
          return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) {
            if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpErrorResponse"]) {
              switch (error.status) {
                case 0:
                  {
                    _this10.alertify.error('Unable to connect to server, please contact admin');

                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])({
                      status: error.status,
                      message: 'Unable to connect to server, please contact admin'
                    });
                  }

                case 400:
                case 401:
                case 403:
                case 404:
                case 500:
                default:
                  {
                    if (error && error.error) {
                      _this10.alertify.error(error.error.message);
                    } else {
                      _this10.alertify.error(error.message);
                    }
                  }
                // return throwError({
                //   status: error.status,
                //   message: error.message
                // } as AppResponse);
              }
            } else if (error.error instanceof ErrorEvent) {
              // Client Side Error
              _this10.alertify.error(error.error.message);
            } else {
              // Server Side Error
              _this10.alertify.error(error.error.message);
            }
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () {// do something at the end
          }));
        }
      }]);

      return CustomHttpInterceptor;
    }();

    CustomHttpInterceptor.ctorParameters = function () {
      return [{
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]
      }, {
        type: _services_alertify_service__WEBPACK_IMPORTED_MODULE_6__["AlertifyService"]
      }];
    };

    CustomHttpInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()], CustomHttpInterceptor);
    /***/
  },

  /***/
  "./src/app/resolver/auth.guard.ts.ts":
  /*!*******************************************!*\
    !*** ./src/app/resolver/auth.guard.ts.ts ***!
    \*******************************************/

  /*! exports provided: AuthGuard */

  /***/
  function srcAppResolverAuthGuardTsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthGuard", function () {
      return AuthGuard;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var _services_alertify_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../services/alertify.service */
    "./src/app/services/alertify.service.ts");

    var AuthGuard =
    /*#__PURE__*/
    function () {
      function AuthGuard(authService, alertify, router) {
        _classCallCheck(this, AuthGuard);

        this.authService = authService;
        this.alertify = alertify;
        this.router = router;
      }

      _createClass(AuthGuard, [{
        key: "canActivate",
        value: function canActivate() {
          if (this.authService.loggedIn()) {
            return true;
          }

          this.alertify.error('You are not authorized to access');
          this.router.navigate(['/']);
          return false;
        }
      }]);

      return AuthGuard;
    }();

    AuthGuard.ctorParameters = function () {
      return [{
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]
      }, {
        type: _services_alertify_service__WEBPACK_IMPORTED_MODULE_4__["AlertifyService"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }];
    };

    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], AuthGuard);
    /***/
  },

  /***/
  "./src/app/resolver/config.resolver.ts":
  /*!*********************************************!*\
    !*** ./src/app/resolver/config.resolver.ts ***!
    \*********************************************/

  /*! exports provided: ConfigResolver */

  /***/
  function srcAppResolverConfigResolverTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ConfigResolver", function () {
      return ConfigResolver;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/configuration.service */
    "./src/app/services/configuration.service.ts");

    var ConfigResolver =
    /*#__PURE__*/
    function () {
      function ConfigResolver(configService, router) {
        _classCallCheck(this, ConfigResolver);

        this.configService = configService;
        this.router = router;
      }

      _createClass(ConfigResolver, [{
        key: "resolve",
        value: function resolve(route) {
          return this.configService.getDesks();
        }
      }]);

      return ConfigResolver;
    }();

    ConfigResolver.ctorParameters = function () {
      return [{
        type: _services_configuration_service__WEBPACK_IMPORTED_MODULE_3__["ConfigurationService"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }];
    };

    ConfigResolver = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()], ConfigResolver);
    /***/
  },

  /***/
  "./src/app/resolver/desk.resolver.ts":
  /*!*******************************************!*\
    !*** ./src/app/resolver/desk.resolver.ts ***!
    \*******************************************/

  /*! exports provided: DeskResolver */

  /***/
  function srcAppResolverDeskResolverTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "DeskResolver", function () {
      return DeskResolver;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/fesm2015/router.js");
    /* harmony import */


    var _services_plApproval_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ../services/plApproval.service */
    "./src/app/services/plApproval.service.ts");
    /* harmony import */


    var _services_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../services/auth.service */
    "./src/app/services/auth.service.ts");

    var DeskResolver =
    /*#__PURE__*/
    function () {
      function DeskResolver(plService, router, authService) {
        _classCallCheck(this, DeskResolver);

        this.plService = plService;
        this.router = router;
        this.authService = authService;
      }

      _createClass(DeskResolver, [{
        key: "resolve",
        value: function resolve(route) {
          if (this.authService.loggedIn()) {
            return this.plService.getAllDeskDetails();
          }
        }
      }]);

      return DeskResolver;
    }();

    DeskResolver.ctorParameters = function () {
      return [{
        type: _services_plApproval_service__WEBPACK_IMPORTED_MODULE_3__["PlApprovalService"]
      }, {
        type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]
      }, {
        type: _services_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]
      }];
    };

    DeskResolver = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()], DeskResolver);
    /***/
  },

  /***/
  "./src/app/services/alertify.service.ts":
  /*!**********************************************!*\
    !*** ./src/app/services/alertify.service.ts ***!
    \**********************************************/

  /*! exports provided: AlertifyService */

  /***/
  function srcAppServicesAlertifyServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AlertifyService", function () {
      return AlertifyService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");

    alertify.defaults.glossary.title = 'P&L System';

    var AlertifyService =
    /*#__PURE__*/
    function () {
      function AlertifyService() {
        _classCallCheck(this, AlertifyService);
      }

      _createClass(AlertifyService, [{
        key: "confirm",
        value: function confirm(message, okCallBack) {
          alertify.confirm(message, function (e) {
            if (e) {
              okCallBack();
            } else {}
          });
        }
      }, {
        key: "success",
        value: function success(message) {
          alertify.success(message);
        }
      }, {
        key: "error",
        value: function error(message) {
          alertify.error(message);
        }
      }, {
        key: "message",
        value: function message(_message) {
          alertify.message(_message);
        }
      }, {
        key: "warning",
        value: function warning(message) {
          alertify.warning(message);
        }
      }]);

      return AlertifyService;
    }();

    AlertifyService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], AlertifyService);
    /***/
  },

  /***/
  "./src/app/services/auth.service.ts":
  /*!******************************************!*\
    !*** ./src/app/services/auth.service.ts ***!
    \******************************************/

  /*! exports provided: AuthService */

  /***/
  function srcAppServicesAuthServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthService", function () {
      return AuthService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @auth0/angular-jwt */
    "./node_modules/@auth0/angular-jwt/index.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../../environments/environment */
    "./src/environments/environment.ts");

    var AuthService =
    /*#__PURE__*/
    function () {
      function AuthService(http) {
        _classCallCheck(this, AuthService);

        this.http = http;
        this.jwtHelper = new _auth0_angular_jwt__WEBPACK_IMPORTED_MODULE_4__["JwtHelperService"]();
      }

      _createClass(AuthService, [{
        key: "login",
        value: function login(model) {
          var _this11 = this;

          return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].baseUrl + _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].loginUrl, model).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (resp) {
            var user = resp;

            if (user) {
              localStorage.setItem('token', user.token);
              localStorage.setItem('user', JSON.stringify(user.user));
              _this11.currentUser = user.user;
              _this11.decodedToken = _this11.jwtHelper.decodeToken(user.token);
            }
          }));
        }
      }, {
        key: "register",
        value: function register(model) {
          return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].baseUrl + _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].registerUrl, model);
        }
      }, {
        key: "loggedIn",
        value: function loggedIn() {
          var token = localStorage.getItem('token');
          return !this.jwtHelper.isTokenExpired(token);
        }
      }]);

      return AuthService;
    }();

    AuthService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }];
    };

    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], AuthService);
    /***/
  },

  /***/
  "./src/app/services/configuration.service.ts":
  /*!***************************************************!*\
    !*** ./src/app/services/configuration.service.ts ***!
    \***************************************************/

  /*! exports provided: ConfigurationService */

  /***/
  function srcAppServicesConfigurationServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "ConfigurationService", function () {
      return ConfigurationService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var src_environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! src/environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./auth.service */
    "./src/app/services/auth.service.ts");

    var ConfigurationService =
    /*#__PURE__*/
    function () {
      function ConfigurationService(http, authService) {
        _classCallCheck(this, ConfigurationService);

        this.http = http;
        this.authService = authService;
      }

      _createClass(ConfigurationService, [{
        key: "getDesks",
        value: function getDesks() {
          return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/configuration/' + this.authService.currentUser.userName + '/desks');
        }
      }, {
        key: "getCommentaries",
        value: function getCommentaries() {
          return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/configuration/' + this.authService.currentUser.userName + '/comments');
        }
      }]);

      return ConfigurationService;
    }();

    ConfigurationService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]
      }];
    };

    ConfigurationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], ConfigurationService);
    /***/
  },

  /***/
  "./src/app/services/plApproval.service.ts":
  /*!************************************************!*\
    !*** ./src/app/services/plApproval.service.ts ***!
    \************************************************/

  /*! exports provided: PlApprovalService */

  /***/
  function srcAppServicesPlApprovalServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "PlApprovalService", function () {
      return PlApprovalService;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/fesm2015/http.js");
    /* harmony import */


    var src_environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! src/environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./auth.service */
    "./src/app/services/auth.service.ts");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");

    var PlApprovalService =
    /*#__PURE__*/
    function () {
      function PlApprovalService(http, authService) {
        _classCallCheck(this, PlApprovalService);

        this.http = http;
        this.authService = authService;
      }

      _createClass(PlApprovalService, [{
        key: "getPLDetails",
        value: function getPLDetails(deskId, date) {
          return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/pl/' + this.authService.currentUser.userName + '/dailyPLTrades/' + deskId + '?businessDate=' + date);
        }
      }, {
        key: "approveTrade",
        value: function approveTrade(plDesk) {
          return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/pl/' + this.authService.currentUser.userName, plDesk);
        }
      }, {
        key: "sendEmail",
        value: function sendEmail(deskId, date) {
          return this.http.post(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/pl/' + this.authService.currentUser.userName + '/email/' + deskId + '?businessDate=' + date, {});
        }
      }, {
        key: "downloadFile",
        value: function downloadFile(type, deskId, date) {
          var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]();
          var options = {
            responseType: 'arraybuffer'
          };
          return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/pl/' + this.authService.currentUser.userName + '/file/' + deskId + '/' + type + '?businessDate=' + date, options).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (file) {
            return file;
          }));
        }
      }, {
        key: "getAllDeskDetails",
        value: function getAllDeskDetails() {
          return this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl + 'api/pl/' + this.authService.currentUser.userName + '/getall');
        }
      }]);

      return PlApprovalService;
    }();

    PlApprovalService.ctorParameters = function () {
      return [{
        type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]
      }, {
        type: _auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]
      }];
    };

    PlApprovalService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
      providedIn: 'root'
    })], PlApprovalService);
    /***/
  },

  /***/
  "./src/environments/environment.ts":
  /*!*****************************************!*\
    !*** ./src/environments/environment.ts ***!
    \*****************************************/

  /*! exports provided: environment */

  /***/
  function srcEnvironmentsEnvironmentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "environment", function () {
      return environment;
    });
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js"); // This file can be replaced during build by using the `fileReplacements` array.
    // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
    // The list of file replacements can be found in `angular.json`.


    var environment = {
      production: false,
      loginUrl: 'api/Auth/login',
      registerUrl: 'api/Auth/register',
      baseUrl: 'https://localhost:5001/'
    };
    /*
    *baseUrl : 'https://localhost:5001/'
     * For easier debugging in development mode, you can import the following file
     * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
     *
     * This import should be commented out in production mode because it will have a negative impact
     * on performance if an error is thrown.
     */
    // import 'zone.js/dist/zone-error';  // Included with Angular CLI.

    /***/
  },

  /***/
  "./src/main.ts":
  /*!*********************!*\
    !*** ./src/main.ts ***!
    \*********************/

  /*! no exports provided */

  /***/
  function srcMainTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! tslib */
    "./node_modules/tslib/tslib.es6.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/fesm2015/core.js");
    /* harmony import */


    var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/platform-browser-dynamic */
    "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
    /* harmony import */


    var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./app/app.module */
    "./src/app/app.module.ts");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ./environments/environment */
    "./src/environments/environment.ts");

    if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
      Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
    }

    Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"]).catch(function (err) {
      return console.error(err);
    });
    /***/
  },

  /***/
  0:
  /*!***************************!*\
    !*** multi ./src/main.ts ***!
    \***************************/

  /*! no static exports found */

  /***/
  function _(module, exports, __webpack_require__) {
    module.exports = __webpack_require__(
    /*! C:\D Drive\.netcore\PLSystem\PLSystem-UI\src\main.ts */
    "./src/main.ts");
    /***/
  }
}, [[0, "runtime", "vendor"]]]);
//# sourceMappingURL=main-es5.js.map