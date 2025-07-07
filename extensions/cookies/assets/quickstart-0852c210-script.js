(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // scripts/templates/auto-blocking.js
  function blockScripts(apiScripts, userConsent) {
    apiScripts.forEach(({ src, category }) => {
      if (!category || category === "STRICTLY_NECESSARY_COOKIES") return;
      if (userConsent[category]) return;
      const script = [...document.querySelectorAll("script[src]")].find(
        (s) => s.getAttribute("src") === src
      );
      if (script) {
        const placeholder = document.createElement("script");
        placeholder.type = "text/plain";
        placeholder.className = `blocked-${category}`;
        placeholder.setAttribute("data-src", src);
        placeholder.setAttribute("data-cookie-category", category);
        script.parentNode.replaceChild(placeholder, script);
      }
    });
  }
  __name(blockScripts, "blockScripts");
  function blockAllScripts(apiScripts) {
    apiScripts.forEach(({ src, category }) => {
      const script = [...document.querySelectorAll("script[src]")].find(
        (s) => s.getAttribute("src") === src
      );
      if (script) {
        const placeholder = document.createElement("script");
        placeholder.type = "text/plain";
        placeholder.className = `blocked-${category}`;
        placeholder.setAttribute("data-src", src);
        placeholder.setAttribute("data-cookie-category", category);
        script.parentNode.replaceChild(placeholder, script);
      }
    });
  }
  __name(blockAllScripts, "blockAllScripts");
  function restoreScripts(userConsent) {
    document.querySelectorAll('script[type="text/plain"][data-src]').forEach((placeholder) => {
      const src = placeholder.getAttribute("data-src");
      const category = placeholder.getAttribute("data-cookie-category");
      if (userConsent[category]) {
        const restoredScript = document.createElement("script");
        restoredScript.src = src;
        restoredScript.setAttribute("data-cookie-category", category);
        placeholder.parentNode.replaceChild(restoredScript, placeholder);
      }
    });
  }
  __name(restoreScripts, "restoreScripts");

  // scripts/templates/consent-env.js
  var CC_MODAL_ID = "cc-modal-cookies-banner";
  var CC_PENDING_COOKIES_KEY = "captainConsentPending";
  var CC_COOKIE_MODAL = "cc_consent";
  var CC_SERVER_URL = "https://api-dev.cptn.co";
  var CC_STANDARD_MODE_ONLY_SETTINGS = "ONLY_SETTINGS";
  var CC_STANDARD_MODE_BANNER_LINEAL = "BANNER_LINEAL";
  var CC_MODES_ALLOWED = [
    "STRICTLY_NECESSARY_COOKIES",
    "UNCLASSIFIED_COOKIES"
  ];
  var CC_MODE_DO_NOT_SELL_PERSONAL_INFO = "DO_NOT_SELL_PERSONAL_INFORMATION";
  var CC_MODAL_ID_SETTINGS = "cc-modal-cookies-banner-settings";
  var CC_OVERLAY_ID = "captain-compliance-modal-overlay";
  var IS_DEV = true;
  var IS_PROD = false;

  // scripts/templates/services.js
  async function loadBannerData() {
    const paramToken = "eb9aa683-5fd8-4769-a243-c699745ca851";
    const accessToken = paramToken || document.currentScript.getAttribute("access-token");
    const response = await fetch(
      `${CC_SERVER_URL}/banner/banner-token?access-token=${accessToken}`
    );
    return await response.json();
  }
  __name(loadBannerData, "loadBannerData");
  async function getModalStructure(mode) {
    const response = await fetch(
      `${CC_SERVER_URL}/bannerModeStyle/by-mode/${mode}`
    );
    return response ? await response.json() : null;
  }
  __name(getModalStructure, "getModalStructure");
  async function loadData(scannerId) {
    const response = await fetch(
      `${CC_SERVER_URL}/report/find-last-report?scannerId=${scannerId}`
    );
    return response ? await response.json() : null;
  }
  __name(loadData, "loadData");
  async function loadSwitchData() {
    const response = await fetch(`${CC_SERVER_URL}/cookies/cookie-types`);
    return await response.json();
  }
  __name(loadSwitchData, "loadSwitchData");
  async function trackBannerLoad(bannerId) {
    const response = await fetch(
      `${CC_SERVER_URL}/banner/tracking?id=${bannerId}`
    );
    return await response.json();
  }
  __name(trackBannerLoad, "trackBannerLoad");
  async function getCookiesFromServer() {
    const response = await fetch(`${CC_SERVER_URL}/banner/get-cookies`, {
      method: "GET",
      credentials: "include"
    });
    return await response.json();
  }
  __name(getCookiesFromServer, "getCookiesFromServer");
  async function bannerTagTracking(gtmData) {
    const response = await fetch(`${CC_SERVER_URL}/bannerTagTracking`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        gtmData
      })
    });
    return await response.json();
  }
  __name(bannerTagTracking, "bannerTagTracking");
  async function updateStatus(bannerId, status) {
    await fetch(`${CC_SERVER_URL}/bannerTracking/banner/${bannerId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status
      })
    });
  }
  __name(updateStatus, "updateStatus");

  // node_modules/@iabtcf/core/lib/mjs/errors/DecodingError.js
  var DecodingError = class extends Error {
    static {
      __name(this, "DecodingError");
    }
    /**
     * constructor - constructs an DecodingError
     *
     * @param {string} msg - Decoding Error Message
     * @return {undefined}
     */
    constructor(msg) {
      super(msg);
      this.name = "DecodingError";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/errors/EncodingError.js
  var EncodingError = class extends Error {
    static {
      __name(this, "EncodingError");
    }
    /**
     * constructor - constructs an EncodingError
     *
     * @param {string} msg - Encoding Error Message
     * @return {undefined}
     */
    constructor(msg) {
      super(msg);
      this.name = "EncodingError";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/errors/GVLError.js
  var GVLError = class extends Error {
    static {
      __name(this, "GVLError");
    }
    /**
     * constructor - constructs a GVLError
     *
     * @param {string} msg - Error message to display
     * @return {undefined}
     */
    constructor(msg) {
      super(msg);
      this.name = "GVLError";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/errors/TCModelError.js
  var TCModelError = class extends Error {
    static {
      __name(this, "TCModelError");
    }
    /**
     * constructor - constructs an TCModelError
     *
     * @param {string} fieldName - the errored field
     * @param {string} passedValue - what was passed
     * @return {undefined}
     */
    constructor(fieldName, passedValue, msg = "") {
      super(`invalid value ${passedValue} passed for ${fieldName} ${msg}`);
      this.name = "TCModelError";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/Base64Url.js
  var Base64Url = class {
    static {
      __name(this, "Base64Url");
    }
    /**
     * Base 64 URL character set.  Different from standard Base64 char set
     * in that '+' and '/' are replaced with '-' and '_'.
     */
    static DICT = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    static REVERSE_DICT = /* @__PURE__ */ new Map([
      ["A", 0],
      ["B", 1],
      ["C", 2],
      ["D", 3],
      ["E", 4],
      ["F", 5],
      ["G", 6],
      ["H", 7],
      ["I", 8],
      ["J", 9],
      ["K", 10],
      ["L", 11],
      ["M", 12],
      ["N", 13],
      ["O", 14],
      ["P", 15],
      ["Q", 16],
      ["R", 17],
      ["S", 18],
      ["T", 19],
      ["U", 20],
      ["V", 21],
      ["W", 22],
      ["X", 23],
      ["Y", 24],
      ["Z", 25],
      ["a", 26],
      ["b", 27],
      ["c", 28],
      ["d", 29],
      ["e", 30],
      ["f", 31],
      ["g", 32],
      ["h", 33],
      ["i", 34],
      ["j", 35],
      ["k", 36],
      ["l", 37],
      ["m", 38],
      ["n", 39],
      ["o", 40],
      ["p", 41],
      ["q", 42],
      ["r", 43],
      ["s", 44],
      ["t", 45],
      ["u", 46],
      ["v", 47],
      ["w", 48],
      ["x", 49],
      ["y", 50],
      ["z", 51],
      ["0", 52],
      ["1", 53],
      ["2", 54],
      ["3", 55],
      ["4", 56],
      ["5", 57],
      ["6", 58],
      ["7", 59],
      ["8", 60],
      ["9", 61],
      ["-", 62],
      ["_", 63]
    ]);
    /**
     * log2(64) = 6
     */
    static BASIS = 6;
    static LCM = 24;
    /**
     * encodes an arbitrary-length bitfield string into base64url
     *
     * @static
     * @param {string} str - arbitrary-length bitfield string to be encoded to base64url
     * @return {string} - base64url encoded result
     */
    static encode(str) {
      if (!/^[0-1]+$/.test(str)) {
        throw new EncodingError("Invalid bitField");
      }
      const padding = str.length % this.LCM;
      str += padding ? "0".repeat(this.LCM - padding) : "";
      let result = "";
      for (let i = 0; i < str.length; i += this.BASIS) {
        result += this.DICT[parseInt(str.substr(i, this.BASIS), 2)];
      }
      return result;
    }
    /**
     * decodes a base64url encoded bitfield string
     *
     * @static
     * @param {string} str - base64url encoded bitfield string to be decoded
     * @return {string} - bitfield string
     */
    static decode(str) {
      if (!/^[A-Za-z0-9\-_]+$/.test(str)) {
        throw new DecodingError("Invalidly encoded Base64URL string");
      }
      let result = "";
      for (let i = 0; i < str.length; i++) {
        const strBits = this.REVERSE_DICT.get(str[i]).toString(2);
        result += "0".repeat(this.BASIS - strBits.length) + strBits;
      }
      return result;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/Cloneable.js
  var Cloneable = class {
    static {
      __name(this, "Cloneable");
    }
    /**
     * clone - returns a copy of the classes with new values and not references
     *
     * @return {T}
     */
    clone() {
      const myClone = new this.constructor();
      const keys = Object.keys(this);
      keys.forEach((key) => {
        const value = this.deepClone(this[key]);
        if (value !== void 0) {
          myClone[key] = value;
        }
      });
      return myClone;
    }
    /**
     * deepClone - recursive function that makes copies of reference values
     *
     * @param {unknown} item
     * @return {unknown}
     */
    deepClone(item) {
      const itsType = typeof item;
      if (itsType === "number" || itsType === "string" || itsType === "boolean") {
        return item;
      } else if (item !== null && itsType === "object") {
        if (typeof item.clone === "function") {
          return item.clone();
        } else if (item instanceof Date) {
          return new Date(item.getTime());
        } else if (item[Symbol.iterator] !== void 0) {
          const ar = [];
          for (const subItem of item) {
            ar.push(this.deepClone(subItem));
          }
          if (item instanceof Array) {
            return ar;
          } else {
            return new item.constructor(ar);
          }
        } else {
          const retr = {};
          for (const prop in item) {
            if (item.hasOwnProperty(prop)) {
              retr[prop] = this.deepClone(item[prop]);
            }
          }
          return retr;
        }
      }
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/model/BinarySearchTree.js
  var BinarySearchTree = class _BinarySearchTree extends Cloneable {
    static {
      __name(this, "BinarySearchTree");
    }
    root = null;
    getRoot() {
      return this.root;
    }
    isEmpty() {
      return !this.root;
    }
    add(value) {
      const node = {
        value,
        left: null,
        right: null
      };
      let current;
      if (this.isEmpty()) {
        this.root = node;
      } else {
        current = this.root;
        while (true) {
          if (value < current.value) {
            if (current.left === null) {
              current.left = node;
              break;
            } else {
              current = current.left;
            }
          } else if (value > current.value) {
            if (current.right === null) {
              current.right = node;
              break;
            } else {
              current = current.right;
            }
          } else {
            break;
          }
        }
      }
    }
    /**
     * performs Morris in-order traversal
     * @return {number[]} sorted array
     */
    get() {
      const retr = [];
      let current = this.root;
      while (current) {
        if (!current.left) {
          retr.push(current.value);
          current = current.right;
        } else {
          let pre = current.left;
          while (pre.right && pre.right != current) {
            pre = pre.right;
          }
          if (pre.right == current) {
            pre.right = null;
            retr.push(current.value);
            current = current.right;
          } else {
            pre.right = current;
            current = current.left;
          }
        }
      }
      return retr;
    }
    contains(value) {
      let retr = false;
      let current = this.root;
      while (current) {
        if (current.value === value) {
          retr = true;
          break;
        } else if (value > current.value) {
          current = current.right;
        } else if (value < current.value) {
          current = current.left;
        }
      }
      return retr;
    }
    min(current = this.root) {
      let retr;
      while (current) {
        if (current.left) {
          current = current.left;
        } else {
          retr = current.value;
          current = null;
        }
      }
      return retr;
    }
    max(current = this.root) {
      let retr;
      while (current) {
        if (current.right) {
          current = current.right;
        } else {
          retr = current.value;
          current = null;
        }
      }
      return retr;
    }
    remove(value, current = this.root) {
      let parent = null;
      let parentSide = "left";
      while (current) {
        if (value < current.value) {
          parent = current;
          current = current.left;
          parentSide = "left";
        } else if (value > current.value) {
          parent = current;
          current = current.right;
          parentSide = "right";
        } else {
          if (!current.left && !current.right) {
            if (parent) {
              parent[parentSide] = null;
            } else {
              this.root = null;
            }
          } else if (!current.left) {
            if (parent) {
              parent[parentSide] = current.right;
            } else {
              this.root = current.right;
            }
          } else if (!current.right) {
            if (parent) {
              parent[parentSide] = current.left;
            } else {
              this.root = current.left;
            }
          } else {
            const minVal = this.min(current.right);
            this.remove(minVal, current.right);
            current.value = minVal;
          }
          current = null;
        }
      }
    }
    /**
     * Build Binary Search Tree from the ordered number array.
     *  The depth of the tree will be the `log2` of the array length.
     * @param {number[]} values number array in ascending order
     * @return {BinarySearchTree} Binary Search Tree
     */
    static build(values) {
      if (!values || values.length === 0) {
        return null;
      } else if (values.length === 1) {
        const tree = new _BinarySearchTree();
        tree.add(values[0]);
        return tree;
      } else {
        const rootIndex = values.length >> 1;
        const tree = new _BinarySearchTree();
        tree.add(values[rootIndex]);
        const root = tree.getRoot();
        if (root) {
          if (rootIndex + 1 < values.length) {
            const rightTree = _BinarySearchTree.build(values.slice(rootIndex + 1));
            root.right = rightTree ? rightTree.getRoot() : null;
          }
          if (rootIndex - 1 > 0) {
            const leftTree = _BinarySearchTree.build(values.slice(0, rootIndex - 1));
            root.left = leftTree ? leftTree.getRoot() : null;
          }
        }
        return tree;
      }
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/model/ConsentLanguages.js
  var ConsentLanguages = class _ConsentLanguages {
    static {
      __name(this, "ConsentLanguages");
    }
    static langSet = /* @__PURE__ */ new Set([
      "BG",
      "CA",
      "CS",
      "DA",
      "DE",
      "EL",
      "EN",
      "ES",
      "ET",
      "FI",
      "FR",
      "HR",
      "HU",
      "IT",
      "JA",
      "LT",
      "LV",
      "MT",
      "NL",
      "NO",
      "PL",
      "PT",
      "RO",
      "RU",
      "SK",
      "SL",
      "SV",
      "TR",
      "ZH"
    ]);
    has(key) {
      return _ConsentLanguages.langSet.has(key);
    }
    forEach(callback) {
      _ConsentLanguages.langSet.forEach(callback);
    }
    get size() {
      return _ConsentLanguages.langSet.size;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/model/Fields.js
  var Fields = class {
    static {
      __name(this, "Fields");
    }
    static cmpId = "cmpId";
    static cmpVersion = "cmpVersion";
    static consentLanguage = "consentLanguage";
    static consentScreen = "consentScreen";
    static created = "created";
    static supportOOB = "supportOOB";
    static isServiceSpecific = "isServiceSpecific";
    static lastUpdated = "lastUpdated";
    static numCustomPurposes = "numCustomPurposes";
    static policyVersion = "policyVersion";
    static publisherCountryCode = "publisherCountryCode";
    static publisherCustomConsents = "publisherCustomConsents";
    static publisherCustomLegitimateInterests = "publisherCustomLegitimateInterests";
    static publisherLegitimateInterests = "publisherLegitimateInterests";
    static publisherConsents = "publisherConsents";
    static publisherRestrictions = "publisherRestrictions";
    static purposeConsents = "purposeConsents";
    static purposeLegitimateInterests = "purposeLegitimateInterests";
    static purposeOneTreatment = "purposeOneTreatment";
    static specialFeatureOptins = "specialFeatureOptins";
    static useNonStandardStacks = "useNonStandardStacks";
    static vendorConsents = "vendorConsents";
    static vendorLegitimateInterests = "vendorLegitimateInterests";
    static vendorListVersion = "vendorListVersion";
    static vendorsAllowed = "vendorsAllowed";
    static vendorsDisclosed = "vendorsDisclosed";
    static version = "version";
  };

  // node_modules/@iabtcf/core/lib/mjs/model/RestrictionType.js
  var RestrictionType;
  (function(RestrictionType2) {
    RestrictionType2[RestrictionType2["NOT_ALLOWED"] = 0] = "NOT_ALLOWED";
    RestrictionType2[RestrictionType2["REQUIRE_CONSENT"] = 1] = "REQUIRE_CONSENT";
    RestrictionType2[RestrictionType2["REQUIRE_LI"] = 2] = "REQUIRE_LI";
  })(RestrictionType || (RestrictionType = {}));

  // node_modules/@iabtcf/core/lib/mjs/model/PurposeRestriction.js
  var PurposeRestriction = class _PurposeRestriction extends Cloneable {
    static {
      __name(this, "PurposeRestriction");
    }
    static hashSeparator = "-";
    purposeId_;
    restrictionType;
    /**
     * constructor
     *
     * @param {number} purposeId? - may optionally pass the purposeId into the
     * constructor
     * @param {RestrictionType} restrictionType? - may
     * optionally pass the restrictionType into the constructor
     * @return {undefined}
     */
    constructor(purposeId, restrictionType) {
      super();
      if (purposeId !== void 0) {
        this.purposeId = purposeId;
      }
      if (restrictionType !== void 0) {
        this.restrictionType = restrictionType;
      }
    }
    static unHash(hash) {
      const splitUp = hash.split(this.hashSeparator);
      const purpRestriction = new _PurposeRestriction();
      if (splitUp.length !== 2) {
        throw new TCModelError("hash", hash);
      }
      purpRestriction.purposeId = parseInt(splitUp[0], 10);
      purpRestriction.restrictionType = parseInt(splitUp[1], 10);
      return purpRestriction;
    }
    get hash() {
      if (!this.isValid()) {
        throw new Error("cannot hash invalid PurposeRestriction");
      }
      return `${this.purposeId}${_PurposeRestriction.hashSeparator}${this.restrictionType}`;
    }
    /**
     * @return {number} The purpose Id associated with a publisher
     * purpose-by-vendor restriction that resulted in a different consent or LI
     * status than the consent or LI purposes allowed lists.
     */
    get purposeId() {
      return this.purposeId_;
    }
    /**
     * @param {number} idNum - The purpose Id associated with a publisher
     * purpose-by-vendor restriction that resulted in a different consent or LI
     * status than the consent or LI purposes allowed lists.
     */
    set purposeId(idNum) {
      this.purposeId_ = idNum;
    }
    isValid() {
      return Number.isInteger(this.purposeId) && this.purposeId > 0 && (this.restrictionType === RestrictionType.NOT_ALLOWED || this.restrictionType === RestrictionType.REQUIRE_CONSENT || this.restrictionType === RestrictionType.REQUIRE_LI);
    }
    isSameAs(otherPR) {
      return this.purposeId === otherPR.purposeId && this.restrictionType === otherPR.restrictionType;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/model/PurposeRestrictionVector.js
  var PurposeRestrictionVector = class extends Cloneable {
    static {
      __name(this, "PurposeRestrictionVector");
    }
    /**
     * if this originatd from an encoded string we'll need a place to store the
     * bit length; it can be set and got from here
     */
    bitLength = 0;
    /**
     * a map indexed by a string which will be a 'hash' of the purpose and
     * restriction type.
     *
     * Using a BST to keep vendors in a sorted order for encoding later
     */
    map = /* @__PURE__ */ new Map();
    gvl_;
    has(hash) {
      return this.map.has(hash);
    }
    isOkToHave(restrictionType, purposeId, vendorId) {
      let result = true;
      if (this.gvl?.vendors) {
        const vendor = this.gvl.vendors[vendorId];
        if (vendor) {
          if (restrictionType === RestrictionType.NOT_ALLOWED) {
            result = vendor.legIntPurposes.includes(purposeId) || vendor.purposes.includes(purposeId);
          } else if (vendor.flexiblePurposes.length) {
            switch (restrictionType) {
              /**
               * If the vendor has the purposeId in flexiblePurposes and it is
               * listed as a legitimate interest purpose we can set the
               * override to require consent.
               */
              case RestrictionType.REQUIRE_CONSENT:
                result = vendor.flexiblePurposes.includes(purposeId) && vendor.legIntPurposes.includes(purposeId);
                break;
              /**
               * If the vendor has the purposeId in flexiblePurposes and it is
               * listed as a consent purpose we can set the
               * override to require legitimate interest.
               */
              case RestrictionType.REQUIRE_LI:
                result = vendor.flexiblePurposes.includes(purposeId) && vendor.purposes.includes(purposeId);
                break;
            }
          } else {
            result = false;
          }
        } else {
          result = false;
        }
      }
      return result;
    }
    /**
     * add - adds a given Vendor ID under a given Purpose Restriction
     *
     * @param {number} vendorId
     * @param {PurposeRestriction} purposeRestriction
     * @return {void}
     */
    add(vendorId, purposeRestriction) {
      if (this.isOkToHave(purposeRestriction.restrictionType, purposeRestriction.purposeId, vendorId)) {
        const hash = purposeRestriction.hash;
        if (!this.has(hash)) {
          this.map.set(hash, new BinarySearchTree());
          this.bitLength = 0;
        }
        this.map.get(hash).add(vendorId);
      }
    }
    /**
     * restrictPurposeToLegalBasis - adds all Vendors under a given Purpose Restriction
     *
     * @param {PurposeRestriction} purposeRestriction
     * @return {void}
     */
    restrictPurposeToLegalBasis(purposeRestriction) {
      const vendors = this.gvl.vendorIds;
      const hash = purposeRestriction.hash;
      const lastEntry = function() {
        let value;
        for (value of vendors)
          ;
        return value;
      }();
      const values = [...Array(lastEntry).keys()].map((i) => i + 1);
      for (let i = 1; i <= lastEntry; i++) {
        if (!this.has(hash)) {
          this.map.set(hash, BinarySearchTree.build(values));
          this.bitLength = 0;
        }
        this.map.get(hash).add(i);
      }
    }
    /**
     * getVendors - returns array of vendor ids optionally narrowed by a given
     * Purpose Restriction.  If no purpose restriction is passed then all vendor
     * ids will be returned.  One can expect this result to be a unique set of
     * ids no duplicates.
     *
     * @param {PurposeRestriction} [purposeRestriction] - optionally passed to
     * get only Vendor IDs restricted under the given Purpose Restriction
     * @return {number[]} - Unique ID set of vendors
     */
    getVendors(purposeRestriction) {
      let vendorIds = [];
      if (purposeRestriction) {
        const hash = purposeRestriction.hash;
        if (this.has(hash)) {
          vendorIds = this.map.get(hash).get();
        }
      } else {
        const vendorSet = /* @__PURE__ */ new Set();
        this.map.forEach((bst) => {
          bst.get().forEach((vendorId) => {
            vendorSet.add(vendorId);
          });
        });
        vendorIds = Array.from(vendorSet);
      }
      return vendorIds;
    }
    getRestrictionType(vendorId, purposeId) {
      let rType;
      this.getRestrictions(vendorId).forEach((purposeRestriction) => {
        if (purposeRestriction.purposeId === purposeId) {
          if (rType === void 0 || rType > purposeRestriction.restrictionType) {
            rType = purposeRestriction.restrictionType;
          }
        }
      });
      return rType;
    }
    /**
     * vendorHasRestriction - determines whether a given Vendor ID is under a
     * given Purpose Restriction
     *
     * @param {number} vendorId
     * @param {PurposeRestriction} purposeRestriction
     * @return {boolean} - true if the give Vendor ID is under the given Purpose
     * Restriction
     */
    vendorHasRestriction(vendorId, purposeRestriction) {
      let has = false;
      const restrictions = this.getRestrictions(vendorId);
      for (let i = 0; i < restrictions.length && !has; i++) {
        has = purposeRestriction.isSameAs(restrictions[i]);
      }
      return has;
    }
    /**
     * getMaxVendorId - gets the Maximum Vendor ID regardless of Purpose
     * Restriction
     *
     * @return {number} - maximum Vendor ID
     */
    getMaxVendorId() {
      let retr = 0;
      this.map.forEach((bst) => {
        retr = Math.max(bst.max(), retr);
      });
      return retr;
    }
    getRestrictions(vendorId) {
      const retr = [];
      this.map.forEach((bst, hash) => {
        if (vendorId) {
          if (bst.contains(vendorId)) {
            retr.push(PurposeRestriction.unHash(hash));
          }
        } else {
          retr.push(PurposeRestriction.unHash(hash));
        }
      });
      return retr;
    }
    getPurposes() {
      const purposeIds = /* @__PURE__ */ new Set();
      this.map.forEach((bst, hash) => {
        purposeIds.add(PurposeRestriction.unHash(hash).purposeId);
      });
      return Array.from(purposeIds);
    }
    /**
     * remove - removes Vendor ID from a Purpose Restriction
     *
     * @param {number} vendorId
     * @param {PurposeRestriction} purposeRestriction
     * @return {void}
     */
    remove(vendorId, purposeRestriction) {
      const hash = purposeRestriction.hash;
      const bst = this.map.get(hash);
      if (bst) {
        bst.remove(vendorId);
        if (bst.isEmpty()) {
          this.map.delete(hash);
          this.bitLength = 0;
        }
      }
    }
    /**
     * Essential for being able to determine whether we can actually set a
     * purpose restriction since they have to have a flexible legal basis
     *
     * @param {GVL} value - the GVL instance
     */
    set gvl(value) {
      if (!this.gvl_) {
        this.gvl_ = value;
        this.map.forEach((bst, hash) => {
          const purposeRestriction = PurposeRestriction.unHash(hash);
          const vendors = bst.get();
          vendors.forEach((vendorId) => {
            if (!this.isOkToHave(purposeRestriction.restrictionType, purposeRestriction.purposeId, vendorId)) {
              bst.remove(vendorId);
            }
          });
        });
      }
    }
    /**
     * gvl returns local copy of the GVL these restrictions apply to
     *
     * @return {GVL}
     */
    get gvl() {
      return this.gvl_;
    }
    /**
     * isEmpty - whether or not this vector has any restrictions in it
     *
     * @return {boolean}
     */
    isEmpty() {
      return this.map.size === 0;
    }
    /**
     * numRestrictions - returns the number of Purpose Restrictions.
     *
     * @return {number}
     */
    get numRestrictions() {
      return this.map.size;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/model/DeviceDisclosureStorageAccessType.js
  var DeviceDisclosureStorageAccessType;
  (function(DeviceDisclosureStorageAccessType2) {
    DeviceDisclosureStorageAccessType2["COOKIE"] = "cookie";
    DeviceDisclosureStorageAccessType2["WEB"] = "web";
    DeviceDisclosureStorageAccessType2["APP"] = "app";
  })(DeviceDisclosureStorageAccessType || (DeviceDisclosureStorageAccessType = {}));

  // node_modules/@iabtcf/core/lib/mjs/model/Segment.js
  var Segment;
  (function(Segment2) {
    Segment2["CORE"] = "core";
    Segment2["VENDORS_DISCLOSED"] = "vendorsDisclosed";
    Segment2["VENDORS_ALLOWED"] = "vendorsAllowed";
    Segment2["PUBLISHER_TC"] = "publisherTC";
  })(Segment || (Segment = {}));

  // node_modules/@iabtcf/core/lib/mjs/model/SegmentIDs.js
  var SegmentIDs = class {
    static {
      __name(this, "SegmentIDs");
    }
    /**
     * 0 = default - reserved for core string (does not need to be present in the core string)
     * 1 = OOB vendors disclosed
     * 2 = OOB vendors allowed
     * 3 = PublisherTC
     */
    static ID_TO_KEY = [
      Segment.CORE,
      Segment.VENDORS_DISCLOSED,
      Segment.VENDORS_ALLOWED,
      Segment.PUBLISHER_TC
    ];
    static KEY_TO_ID = {
      [Segment.CORE]: 0,
      [Segment.VENDORS_DISCLOSED]: 1,
      [Segment.VENDORS_ALLOWED]: 2,
      [Segment.PUBLISHER_TC]: 3
    };
  };

  // node_modules/@iabtcf/core/lib/mjs/model/Vector.js
  var Vector = class extends Cloneable {
    static {
      __name(this, "Vector");
    }
    /**
     * if this originatd from an encoded string we'll need a place to store the
     * bit length; it can be set and got from here
     */
    bitLength = 0;
    maxId_ = 0;
    set_ = /* @__PURE__ */ new Set();
    *[Symbol.iterator]() {
      for (let i = 1; i <= this.maxId; i++) {
        yield [i, this.has(i)];
      }
    }
    /**
     * values()
     *
     * @return {IterableIterator<number>} - returns an iterator of the positive
     * values in the set
     */
    values() {
      return this.set_.values();
    }
    /**
     * maxId
     *
     * @return {number} - the highest id in this Vector
     */
    get maxId() {
      return this.maxId_;
    }
    /**
     * get
     *
     * @param {number} id - key for value to check
     * @return {boolean} - value of that key, if never set it will be false
     */
    has(id) {
      return this.set_.has(id);
    }
    /**
     * unset
     *
     * @param {SingleIDOrCollection} id - id or ids to unset
     * @return {void}
     */
    unset(id) {
      if (Array.isArray(id)) {
        id.forEach((id2) => this.unset(id2));
      } else if (typeof id === "object") {
        this.unset(Object.keys(id).map((strId) => Number(strId)));
      } else {
        this.set_.delete(Number(id));
        this.bitLength = 0;
        if (id === this.maxId) {
          this.maxId_ = 0;
          this.set_.forEach((id2) => {
            this.maxId_ = Math.max(this.maxId, id2);
          });
        }
      }
    }
    isIntMap(item) {
      let result = typeof item === "object";
      result = result && Object.keys(item).every((key) => {
        let itemResult = Number.isInteger(parseInt(key, 10));
        itemResult = itemResult && this.isValidNumber(item[key].id);
        itemResult = itemResult && item[key].name !== void 0;
        return itemResult;
      });
      return result;
    }
    isValidNumber(item) {
      return parseInt(item, 10) > 0;
    }
    isSet(item) {
      let result = false;
      if (item instanceof Set) {
        result = Array.from(item).every(this.isValidNumber);
      }
      return result;
    }
    /**
     * set - sets an item assumed to be a truthy value by its presence
     *
     * @param {SingleIDOrCollection} item - May be a single id (positive integer)
     * or collection of ids in a set, GVL Int Map, or Array.
     *
     * @return {void}
     */
    set(item) {
      if (Array.isArray(item)) {
        item.forEach((item2) => this.set(item2));
      } else if (this.isSet(item)) {
        this.set(Array.from(item));
      } else if (this.isIntMap(item)) {
        this.set(Object.keys(item).map((strId) => Number(strId)));
      } else if (this.isValidNumber(item)) {
        this.set_.add(item);
        this.maxId_ = Math.max(this.maxId, item);
        this.bitLength = 0;
      } else {
        throw new TCModelError("set()", item, "must be positive integer array, positive integer, Set<number>, or IntMap");
      }
    }
    empty() {
      this.set_ = /* @__PURE__ */ new Set();
    }
    /**
     * forEach - to traverse from id=1 to id=maxId in a sequential non-sparse manner
     *
     *
     * @param {forEachCallback} callback - callback to execute
     * @return {void}
     *
     * @callback forEachCallback
     * @param {boolean} value - whether or not this id exists in the vector
     * @param {number} id - the id number of the current iteration
     */
    forEach(callback) {
      for (let i = 1; i <= this.maxId; i++) {
        callback(this.has(i), i);
      }
    }
    get size() {
      return this.set_.size;
    }
    setAll(intMap) {
      this.set(intMap);
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/BitLength.js
  var BitLength = class {
    static {
      __name(this, "BitLength");
    }
    static [Fields.cmpId] = 12;
    static [Fields.cmpVersion] = 12;
    static [Fields.consentLanguage] = 12;
    static [Fields.consentScreen] = 6;
    static [Fields.created] = 36;
    static [Fields.isServiceSpecific] = 1;
    static [Fields.lastUpdated] = 36;
    static [Fields.policyVersion] = 6;
    static [Fields.publisherCountryCode] = 12;
    static [Fields.publisherLegitimateInterests] = 24;
    static [Fields.publisherConsents] = 24;
    static [Fields.purposeConsents] = 24;
    static [Fields.purposeLegitimateInterests] = 24;
    static [Fields.purposeOneTreatment] = 1;
    static [Fields.specialFeatureOptins] = 12;
    static [Fields.useNonStandardStacks] = 1;
    static [Fields.vendorListVersion] = 12;
    static [Fields.version] = 6;
    static anyBoolean = 1;
    static encodingType = 1;
    static maxId = 16;
    static numCustomPurposes = 6;
    static numEntries = 12;
    static numRestrictions = 12;
    static purposeId = 6;
    static restrictionType = 2;
    static segmentType = 3;
    static singleOrRange = 1;
    static vendorId = 16;
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/BooleanEncoder.js
  var BooleanEncoder = class {
    static {
      __name(this, "BooleanEncoder");
    }
    static encode(value) {
      return String(Number(value));
    }
    static decode(value) {
      return value === "1";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/IntEncoder.js
  var IntEncoder = class {
    static {
      __name(this, "IntEncoder");
    }
    static encode(value, numBits) {
      let bitString;
      if (typeof value === "string") {
        value = parseInt(value, 10);
      }
      bitString = value.toString(2);
      if (bitString.length > numBits || value < 0) {
        throw new EncodingError(`${value} too large to encode into ${numBits}`);
      }
      if (bitString.length < numBits) {
        bitString = "0".repeat(numBits - bitString.length) + bitString;
      }
      return bitString;
    }
    static decode(value, numBits) {
      if (numBits !== value.length) {
        throw new DecodingError("invalid bit length");
      }
      return parseInt(value, 2);
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/DateEncoder.js
  var DateEncoder = class {
    static {
      __name(this, "DateEncoder");
    }
    static encode(value, numBits) {
      return IntEncoder.encode(Math.round(value.getTime() / 100), numBits);
    }
    static decode(value, numBits) {
      if (numBits !== value.length) {
        throw new DecodingError("invalid bit length");
      }
      const date = /* @__PURE__ */ new Date();
      date.setTime(IntEncoder.decode(value, numBits) * 100);
      return date;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/FixedVectorEncoder.js
  var FixedVectorEncoder = class {
    static {
      __name(this, "FixedVectorEncoder");
    }
    static encode(value, numBits) {
      let bitString = "";
      for (let i = 1; i <= numBits; i++) {
        bitString += BooleanEncoder.encode(value.has(i));
      }
      return bitString;
    }
    static decode(value, numBits) {
      if (value.length !== numBits) {
        throw new DecodingError("bitfield encoding length mismatch");
      }
      const vector = new Vector();
      for (let i = 1; i <= numBits; i++) {
        if (BooleanEncoder.decode(value[i - 1])) {
          vector.set(i);
        }
      }
      vector.bitLength = value.length;
      return vector;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/LangEncoder.js
  var LangEncoder = class {
    static {
      __name(this, "LangEncoder");
    }
    static encode(value, numBits) {
      value = value.toUpperCase();
      const ASCII_START = 65;
      const firstLetter = value.charCodeAt(0) - ASCII_START;
      const secondLetter = value.charCodeAt(1) - ASCII_START;
      if (firstLetter < 0 || firstLetter > 25 || secondLetter < 0 || secondLetter > 25) {
        throw new EncodingError(`invalid language code: ${value}`);
      }
      if (numBits % 2 === 1) {
        throw new EncodingError(`numBits must be even, ${numBits} is not valid`);
      }
      numBits = numBits / 2;
      const firstLetterBString = IntEncoder.encode(firstLetter, numBits);
      const secondLetterBString = IntEncoder.encode(secondLetter, numBits);
      return firstLetterBString + secondLetterBString;
    }
    static decode(value, numBits) {
      let retr;
      if (numBits === value.length && !(value.length % 2)) {
        const ASCII_START = 65;
        const mid = value.length / 2;
        const firstLetter = IntEncoder.decode(value.slice(0, mid), mid) + ASCII_START;
        const secondLetter = IntEncoder.decode(value.slice(mid), mid) + ASCII_START;
        retr = String.fromCharCode(firstLetter) + String.fromCharCode(secondLetter);
      } else {
        throw new DecodingError("invalid bit length for language");
      }
      return retr;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/PurposeRestrictionVectorEncoder.js
  var PurposeRestrictionVectorEncoder = class {
    static {
      __name(this, "PurposeRestrictionVectorEncoder");
    }
    static encode(prVector) {
      let bitString = IntEncoder.encode(prVector.numRestrictions, BitLength.numRestrictions);
      if (!prVector.isEmpty()) {
        prVector.getRestrictions().forEach((purpRestriction) => {
          bitString += IntEncoder.encode(purpRestriction.purposeId, BitLength.purposeId);
          bitString += IntEncoder.encode(purpRestriction.restrictionType, BitLength.restrictionType);
          const vendors = prVector.getVendors(purpRestriction);
          const len = vendors.length;
          let numEntries = 0;
          let startId = 0;
          let rangeField = "";
          for (let i = 0; i < len; i++) {
            const vendorId = vendors[i];
            if (startId === 0) {
              numEntries++;
              startId = vendorId;
            }
            const lastVendorId = vendors[len - 1];
            const gvlVendorIds = prVector.gvl.vendorIds;
            const nextGvlVendor = /* @__PURE__ */ __name((vendorId2) => {
              while (++vendorId2 <= lastVendorId && !gvlVendorIds.has(vendorId2)) {
              }
              return vendorId2;
            }, "nextGvlVendor");
            if (i === len - 1 || vendors[i + 1] > nextGvlVendor(vendorId)) {
              const isRange = !(vendorId === startId);
              rangeField += BooleanEncoder.encode(isRange);
              rangeField += IntEncoder.encode(startId, BitLength.vendorId);
              if (isRange) {
                rangeField += IntEncoder.encode(vendorId, BitLength.vendorId);
              }
              startId = 0;
            }
          }
          bitString += IntEncoder.encode(numEntries, BitLength.numEntries);
          bitString += rangeField;
        });
      }
      return bitString;
    }
    static decode(encodedString) {
      let index = 0;
      const vector = new PurposeRestrictionVector();
      const numRestrictions = IntEncoder.decode(encodedString.substr(index, BitLength.numRestrictions), BitLength.numRestrictions);
      index += BitLength.numRestrictions;
      for (let i = 0; i < numRestrictions; i++) {
        const purposeId = IntEncoder.decode(encodedString.substr(index, BitLength.purposeId), BitLength.purposeId);
        index += BitLength.purposeId;
        const restrictionType = IntEncoder.decode(encodedString.substr(index, BitLength.restrictionType), BitLength.restrictionType);
        index += BitLength.restrictionType;
        const purposeRestriction = new PurposeRestriction(purposeId, restrictionType);
        const numEntries = IntEncoder.decode(encodedString.substr(index, BitLength.numEntries), BitLength.numEntries);
        index += BitLength.numEntries;
        for (let j = 0; j < numEntries; j++) {
          const isARange = BooleanEncoder.decode(encodedString.substr(index, BitLength.anyBoolean));
          index += BitLength.anyBoolean;
          const startOrOnlyVendorId = IntEncoder.decode(encodedString.substr(index, BitLength.vendorId), BitLength.vendorId);
          index += BitLength.vendorId;
          if (isARange) {
            const endVendorId = IntEncoder.decode(encodedString.substr(index, BitLength.vendorId), BitLength.vendorId);
            index += BitLength.vendorId;
            if (endVendorId < startOrOnlyVendorId) {
              throw new DecodingError(`Invalid RangeEntry: endVendorId ${endVendorId} is less than ${startOrOnlyVendorId}`);
            }
            for (let k = startOrOnlyVendorId; k <= endVendorId; k++) {
              vector.add(k, purposeRestriction);
            }
          } else {
            vector.add(startOrOnlyVendorId, purposeRestriction);
          }
        }
      }
      vector.bitLength = index;
      return vector;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/VectorEncodingType.js
  var VectorEncodingType;
  (function(VectorEncodingType2) {
    VectorEncodingType2[VectorEncodingType2["FIELD"] = 0] = "FIELD";
    VectorEncodingType2[VectorEncodingType2["RANGE"] = 1] = "RANGE";
  })(VectorEncodingType || (VectorEncodingType = {}));

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/VendorVectorEncoder.js
  var VendorVectorEncoder = class {
    static {
      __name(this, "VendorVectorEncoder");
    }
    static encode(value) {
      const ranges = [];
      let range = [];
      let retrString = IntEncoder.encode(value.maxId, BitLength.maxId);
      let bitField = "";
      let rangeIsSmaller;
      const headerLength = BitLength.maxId + BitLength.encodingType;
      const bitFieldLength = headerLength + value.maxId;
      const minRangeLength = BitLength.vendorId * 2 + BitLength.singleOrRange + BitLength.numEntries;
      let rangeLength = headerLength + BitLength.numEntries;
      value.forEach((curValue, i) => {
        bitField += BooleanEncoder.encode(curValue);
        rangeIsSmaller = value.maxId > minRangeLength && rangeLength < bitFieldLength;
        if (rangeIsSmaller && curValue) {
          const nextValue = value.has(i + 1);
          if (!nextValue) {
            range.push(i);
            rangeLength += BitLength.vendorId;
            ranges.push(range);
            range = [];
          } else if (range.length === 0) {
            range.push(i);
            rangeLength += BitLength.singleOrRange;
            rangeLength += BitLength.vendorId;
          }
        }
      });
      if (rangeIsSmaller) {
        retrString += String(VectorEncodingType.RANGE);
        retrString += this.buildRangeEncoding(ranges);
      } else {
        retrString += String(VectorEncodingType.FIELD);
        retrString += bitField;
      }
      return retrString;
    }
    static decode(value, version) {
      let vector;
      let index = 0;
      const maxId = IntEncoder.decode(value.substr(index, BitLength.maxId), BitLength.maxId);
      index += BitLength.maxId;
      const encodingType = IntEncoder.decode(value.charAt(index), BitLength.encodingType);
      index += BitLength.encodingType;
      if (encodingType === VectorEncodingType.RANGE) {
        vector = new Vector();
        if (version === 1) {
          if (value.substr(index, 1) === "1") {
            throw new DecodingError("Unable to decode default consent=1");
          }
          index++;
        }
        const numEntries = IntEncoder.decode(value.substr(index, BitLength.numEntries), BitLength.numEntries);
        index += BitLength.numEntries;
        for (let i = 0; i < numEntries; i++) {
          const isIdRange = BooleanEncoder.decode(value.charAt(index));
          index += BitLength.singleOrRange;
          const firstId = IntEncoder.decode(value.substr(index, BitLength.vendorId), BitLength.vendorId);
          index += BitLength.vendorId;
          if (isIdRange) {
            const secondId = IntEncoder.decode(value.substr(index, BitLength.vendorId), BitLength.vendorId);
            index += BitLength.vendorId;
            for (let j = firstId; j <= secondId; j++) {
              vector.set(j);
            }
          } else {
            vector.set(firstId);
          }
        }
      } else {
        const bitField = value.substr(index, maxId);
        index += maxId;
        vector = FixedVectorEncoder.decode(bitField, maxId);
      }
      vector.bitLength = index;
      return vector;
    }
    static buildRangeEncoding(ranges) {
      const numEntries = ranges.length;
      let rangeString = IntEncoder.encode(numEntries, BitLength.numEntries);
      ranges.forEach((range) => {
        const single = range.length === 1;
        rangeString += BooleanEncoder.encode(!single);
        rangeString += IntEncoder.encode(range[0], BitLength.vendorId);
        if (!single) {
          rangeString += IntEncoder.encode(range[1], BitLength.vendorId);
        }
      });
      return rangeString;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/field/FieldEncoderMap.js
  function FieldEncoderMap() {
    return {
      [Fields.version]: IntEncoder,
      [Fields.created]: DateEncoder,
      [Fields.lastUpdated]: DateEncoder,
      [Fields.cmpId]: IntEncoder,
      [Fields.cmpVersion]: IntEncoder,
      [Fields.consentScreen]: IntEncoder,
      [Fields.consentLanguage]: LangEncoder,
      [Fields.vendorListVersion]: IntEncoder,
      [Fields.policyVersion]: IntEncoder,
      [Fields.isServiceSpecific]: BooleanEncoder,
      [Fields.useNonStandardStacks]: BooleanEncoder,
      [Fields.specialFeatureOptins]: FixedVectorEncoder,
      [Fields.purposeConsents]: FixedVectorEncoder,
      [Fields.purposeLegitimateInterests]: FixedVectorEncoder,
      [Fields.purposeOneTreatment]: BooleanEncoder,
      [Fields.publisherCountryCode]: LangEncoder,
      [Fields.vendorConsents]: VendorVectorEncoder,
      [Fields.vendorLegitimateInterests]: VendorVectorEncoder,
      [Fields.publisherRestrictions]: PurposeRestrictionVectorEncoder,
      segmentType: IntEncoder,
      [Fields.vendorsDisclosed]: VendorVectorEncoder,
      [Fields.vendorsAllowed]: VendorVectorEncoder,
      [Fields.publisherConsents]: FixedVectorEncoder,
      [Fields.publisherLegitimateInterests]: FixedVectorEncoder,
      [Fields.numCustomPurposes]: IntEncoder,
      [Fields.publisherCustomConsents]: FixedVectorEncoder,
      [Fields.publisherCustomLegitimateInterests]: FixedVectorEncoder
    };
  }
  __name(FieldEncoderMap, "FieldEncoderMap");

  // node_modules/@iabtcf/core/lib/mjs/encoder/sequence/FieldSequence.js
  var FieldSequence = class {
    static {
      __name(this, "FieldSequence");
    }
    "1" = {
      [Segment.CORE]: [
        Fields.version,
        Fields.created,
        Fields.lastUpdated,
        Fields.cmpId,
        Fields.cmpVersion,
        Fields.consentScreen,
        Fields.consentLanguage,
        Fields.vendorListVersion,
        Fields.purposeConsents,
        Fields.vendorConsents
      ]
    };
    "2" = {
      [Segment.CORE]: [
        Fields.version,
        Fields.created,
        Fields.lastUpdated,
        Fields.cmpId,
        Fields.cmpVersion,
        Fields.consentScreen,
        Fields.consentLanguage,
        Fields.vendorListVersion,
        Fields.policyVersion,
        Fields.isServiceSpecific,
        Fields.useNonStandardStacks,
        Fields.specialFeatureOptins,
        Fields.purposeConsents,
        Fields.purposeLegitimateInterests,
        Fields.purposeOneTreatment,
        Fields.publisherCountryCode,
        Fields.vendorConsents,
        Fields.vendorLegitimateInterests,
        Fields.publisherRestrictions
      ],
      [Segment.PUBLISHER_TC]: [
        Fields.publisherConsents,
        Fields.publisherLegitimateInterests,
        Fields.numCustomPurposes,
        Fields.publisherCustomConsents,
        Fields.publisherCustomLegitimateInterests
      ],
      [Segment.VENDORS_ALLOWED]: [
        Fields.vendorsAllowed
      ],
      [Segment.VENDORS_DISCLOSED]: [
        Fields.vendorsDisclosed
      ]
    };
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/sequence/SegmentSequence.js
  var SegmentSequence = class {
    static {
      __name(this, "SegmentSequence");
    }
    "1" = [
      Segment.CORE
    ];
    "2" = [
      Segment.CORE
    ];
    constructor(tcModel, options) {
      if (tcModel.version === 2) {
        if (tcModel.isServiceSpecific) {
          this["2"].push(Segment.PUBLISHER_TC);
        } else {
          const isForVendors = !!(options && options.isForVendors);
          if (!isForVendors || tcModel[Fields.supportOOB] === true) {
            this["2"].push(Segment.VENDORS_DISCLOSED);
          }
          if (isForVendors) {
            if (tcModel[Fields.supportOOB] && tcModel[Fields.vendorsAllowed].size > 0) {
              this["2"].push(Segment.VENDORS_ALLOWED);
            }
            this["2"].push(Segment.PUBLISHER_TC);
          }
        }
      }
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/SegmentEncoder.js
  var SegmentEncoder = class {
    static {
      __name(this, "SegmentEncoder");
    }
    static fieldSequence = new FieldSequence();
    static encode(tcModel, segment) {
      let sequence;
      try {
        sequence = this.fieldSequence[String(tcModel.version)][segment];
      } catch (err) {
        throw new EncodingError(`Unable to encode version: ${tcModel.version}, segment: ${segment}`);
      }
      let bitField = "";
      if (segment !== Segment.CORE) {
        bitField = IntEncoder.encode(SegmentIDs.KEY_TO_ID[segment], BitLength.segmentType);
      }
      const fieldEncoderMap = FieldEncoderMap();
      sequence.forEach((key) => {
        const value = tcModel[key];
        const encoder = fieldEncoderMap[key];
        let numBits = BitLength[key];
        if (numBits === void 0) {
          if (this.isPublisherCustom(key)) {
            numBits = Number(tcModel[Fields.numCustomPurposes]);
          }
        }
        try {
          bitField += encoder.encode(value, numBits);
        } catch (err) {
          throw new EncodingError(`Error encoding ${segment}->${key}: ${err.message}`);
        }
      });
      return Base64Url.encode(bitField);
    }
    static decode(encodedString, tcModel, segment) {
      const bitField = Base64Url.decode(encodedString);
      let bStringIdx = 0;
      if (segment === Segment.CORE) {
        tcModel.version = IntEncoder.decode(bitField.substr(bStringIdx, BitLength[Fields.version]), BitLength[Fields.version]);
      }
      if (segment !== Segment.CORE) {
        bStringIdx += BitLength.segmentType;
      }
      const sequence = this.fieldSequence[String(tcModel.version)][segment];
      const fieldEncoderMap = FieldEncoderMap();
      sequence.forEach((key) => {
        const encoder = fieldEncoderMap[key];
        let numBits = BitLength[key];
        if (numBits === void 0) {
          if (this.isPublisherCustom(key)) {
            numBits = Number(tcModel[Fields.numCustomPurposes]);
          }
        }
        if (numBits !== 0) {
          const bits = bitField.substr(bStringIdx, numBits);
          if (encoder === VendorVectorEncoder) {
            tcModel[key] = encoder.decode(bits, tcModel.version);
          } else {
            tcModel[key] = encoder.decode(bits, numBits);
          }
          if (Number.isInteger(numBits)) {
            bStringIdx += numBits;
          } else if (Number.isInteger(tcModel[key].bitLength)) {
            bStringIdx += tcModel[key].bitLength;
          } else {
            throw new DecodingError(key);
          }
        }
      });
      return tcModel;
    }
    static isPublisherCustom(key) {
      return key.indexOf("publisherCustom") === 0;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/encoder/SemanticPreEncoder.js
  var SemanticPreEncoder = class {
    static {
      __name(this, "SemanticPreEncoder");
    }
    static processor = [
      (tcModel) => tcModel,
      (tcModel, gvl) => {
        tcModel.publisherRestrictions.gvl = gvl;
        tcModel.purposeLegitimateInterests.unset(1);
        const vectorToIntMap = /* @__PURE__ */ new Map();
        vectorToIntMap.set("legIntPurposes", tcModel.vendorLegitimateInterests);
        vectorToIntMap.set("purposes", tcModel.vendorConsents);
        vectorToIntMap.forEach((vector, gvlVendorKey) => {
          vector.forEach((value, vendorId) => {
            if (value) {
              const vendor = gvl.vendors[vendorId];
              if (!vendor || vendor.deletedDate) {
                vector.unset(vendorId);
              } else if (vendor[gvlVendorKey].length === 0) {
                if (gvlVendorKey === "legIntPurposes" && vendor["purposes"].length === 0 && vendor["legIntPurposes"].length === 0 && vendor["specialPurposes"].length > 0) {
                } else {
                  if (tcModel.isServiceSpecific) {
                    if (vendor.flexiblePurposes.length === 0) {
                      vector.unset(vendorId);
                    } else {
                      const restrictions = tcModel.publisherRestrictions.getRestrictions(vendorId);
                      let isValid = false;
                      for (let i = 0, len = restrictions.length; i < len && !isValid; i++) {
                        isValid = restrictions[i].restrictionType === RestrictionType.REQUIRE_CONSENT && gvlVendorKey === "purposes" || restrictions[i].restrictionType === RestrictionType.REQUIRE_LI && gvlVendorKey === "legIntPurposes";
                      }
                      if (!isValid) {
                        vector.unset(vendorId);
                      }
                    }
                  } else {
                    vector.unset(vendorId);
                  }
                }
              }
            }
          });
        });
        tcModel.vendorsDisclosed.set(gvl.vendors);
        return tcModel;
      }
    ];
    static process(tcModel, options) {
      const gvl = tcModel.gvl;
      if (!gvl) {
        throw new EncodingError("Unable to encode TCModel without a GVL");
      }
      if (!gvl.isReady) {
        throw new EncodingError("Unable to encode TCModel tcModel.gvl.readyPromise is not resolved");
      }
      tcModel = tcModel.clone();
      tcModel.consentLanguage = gvl.language.toUpperCase();
      if (options?.version > 0 && options?.version <= this.processor.length) {
        tcModel.version = options.version;
      } else {
        tcModel.version = this.processor.length;
      }
      const processorFunctionIndex = tcModel.version - 1;
      if (!this.processor[processorFunctionIndex]) {
        throw new EncodingError(`Invalid version: ${tcModel.version}`);
      }
      return this.processor[processorFunctionIndex](tcModel, gvl);
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/Json.js
  var Json = class {
    static {
      __name(this, "Json");
    }
    static absCall(url, body, sendCookies, timeout) {
      return new Promise((resolve, reject2) => {
        const req = new XMLHttpRequest();
        const onLoad = /* @__PURE__ */ __name(() => {
          if (req.readyState == XMLHttpRequest.DONE) {
            if (req.status >= 200 && req.status < 300) {
              let response = req.response;
              if (typeof response === "string") {
                try {
                  response = JSON.parse(response);
                } catch (e) {
                }
              }
              resolve(response);
            } else {
              reject2(new Error(`HTTP Status: ${req.status} response type: ${req.responseType}`));
            }
          }
        }, "onLoad");
        const onError = /* @__PURE__ */ __name(() => {
          reject2(new Error("error"));
        }, "onError");
        const onAbort = /* @__PURE__ */ __name(() => {
          reject2(new Error("aborted"));
        }, "onAbort");
        const onTimeout = /* @__PURE__ */ __name(() => {
          reject2(new Error("Timeout " + timeout + "ms " + url));
        }, "onTimeout");
        req.withCredentials = sendCookies;
        req.addEventListener("load", onLoad);
        req.addEventListener("error", onError);
        req.addEventListener("abort", onAbort);
        if (body === null) {
          req.open("GET", url, true);
        } else {
          req.open("POST", url, true);
        }
        req.responseType = "json";
        req.timeout = timeout;
        req.ontimeout = onTimeout;
        req.send(body);
      });
    }
    /**
     * @static
     * @param {string} url - full path to POST to
     * @param {object} body - JSON object to post
     * @param {boolean} sendCookies - Whether or not to send the XMLHttpRequest with credentials or not
     * @param {number} [timeout] - optional timeout in milliseconds
     * @return {Promise<object>} - if the server responds the response will be returned here
     */
    static post(url, body, sendCookies = false, timeout = 0) {
      return this.absCall(url, JSON.stringify(body), sendCookies, timeout);
    }
    /**
     * @static
     * @param {string} url - full path to the json
     * @param {boolean} sendCookies - Whether or not to send the XMLHttpRequest with credentials or not
     * @param {number} [timeout] - optional timeout in milliseconds
     * @return {Promise<object>} - resolves with parsed JSON
     */
    static fetch(url, sendCookies = false, timeout = 0) {
      return this.absCall(url, null, sendCookies, timeout);
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/GVL.js
  var GVL = class _GVL extends Cloneable {
    static {
      __name(this, "GVL");
    }
    static LANGUAGE_CACHE = /* @__PURE__ */ new Map();
    static CACHE = /* @__PURE__ */ new Map();
    static LATEST_CACHE_KEY = 0;
    static DEFAULT_LANGUAGE = "EN";
    /**
     * Set of available consent languages published by the IAB
     */
    static consentLanguages = new ConsentLanguages();
    static baseUrl_;
    /**
     * baseUrl - Entities using the vendor-list.json are required by the iab to
     * host their own copy of it to reduce the load on the iab's infrastructure
     * so a 'base' url must be set to be put together with the versioning scheme
     * of the filenames.
     *
     * @static
     * @param {string} url - the base url to load the vendor-list.json from.  This is
     * broken out from the filename because it follows a different scheme for
     * latest file vs versioned files.
     *
     * @throws {GVLError} - If the url is http[s]://vendorlist.consensu.org/...
     * this will throw an error.  IAB Europe requires that that CMPs and Vendors
     * cache their own copies of the GVL to minimize load on their
     * infrastructure.  For more information regarding caching of the
     * vendor-list.json, please see [the TCF documentation on 'Caching the Global
     * Vendor List'
     * ](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md#caching-the-global-vendor-list)
     */
    static set baseUrl(url) {
      const notValid = /^https?:\/\/vendorlist\.consensu\.org\//;
      if (notValid.test(url)) {
        throw new GVLError("Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache");
      }
      if (url.length > 0 && url[url.length - 1] !== "/") {
        url += "/";
      }
      this.baseUrl_ = url;
    }
    /**
     * baseUrl - Entities using the vendor-list.json are required by the iab to
     * host their own copy of it to reduce the load on the iab's infrastructure
     * so a 'base' url must be set to be put together with the versioning scheme
     * of the filenames.
     *
     * @static
     * @return {string} - returns the previously set baseUrl, the default is
     * `undefined`
     */
    static get baseUrl() {
      return this.baseUrl_;
    }
    /**
     * @static
     * @param {string} - the latest is assumed to be vendor-list.json because
     * that is what the iab uses, but it could be different... if you want
     */
    static latestFilename = "vendor-list.json";
    /**
     * @static
     * @param {string} - the versioned name is assumed to be
     * vendor-list-v[VERSION].json where [VERSION] will be replaced with the
     * specified version.  But it could be different... if you want just make
     * sure to include the [VERSION] macro if you have a numbering scheme, it's a
     * simple string substitution.
     *
     * eg.
     * ```javascript
     * GVL.baseUrl = "http://www.mydomain.com/iabcmp/";
     * GVL.versionedFilename = "vendorlist?getVersion=[VERSION]";
     * ```
     */
    static versionedFilename = "archives/vendor-list-v[VERSION].json";
    /**
     * @param {string} - Translations of the names and descriptions for Purposes,
     * Special Purposes, Features, and Special Features to non-English languages
     * are contained in a file where attributes containing English content
     * (except vendor declaration information) are translated.  The iab publishes
     * one following the scheme below where the LANG is the iso639-1 language
     * code.  For a list of available translations
     * [please go here](https://register.consensu.org/Translation).
     *
     * eg.
     * ```javascript
     * GVL.baseUrl = "http://www.mydomain.com/iabcmp/";
     * GVL.languageFilename = "purposes?getPurposes=[LANG]";
     * ```
     */
    static languageFilename = "purposes-[LANG].json";
    /**
     * @param {Promise} resolved when this GVL object is populated with the data
     * or rejected if there is an error.
     */
    readyPromise;
    /**
     * @param {number} gvlSpecificationVersion - schema version for the GVL that is used
     */
    gvlSpecificationVersion;
    /**
     * @param {number} incremented with each published file change
     */
    vendorListVersion;
    /**
     * @param {number} tcfPolicyVersion - The TCF MO will increment this value
     * whenever a GVL change (such as adding a new Purpose or Feature or a change
     * in Purpose wording) legally invalidates existing TC Strings and requires
     * CMPs to re-establish transparency and consent from users. If the policy
     * version number in the latest GVL is different from the value in your TC
     * String, then you need to re-establish transparency and consent for that
     * user. A version 1 format TC String is considered to have a version value
     * of 1.
     */
    tcfPolicyVersion;
    /**
     * @param {string | Date} lastUpdated - the date in which the vendor list
     * json file  was last updated.
     */
    lastUpdated;
    /**
     * @param {IntMap<Purpose>} a collection of [[Purpose]]s
     */
    purposes;
    /**
     * @param {IntMap<Purpose>} a collection of [[Purpose]]s
     */
    specialPurposes;
    /**
     * @param {IntMap<Feature>} a collection of [[Feature]]s
     */
    features;
    /**
     * @param {IntMap<Feature>} a collection of [[Feature]]s
     */
    specialFeatures;
    /**
     * @param {boolean} internal reference of when the GVL is ready to be used
     */
    isReady_ = false;
    /**
     * @param {IntMap<Vendor>} a collection of [[Vendor]]s
     */
    vendors_;
    vendorIds;
    /**
     * @param {IntMap<Vendor>} a collection of [[Vendor]]. Used as a backup if a whitelist is sets
     */
    fullVendorList;
    /**
     * @param {ByPurposeVendorMap} vendors by purpose
     */
    byPurposeVendorMap;
    /**
     * @param {IDSetMap} vendors by special purpose
     */
    bySpecialPurposeVendorMap;
    /**
     * @param {IDSetMap} vendors by feature
     */
    byFeatureVendorMap;
    /**
     * @param {IDSetMap} vendors by special feature
     */
    bySpecialFeatureVendorMap;
    /**
     * @param {IntMap<Stack>} a collection of [[Stack]]s
     */
    stacks;
    lang_;
    isLatest = false;
    /**
     * @param {VersionOrVendorList} [versionOrVendorList] - can be either a
     * [[VendorList]] object or a version number represented as a string or
     * number to download.  If nothing is passed the latest version of the GVL
     * will be loaded
     */
    constructor(versionOrVendorList) {
      super();
      let url = _GVL.baseUrl;
      this.lang_ = _GVL.DEFAULT_LANGUAGE;
      if (this.isVendorList(versionOrVendorList)) {
        this.populate(versionOrVendorList);
        this.readyPromise = Promise.resolve();
      } else {
        if (!url) {
          throw new GVLError("must specify GVL.baseUrl before loading GVL json");
        }
        if (versionOrVendorList > 0) {
          const version = versionOrVendorList;
          if (_GVL.CACHE.has(version)) {
            this.populate(_GVL.CACHE.get(version));
            this.readyPromise = Promise.resolve();
          } else {
            url += _GVL.versionedFilename.replace("[VERSION]", String(version));
            this.readyPromise = this.fetchJson(url);
          }
        } else {
          if (_GVL.CACHE.has(_GVL.LATEST_CACHE_KEY)) {
            this.populate(_GVL.CACHE.get(_GVL.LATEST_CACHE_KEY));
            this.readyPromise = Promise.resolve();
          } else {
            this.isLatest = true;
            this.readyPromise = this.fetchJson(url + _GVL.latestFilename);
          }
        }
      }
    }
    /**
     * emptyLanguageCache
     *
     * @param {string} [lang] - Optional ISO 639-1 langauge code to remove from
     * the cache.  Should be one of the languages in GVL.consentLanguages set.
     * If not then the whole cache will be deleted.
     * @return {boolean} - true if anything was deleted from the cache
     */
    static emptyLanguageCache(lang) {
      let retr = false;
      if (lang === void 0 && _GVL.LANGUAGE_CACHE.size > 0) {
        _GVL.LANGUAGE_CACHE = /* @__PURE__ */ new Map();
        retr = true;
      } else if (typeof lang === "string" && this.consentLanguages.has(lang.toUpperCase())) {
        _GVL.LANGUAGE_CACHE.delete(lang.toUpperCase());
        retr = true;
      }
      return retr;
    }
    /**
     * emptyCache
     *
     * @param {number} [vendorListVersion] - version of the vendor list to delete
     * from the cache.  If none is specified then the whole cache is deleted.
     * @return {boolean} - true if anything was deleted from the cache
     */
    static emptyCache(vendorListVersion) {
      let retr = false;
      if (Number.isInteger(vendorListVersion) && vendorListVersion >= 0) {
        _GVL.CACHE.delete(vendorListVersion);
        retr = true;
      } else if (vendorListVersion === void 0) {
        _GVL.CACHE = /* @__PURE__ */ new Map();
        retr = true;
      }
      return retr;
    }
    cacheLanguage() {
      if (!_GVL.LANGUAGE_CACHE.has(this.lang_)) {
        _GVL.LANGUAGE_CACHE.set(this.lang_, {
          purposes: this.purposes,
          specialPurposes: this.specialPurposes,
          features: this.features,
          specialFeatures: this.specialFeatures,
          stacks: this.stacks
        });
      }
    }
    async fetchJson(url) {
      try {
        this.populate(await Json.fetch(url));
      } catch (err) {
        throw new GVLError(err.message);
      }
    }
    /**
     * getJson - Method for getting the JSON that was downloaded to created this
     * `GVL` object
     *
     * @return {VendorList} - The basic JSON structure without the extra
     * functionality and methods of this class.
     */
    getJson() {
      return JSON.parse(JSON.stringify({
        gvlSpecificationVersion: this.gvlSpecificationVersion,
        vendorListVersion: this.vendorListVersion,
        tcfPolicyVersion: this.tcfPolicyVersion,
        lastUpdated: this.lastUpdated,
        purposes: this.purposes,
        specialPurposes: this.specialPurposes,
        features: this.features,
        specialFeatures: this.specialFeatures,
        stacks: this.stacks,
        vendors: this.fullVendorList
      }));
    }
    /**
     * changeLanguage - retrieves the purpose language translation and sets the
     * internal language variable
     *
     * @param {string} lang - ISO 639-1 langauge code to change language to
     * @return {Promise<void | GVLError>} - returns the `readyPromise` and
     * resolves when this GVL is populated with the data from the language file.
     */
    async changeLanguage(lang) {
      const langUpper = lang.toUpperCase();
      if (_GVL.consentLanguages.has(langUpper)) {
        if (langUpper !== this.lang_) {
          this.lang_ = langUpper;
          if (_GVL.LANGUAGE_CACHE.has(langUpper)) {
            const cached = _GVL.LANGUAGE_CACHE.get(langUpper);
            for (const prop in cached) {
              if (cached.hasOwnProperty(prop)) {
                this[prop] = cached[prop];
              }
            }
          } else {
            const url = _GVL.baseUrl + _GVL.languageFilename.replace("[LANG]", lang);
            try {
              await this.fetchJson(url);
              this.cacheLanguage();
            } catch (err) {
              throw new GVLError("unable to load language: " + err.message);
            }
          }
        }
      } else {
        throw new GVLError(`unsupported language ${lang}`);
      }
    }
    get language() {
      return this.lang_;
    }
    isVendorList(gvlObject) {
      return gvlObject !== void 0 && gvlObject.vendors !== void 0;
    }
    populate(gvlObject) {
      this.purposes = gvlObject.purposes;
      this.specialPurposes = gvlObject.specialPurposes;
      this.features = gvlObject.features;
      this.specialFeatures = gvlObject.specialFeatures;
      this.stacks = gvlObject.stacks;
      if (this.isVendorList(gvlObject)) {
        this.gvlSpecificationVersion = gvlObject.gvlSpecificationVersion;
        this.tcfPolicyVersion = gvlObject.tcfPolicyVersion;
        this.vendorListVersion = gvlObject.vendorListVersion;
        this.lastUpdated = gvlObject.lastUpdated;
        if (typeof this.lastUpdated === "string") {
          this.lastUpdated = new Date(this.lastUpdated);
        }
        this.vendors_ = gvlObject.vendors;
        this.fullVendorList = gvlObject.vendors;
        this.mapVendors();
        this.isReady_ = true;
        if (this.isLatest) {
          _GVL.CACHE.set(_GVL.LATEST_CACHE_KEY, this.getJson());
        }
        if (!_GVL.CACHE.has(this.vendorListVersion)) {
          _GVL.CACHE.set(this.vendorListVersion, this.getJson());
        }
      }
      this.cacheLanguage();
    }
    mapVendors(vendorIds) {
      this.byPurposeVendorMap = {};
      this.bySpecialPurposeVendorMap = {};
      this.byFeatureVendorMap = {};
      this.bySpecialFeatureVendorMap = {};
      Object.keys(this.purposes).forEach((purposeId) => {
        this.byPurposeVendorMap[purposeId] = {
          legInt: /* @__PURE__ */ new Set(),
          consent: /* @__PURE__ */ new Set(),
          flexible: /* @__PURE__ */ new Set()
        };
      });
      Object.keys(this.specialPurposes).forEach((purposeId) => {
        this.bySpecialPurposeVendorMap[purposeId] = /* @__PURE__ */ new Set();
      });
      Object.keys(this.features).forEach((featureId) => {
        this.byFeatureVendorMap[featureId] = /* @__PURE__ */ new Set();
      });
      Object.keys(this.specialFeatures).forEach((featureId) => {
        this.bySpecialFeatureVendorMap[featureId] = /* @__PURE__ */ new Set();
      });
      if (!Array.isArray(vendorIds)) {
        vendorIds = Object.keys(this.fullVendorList).map((vId) => +vId);
      }
      this.vendorIds = new Set(vendorIds);
      this.vendors_ = vendorIds.reduce((vendors, vendorId) => {
        const vendor = this.vendors_[String(vendorId)];
        if (vendor && vendor.deletedDate === void 0) {
          vendor.purposes.forEach((purposeId) => {
            const purpGroup = this.byPurposeVendorMap[String(purposeId)];
            purpGroup.consent.add(vendorId);
          });
          vendor.specialPurposes.forEach((purposeId) => {
            this.bySpecialPurposeVendorMap[String(purposeId)].add(vendorId);
          });
          vendor.legIntPurposes.forEach((purposeId) => {
            this.byPurposeVendorMap[String(purposeId)].legInt.add(vendorId);
          });
          if (vendor.flexiblePurposes) {
            vendor.flexiblePurposes.forEach((purposeId) => {
              this.byPurposeVendorMap[String(purposeId)].flexible.add(vendorId);
            });
          }
          vendor.features.forEach((featureId) => {
            this.byFeatureVendorMap[String(featureId)].add(vendorId);
          });
          vendor.specialFeatures.forEach((featureId) => {
            this.bySpecialFeatureVendorMap[String(featureId)].add(vendorId);
          });
          vendors[vendorId] = vendor;
        }
        return vendors;
      }, {});
    }
    getFilteredVendors(purposeOrFeature, id, subType, special) {
      const properPurposeOrFeature = purposeOrFeature.charAt(0).toUpperCase() + purposeOrFeature.slice(1);
      let vendorSet;
      const retr = {};
      if (purposeOrFeature === "purpose" && subType) {
        vendorSet = this["by" + properPurposeOrFeature + "VendorMap"][String(id)][subType];
      } else {
        vendorSet = this["by" + (special ? "Special" : "") + properPurposeOrFeature + "VendorMap"][String(id)];
      }
      vendorSet.forEach((vendorId) => {
        retr[String(vendorId)] = this.vendors[String(vendorId)];
      });
      return retr;
    }
    /**
     * getVendorsWithConsentPurpose
     *
     * @param {number} purposeId
     * @return {IntMap<Vendor>} - list of vendors that have declared the consent purpose id
     */
    getVendorsWithConsentPurpose(purposeId) {
      return this.getFilteredVendors("purpose", purposeId, "consent");
    }
    /**
     * getVendorsWithLegIntPurpose
     *
     * @param {number} purposeId
     * @return {IntMap<Vendor>} - list of vendors that have declared the legInt (Legitimate Interest) purpose id
     */
    getVendorsWithLegIntPurpose(purposeId) {
      return this.getFilteredVendors("purpose", purposeId, "legInt");
    }
    /**
     * getVendorsWithFlexiblePurpose
     *
     * @param {number} purposeId
     * @return {IntMap<Vendor>} - list of vendors that have declared the flexible purpose id
     */
    getVendorsWithFlexiblePurpose(purposeId) {
      return this.getFilteredVendors("purpose", purposeId, "flexible");
    }
    /**
     * getVendorsWithSpecialPurpose
     *
     * @param {number} specialPurposeId
     * @return {IntMap<Vendor>} - list of vendors that have declared the special purpose id
     */
    getVendorsWithSpecialPurpose(specialPurposeId) {
      return this.getFilteredVendors("purpose", specialPurposeId, void 0, true);
    }
    /**
     * getVendorsWithFeature
     *
     * @param {number} featureId
     * @return {IntMap<Vendor>} - list of vendors that have declared the feature id
     */
    getVendorsWithFeature(featureId) {
      return this.getFilteredVendors("feature", featureId);
    }
    /**
     * getVendorsWithSpecialFeature
     *
     * @param {number} specialFeatureId
     * @return {IntMap<Vendor>} - list of vendors that have declared the special feature id
     */
    getVendorsWithSpecialFeature(specialFeatureId) {
      return this.getFilteredVendors("feature", specialFeatureId, void 0, true);
    }
    /**
     * vendors
     *
     * @return {IntMap<Vendor>} - the list of vendors as it would on the JSON file
     * except if `narrowVendorsTo` was called, it would be that narrowed list
     */
    get vendors() {
      return this.vendors_;
    }
    /**
     * narrowVendorsTo - narrows vendors represented in this GVL to the list of ids passed in
     *
     * @param {number[]} vendorIds - list of ids to narrow this GVL to
     * @return {void}
     */
    narrowVendorsTo(vendorIds) {
      this.mapVendors(vendorIds);
    }
    /**
     * isReady - Whether or not this instance is ready to be used.  This will be
     * immediately and synchronously true if a vendorlist object is passed into
     * the constructor or once the JSON vendorllist is retrieved.
     *
     * @return {boolean} whether or not the instance is ready to be interacted
     * with and all the data is populated
     */
    get isReady() {
      return this.isReady_;
    }
    /**
     * clone - overrides base `clone()` method since GVL is a special class that
     * represents a JSON structure with some additional functionality.
     *
     * @return {GVL}
     */
    clone() {
      const result = new _GVL(this.getJson());
      if (this.lang_ !== _GVL.DEFAULT_LANGUAGE) {
        result.changeLanguage(this.lang_);
      }
      return result;
    }
    static isInstanceOf(questionableInstance) {
      const isSo = typeof questionableInstance === "object";
      return isSo && typeof questionableInstance.narrowVendorsTo === "function";
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/TCModel.js
  var TCModel = class extends Cloneable {
    static {
      __name(this, "TCModel");
    }
    /**
     * Set of available consent languages published by the IAB
     */
    static consentLanguages = GVL.consentLanguages;
    isServiceSpecific_ = false;
    supportOOB_ = true;
    useNonStandardStacks_ = false;
    purposeOneTreatment_ = false;
    publisherCountryCode_ = "AA";
    version_ = 2;
    consentScreen_ = 0;
    policyVersion_ = 2;
    consentLanguage_ = "EN";
    cmpId_ = 0;
    cmpVersion_ = 0;
    vendorListVersion_ = 0;
    numCustomPurposes_ = 0;
    // Member Variable for GVL
    gvl_;
    created;
    lastUpdated;
    /**
     * The TCF designates certain Features as special, that is, a CMP must afford
     * the user a means to opt in to their use. These Special Features are
     * published and numbered in the GVL separately from normal Features.
     * Provides for up to 12 special features.
     */
    specialFeatureOptins = new Vector();
    /**
     * Renamed from `PurposesAllowed` in TCF v1.1
     * The user’s consent value for each Purpose established on the legal basis
     * of consent. Purposes are published in the Global Vendor List (see. [[GVL]]).
     */
    purposeConsents = new Vector();
    /**
     * The user’s permission for each Purpose established on the legal basis of
     * legitimate interest. If the user has exercised right-to-object for a
     * purpose.
     */
    purposeLegitimateInterests = new Vector();
    /**
     * The user’s consent value for each Purpose established on the legal basis
     * of consent, for the publisher.  Purposes are published in the Global
     * Vendor List.
     */
    publisherConsents = new Vector();
    /**
     * The user’s permission for each Purpose established on the legal basis of
     * legitimate interest.  If the user has exercised right-to-object for a
     * purpose.
     */
    publisherLegitimateInterests = new Vector();
    /**
     * The user’s consent value for each Purpose established on the legal basis
     * of consent, for the publisher.  Purposes are published in the Global
     * Vendor List.
     */
    publisherCustomConsents = new Vector();
    /**
     * The user’s permission for each Purpose established on the legal basis of
     * legitimate interest.  If the user has exercised right-to-object for a
     * purpose that is established in the publisher's custom purposes.
     */
    publisherCustomLegitimateInterests = new Vector();
    /**
     * set by a publisher if they wish to collect consent and LI Transparency for
     * purposes outside of the TCF
     */
    customPurposes;
    /**
     * Each [[Vendor]] is keyed by id. Their consent value is true if it is in
     * the Vector
     */
    vendorConsents = new Vector();
    /**
     * Each [[Vendor]] is keyed by id. Whether their Legitimate Interests
     * Disclosures have been established is stored as boolean.
     * see: [[Vector]]
     */
    vendorLegitimateInterests = new Vector();
    /**
     * The value included for disclosed vendors signals which vendors have been
     * disclosed to the user in the interface surfaced by the CMP. This section
     * content is required when writing a TC string to the global (consensu)
     * scope. When a CMP has read from and is updating a TC string from the
     * global consensu.org storage, the CMP MUST retain the existing disclosure
     * information and only add information for vendors that it has disclosed
     * that had not been disclosed by other CMPs in prior interactions with this
     * device/user agent.
     */
    vendorsDisclosed = new Vector();
    /**
     * Signals which vendors the publisher permits to use OOB legal bases.
     */
    vendorsAllowed = new Vector();
    publisherRestrictions = new PurposeRestrictionVector();
    /**
     * Constructs the TCModel. Passing a [[GVL]] is optional when constructing
     * as this TCModel may be constructed from decoding an existing encoded
     * TCString.
     *
     * @param {GVL} [gvl]
     */
    constructor(gvl) {
      super();
      if (gvl) {
        this.gvl = gvl;
      }
      this.updated();
    }
    /**
     * sets the [[GVL]] with side effects of also setting the `vendorListVersion`, `policyVersion`, and `consentLanguage`
     * @param {GVL} gvl
     */
    set gvl(gvl) {
      if (!GVL.isInstanceOf(gvl)) {
        gvl = new GVL(gvl);
      }
      this.gvl_ = gvl;
      this.publisherRestrictions.gvl = gvl;
    }
    /**
     * @return {GVL} the gvl instance set on this TCModel instance
     */
    get gvl() {
      return this.gvl_;
    }
    /**
     * @param {number} integer - A unique ID will be assigned to each Consent
     * Manager Provider (CMP) from the iab.
     *
     * @throws {TCModelError} if the value is not an integer greater than 1 as those are not valid.
     */
    set cmpId(integer) {
      integer = Number(integer);
      if (Number.isInteger(integer) && integer > 1) {
        this.cmpId_ = integer;
      } else {
        throw new TCModelError("cmpId", integer);
      }
    }
    get cmpId() {
      return this.cmpId_;
    }
    /**
     * Each change to an operating CMP should receive a
     * new version number, for logging proof of consent. CmpVersion defined by
     * each CMP.
     *
     * @param {number} integer
     *
     * @throws {TCModelError} if the value is not an integer greater than 1 as those are not valid.
     */
    set cmpVersion(integer) {
      integer = Number(integer);
      if (Number.isInteger(integer) && integer > -1) {
        this.cmpVersion_ = integer;
      } else {
        throw new TCModelError("cmpVersion", integer);
      }
    }
    get cmpVersion() {
      return this.cmpVersion_;
    }
    /**
     * The screen number is CMP and CmpVersion
     * specific, and is for logging proof of consent.(For example, a CMP could
     * keep records so that a publisher can request information about the context
     * in which consent was gathered.)
     *
     * @param {number} integer
     *
     * @throws {TCModelError} if the value is not an integer greater than 0 as those are not valid.
     */
    set consentScreen(integer) {
      integer = Number(integer);
      if (Number.isInteger(integer) && integer > -1) {
        this.consentScreen_ = integer;
      } else {
        throw new TCModelError("consentScreen", integer);
      }
    }
    get consentScreen() {
      return this.consentScreen_;
    }
    /**
     * @param {string} lang - [two-letter ISO 639-1 language
     * code](http://www.loc.gov/standards/iso639-2/php/code_list.php) in which
     * the CMP UI was presented
     *
     * @throws {TCModelError} if the value is not a length-2 string of alpha characters
     */
    set consentLanguage(lang) {
      this.consentLanguage_ = lang;
    }
    get consentLanguage() {
      return this.consentLanguage_;
    }
    /**
     * @param {string} countryCode - [two-letter ISO 3166-1 alpha-2 country
     * code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) of the publisher,
     * determined by the CMP-settings of the publisher.
     *
     * @throws {TCModelError} if the value is not a length-2 string of alpha characters
     */
    set publisherCountryCode(countryCode) {
      if (/^([A-z]){2}$/.test(countryCode)) {
        this.publisherCountryCode_ = countryCode.toUpperCase();
      } else {
        throw new TCModelError("publisherCountryCode", countryCode);
      }
    }
    get publisherCountryCode() {
      return this.publisherCountryCode_;
    }
    /**
     * Version of the GVL used to create this TCModel. Global
     * Vendor List versions will be released periodically.
     *
     * @param {number} integer
     *
     * @throws {TCModelError} if the value is not an integer greater than 0 as those are not valid.
     */
    set vendorListVersion(integer) {
      integer = Number(integer) >> 0;
      if (integer < 0) {
        throw new TCModelError("vendorListVersion", integer);
      } else {
        this.vendorListVersion_ = integer;
      }
    }
    get vendorListVersion() {
      if (this.gvl) {
        return this.gvl.vendorListVersion;
      } else {
        return this.vendorListVersion_;
      }
    }
    /**
     * From the corresponding field in the GVL that was
     * used for obtaining consent. A new policy version invalidates existing
     * strings and requires CMPs to re-establish transparency and consent from
     * users.
     *
     * If a TCF policy version number is different from the one from the latest
     * GVL, the CMP must re-establish transparency and consent.
     *
     * @param {number} num - You do not need to set this.  This comes
     * directly from the [[GVL]].
     *
     */
    set policyVersion(num) {
      this.policyVersion_ = parseInt(num, 10);
      if (this.policyVersion_ < 0) {
        throw new TCModelError("policyVersion", num);
      }
    }
    get policyVersion() {
      if (this.gvl) {
        return this.gvl.tcfPolicyVersion;
      } else {
        return this.policyVersion_;
      }
    }
    set version(num) {
      this.version_ = parseInt(num, 10);
    }
    get version() {
      return this.version_;
    }
    /**
     * Whether the signals encoded in this TC String were from site-specific
     * storage `true` versus ‘global’ consensu.org shared storage `false`. A
     * string intended to be stored in global/shared scope but the CMP is unable
     * to store due to a user agent not accepting third-party cookies would be
     * considered site-specific `true`.
     *
     * @param {boolean} bool - value to set. Some changes to other fields in this
     * model will automatically change this value like adding publisher
     * restrictions.
     */
    set isServiceSpecific(bool) {
      this.isServiceSpecific_ = bool;
    }
    get isServiceSpecific() {
      return this.isServiceSpecific_;
    }
    /**
     * Non-standard stacks means that a CMP is using publisher-customized stack
     * descriptions. Stacks (in terms of purposes in a stack) are pre-set by the
     * IAB. As are titles. Descriptions are pre-set, but publishers can customize
     * them. If they do, they need to set this bit to indicate that they've
     * customized descriptions.
     *
     * @param {boolean} bool - value to set
     */
    set useNonStandardStacks(bool) {
      this.useNonStandardStacks_ = bool;
    }
    get useNonStandardStacks() {
      return this.useNonStandardStacks_;
    }
    /**
     * Whether or not this publisher supports OOB signaling.  On Global TC String
     * OOB Vendors Disclosed will be included if the publish wishes to no allow
     * these vendors they should set this to false.
     * @param {boolean} bool - value to set
     */
    set supportOOB(bool) {
      this.supportOOB_ = bool;
    }
    get supportOOB() {
      return this.supportOOB_;
    }
    /**
     * `false` There is no special Purpose 1 status.
     * Purpose 1 was disclosed normally (consent) as expected by Policy.  `true`
     * Purpose 1 not disclosed at all. CMPs use PublisherCC to indicate the
     * publisher’s country of establishment to help Vendors determine whether the
     * vendor requires Purpose 1 consent. In global scope TC strings, this field
     * must always have a value of `false`. When a CMP encounters a global scope
     * string with `purposeOneTreatment=true` then that string should be
     * considered invalid and the CMP must re-establish transparency and consent.
     *
     * @param {boolean} bool
     */
    set purposeOneTreatment(bool) {
      this.purposeOneTreatment_ = bool;
    }
    get purposeOneTreatment() {
      return this.purposeOneTreatment_;
    }
    /**
     * setAllVendorConsents - sets all vendors on the GVL Consent (true)
     *
     * @return {void}
     */
    setAllVendorConsents() {
      this.vendorConsents.set(this.gvl.vendors);
    }
    /**
     * unsetAllVendorConsents - unsets all vendors on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllVendorConsents() {
      this.vendorConsents.empty();
    }
    /**
     * setAllVendorsDisclosed - sets all vendors on the GVL Vendors Disclosed (true)
     *
     * @return {void}
     */
    setAllVendorsDisclosed() {
      this.vendorsDisclosed.set(this.gvl.vendors);
    }
    /**
     * unsetAllVendorsDisclosed - unsets all vendors on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllVendorsDisclosed() {
      this.vendorsDisclosed.empty();
    }
    /**
     * setAllVendorsAllowed - sets all vendors on the GVL Consent (true)
     *
     * @return {void}
     */
    setAllVendorsAllowed() {
      this.vendorsAllowed.set(this.gvl.vendors);
    }
    /**
     * unsetAllVendorsAllowed - unsets all vendors on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllVendorsAllowed() {
      this.vendorsAllowed.empty();
    }
    /**
     * setAllVendorLegitimateInterests - sets all vendors on the GVL LegitimateInterests (true)
     *
     * @return {void}
     */
    setAllVendorLegitimateInterests() {
      this.vendorLegitimateInterests.set(this.gvl.vendors);
    }
    /**
     * unsetAllVendorLegitimateInterests - unsets all vendors on the GVL LegitimateInterests (false)
     *
     * @return {void}
     */
    unsetAllVendorLegitimateInterests() {
      this.vendorLegitimateInterests.empty();
    }
    /**
     * setAllPurposeConsents - sets all purposes on the GVL Consent (true)
     *
     * @return {void}
     */
    setAllPurposeConsents() {
      this.purposeConsents.set(this.gvl.purposes);
    }
    /**
     * unsetAllPurposeConsents - unsets all purposes on the GVL Consent (false)
     *
     * @return {void}
     */
    unsetAllPurposeConsents() {
      this.purposeConsents.empty();
    }
    /**
     * setAllPurposeLegitimateInterests - sets all purposes on the GVL LI Transparency (true)
     *
     * @return {void}
     */
    setAllPurposeLegitimateInterests() {
      this.purposeLegitimateInterests.set(this.gvl.purposes);
    }
    /**
     * unsetAllPurposeLegitimateInterests - unsets all purposes on the GVL LI Transparency (false)
     *
     * @return {void}
     */
    unsetAllPurposeLegitimateInterests() {
      this.purposeLegitimateInterests.empty();
    }
    /**
     * setAllSpecialFeatureOptins - sets all special featuresOptins on the GVL (true)
     *
     * @return {void}
     */
    setAllSpecialFeatureOptins() {
      this.specialFeatureOptins.set(this.gvl.specialFeatures);
    }
    /**
     * unsetAllSpecialFeatureOptins - unsets all special featuresOptins on the GVL (true)
     *
     * @return {void}
     */
    unsetAllSpecialFeatureOptins() {
      this.specialFeatureOptins.empty();
    }
    setAll() {
      this.setAllVendorConsents();
      this.setAllPurposeLegitimateInterests();
      this.setAllSpecialFeatureOptins();
      this.setAllPurposeConsents();
      this.setAllVendorLegitimateInterests();
    }
    unsetAll() {
      this.unsetAllVendorConsents();
      this.unsetAllPurposeLegitimateInterests();
      this.unsetAllSpecialFeatureOptins();
      this.unsetAllPurposeConsents();
      this.unsetAllVendorLegitimateInterests();
    }
    get numCustomPurposes() {
      let len = this.numCustomPurposes_;
      if (typeof this.customPurposes === "object") {
        const purposeIds = Object.keys(this.customPurposes).sort((a, b) => Number(a) - Number(b));
        len = parseInt(purposeIds.pop(), 10);
      }
      return len;
    }
    set numCustomPurposes(num) {
      this.numCustomPurposes_ = parseInt(num, 10);
      if (this.numCustomPurposes_ < 0) {
        throw new TCModelError("numCustomPurposes", num);
      }
    }
    /**
     * updated - updates the created and lastUpdated dates with a 'now' day-level UTC timestamp
     *
     * @return {void}
     */
    updated() {
      const date = /* @__PURE__ */ new Date();
      const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
      this.created = utcDate;
      this.lastUpdated = utcDate;
    }
  };

  // node_modules/@iabtcf/core/lib/mjs/TCString.js
  var TCString = class {
    static {
      __name(this, "TCString");
    }
    /**
     * encodes a model into a TCString
     *
     * @param {TCModel} tcModel - model to convert into encoded string
     * @param {EncodingOptions} options - for encoding options other than default
     * @return {string} - base64url encoded Transparency and Consent String
     */
    static encode(tcModel, options) {
      let out = "";
      let sequence;
      tcModel = SemanticPreEncoder.process(tcModel, options);
      if (Array.isArray(options?.segments)) {
        sequence = options.segments;
      } else {
        sequence = new SegmentSequence(tcModel, options)["" + tcModel.version];
      }
      sequence.forEach((segment, idx) => {
        let dotMaybe = "";
        if (idx < sequence.length - 1) {
          dotMaybe = ".";
        }
        out += SegmentEncoder.encode(tcModel, segment) + dotMaybe;
      });
      return out;
    }
    /**
     * Decodes a string into a TCModel
     *
     * @param {string} encodedTCString - base64url encoded Transparency and
     * Consent String to decode - can also be a single or group of segments of
     * the string
     * @param {string} [tcModel] - model to enhance with the information.  If
     * none is passed a new instance of TCModel will be created.
     * @return {TCModel} - Returns populated TCModel
     */
    static decode(encodedTCString, tcModel) {
      const segments = encodedTCString.split(".");
      const len = segments.length;
      if (!tcModel) {
        tcModel = new TCModel();
      }
      for (let i = 0; i < len; i++) {
        const segString = segments[i];
        const firstChar = Base64Url.decode(segString.charAt(0));
        const segTypeBits = firstChar.substr(0, BitLength.segmentType);
        const segment = SegmentIDs.ID_TO_KEY[IntEncoder.decode(segTypeBits, BitLength.segmentType).toString()];
        SegmentEncoder.decode(segString, tcModel, segment);
      }
      return tcModel;
    }
  };

  // scripts/templates/tcf-api.js
  var userHasInteracted = localStorage.getItem("euconsent-v2") !== null;
  var vectorToEntries = /* @__PURE__ */ __name((vector) => {
    if (!vector || typeof vector.forEach !== "function") return {};
    const entries = {};
    vector.forEach((value, id) => {
      if (value === true) entries[id] = true;
    });
    return entries;
  }, "vectorToEntries");
  var decode = null;
  var initDecode = /* @__PURE__ */ __name(() => {
    if (!decode) {
      if (typeof TCString.decode === "function") {
        decode = TCString.decode;
      } else {
        warnIfDev("\u274C TCString.decode is not available");
        throw new Error("TCString.decode is not available");
      }
    }
    return decode;
  }, "initDecode");
  var GVL_URL = `${CC_SERVER_URL}/banner`;
  var logIfDev = /* @__PURE__ */ __name((...args) => {
    if (!IS_PROD) console.log(...args);
  }, "logIfDev");
  var warnIfDev = /* @__PURE__ */ __name((...args) => {
    if (!IS_PROD) console.warn(...args);
  }, "warnIfDev");
  var gvlInstance = null;
  var initGVL = /* @__PURE__ */ __name(async () => {
    try {
      logIfDev("\u23F3 Initializing GVL...");
      if (gvlInstance) {
        await gvlInstance.readyPromise;
        logIfDev("\u2705 GVL already initialized");
        return gvlInstance;
      }
      GVL.baseUrl = GVL_URL;
      gvlInstance = new GVL();
      const timeoutPromise = new Promise((_, reject2) => {
        setTimeout(() => {
          warnIfDev("\u274C GVL initialization timeout");
          reject2(new Error("GVL initialization timeout"));
        }, 5e3);
      });
      try {
        await Promise.race([gvlInstance.readyPromise, timeoutPromise]);
        logIfDev("\u2705 GVL initialized successfully");
        return gvlInstance;
      } catch (error) {
        warnIfDev("\u274C Error during GVL initialization:", error);
        gvlInstance = null;
        throw error;
      }
    } catch (error) {
      warnIfDev("\u274C Error initializing GVL:", error);
      throw error;
    }
  }, "initGVL");
  var isGDPRApplicable = /* @__PURE__ */ __name((countryCode) => {
    if (!countryCode) return false;
    const gdprCountries = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
      "IS",
      "LI",
      "NO"
    ];
    return gdprCountries.includes(countryCode.toUpperCase());
  }, "isGDPRApplicable");
  var getGDPRStatus = /* @__PURE__ */ __name(() => {
    try {
      if (window.__ccGeoInfo && window.__ccGeoInfo.countryCode) {
        return isGDPRApplicable(window.__ccGeoInfo.countryCode);
      }
      const userLanguage = navigator.language || navigator.userLanguage;
      if ([
        "de",
        "fr",
        "es",
        "it",
        "nl",
        "pl",
        "pt",
        "sv",
        "da",
        "fi",
        "no",
        "is"
      ].some((lang) => userLanguage.startsWith(lang))) {
        return true;
      }
      const hostname = window.location.hostname.toLowerCase();
      return [
        ".eu",
        ".de",
        ".fr",
        ".it",
        ".es",
        ".nl",
        ".pl",
        ".pt",
        ".se",
        ".dk",
        ".fi",
        ".no",
        ".is"
      ].some((suffix) => hostname.endsWith(suffix));
    } catch (error) {
      warnIfDev("\u274C Error determining GDPR status:", error);
      return false;
    }
  }, "getGDPRStatus");
  var getVendorListData = /* @__PURE__ */ __name(async (version) => {
    try {
      logIfDev("\u{1F4CB} Getting vendor list data, version:", version);
      const gvl = gvlInstance || await initGVL();
      const vendors = {};
      const purposes = {};
      const specialFeatures = {};
      Object.entries(gvl.vendors).forEach(([id, vendor]) => {
        vendors[id] = {
          id: Number(id),
          name: vendor.name,
          purposes: vendor.purposes,
          legIntPurposes: vendor.legIntPurposes,
          flexiblePurposes: vendor.flexiblePurposes,
          specialPurposes: vendor.specialPurposes,
          features: vendor.features,
          specialFeatures: vendor.specialFeatures,
          policyUrl: vendor.policyUrl,
          cookieMaxAgeSeconds: vendor.cookieMaxAgeSeconds,
          usesCookies: vendor.usesCookies,
          cookieRefresh: vendor.cookieRefresh,
          usesNonCookieAccess: vendor.usesNonCookieAccess,
          deviceStorageDisclosureUrl: vendor.deviceStorageDisclosureUrl,
          deletedDate: vendor.deletedDate,
          overflow: vendor.overflow,
          dataRetention: vendor.dataRetention,
          urls: vendor.urls,
          dataDeclaration: vendor.dataDeclaration
        };
      });
      Object.entries(gvl.purposes).forEach(([id, purpose]) => {
        purposes[id] = {
          id: Number(id),
          name: purpose.name,
          description: purpose.description,
          descriptionLegal: purpose.descriptionLegal,
          illustrations: purpose.illustrations
        };
      });
      if (gvl.specialFeatures) {
        Object.entries(gvl.specialFeatures).forEach(([id, feature]) => {
          specialFeatures[id] = {
            id: Number(id),
            name: feature.name,
            description: feature.description,
            descriptionLegal: feature.descriptionLegal,
            illustrations: feature.illustrations
          };
        });
      }
      const features = {};
      if (gvl.features) {
        Object.entries(gvl.features).forEach(([id, feature]) => {
          features[id] = {
            id: Number(id),
            name: feature.name,
            description: feature.description,
            descriptionLegal: feature.descriptionLegal,
            illustrations: feature.illustrations
          };
        });
      }
      const stacks = {};
      if (gvl.stacks) {
        Object.entries(gvl.stacks).forEach(([id, stack]) => {
          stacks[id] = {
            id: Number(id),
            name: stack.name,
            description: stack.description,
            purposes: stack.purposes
          };
        });
      }
      const response = {
        vendorListVersion: parseInt(gvl.vendorListVersion),
        lastUpdated: gvl.lastUpdated,
        gvlSpecificationVersion: parseInt(gvl.gvlSpecificationVersion),
        tcfPolicyVersion: parseInt(gvl.tcfPolicyVersion),
        vendorList: {
          vendors,
          purposes,
          specialFeatures,
          features,
          stacks
        }
      };
      logIfDev("\u{1F4CB} Vendor list response structure:", {
        vendorListVersion: response.vendorListVersion,
        vendorCount: Object.keys(vendors).length,
        purposeCount: Object.keys(purposes).length,
        specialFeatureCount: Object.keys(specialFeatures).length,
        featureCount: Object.keys(features).length,
        stackCount: Object.keys(stacks).length,
        gvlSpecificationVersion: response.gvlSpecificationVersion,
        tcfPolicyVersion: response.tcfPolicyVersion
      });
      return response;
    } catch (error) {
      warnIfDev("\u274C Error getting vendor list:", error);
      throw error;
    }
  }, "getVendorListData");
  var injectTcfApiLocator = /* @__PURE__ */ __name(() => {
    if (!document.querySelector('iframe[name="__tcfapiLocator"]')) {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("name", "__tcfapiLocator");
      iframe.style.display = "none";
      (document.body || document.documentElement).appendChild(iframe);
    }
  }, "injectTcfApiLocator");
  var saveConsent = /* @__PURE__ */ __name(async (accepted) => {
    try {
      const gvl = await initGVL();
      const tcModel = new TCModel(gvl);
      await gvl.readyPromise;
      tcModel.cmpId = 10;
      tcModel.cmpVersion = 1;
      tcModel.consentScreen = 0;
      tcModel.consentLanguage = "EN";
      tcModel.publisherCountryCode = "US";
      tcModel.purposeOneTreatment = false;
      tcModel.vendorListVersion = gvl.vendorListVersion;
      for (const purposeId of Object.keys(gvl.purposes)) {
        const id = Number(purposeId);
        tcModel.purposeConsents.set(id, accepted);
        tcModel.purposeLegitimateInterests.set(id, accepted);
      }
      for (const vendorId of Object.keys(gvl.vendors)) {
        const id = Number(vendorId);
        tcModel.vendorConsents.set(id, accepted);
        tcModel.vendorLegitimateInterests.set(id, accepted);
      }
      if (gvl.specialFeatures && Object.keys(gvl.specialFeatures).length > 0 && tcModel.specialFeatureOptIns?.set) {
        for (const featureId of Object.keys(gvl.specialFeatures)) {
          const id = Number(featureId);
          tcModel.specialFeatureOptIns.set(id, accepted);
        }
      }
      const tcString = TCString.encode(tcModel);
      logIfDev("\u2705 Generated TCString:", {
        length: tcString.length,
        preview: tcString.substring(0, 50) + "...",
        accepted
      });
      document.cookie = `euconsent-v2=${tcString}; path=/; SameSite=None; Secure`;
      localStorage.setItem("euconsent-v2", tcString);
      localStorage.setItem("consentAccepted", String(accepted));
      window.__tcString = tcString;
    } catch (error) {
      warnIfDev("\u274C Error saving consent:", error);
      throw error;
    }
  }, "saveConsent");
  var validateTCString = /* @__PURE__ */ __name((tcString) => {
    if (!tcString || typeof tcString !== "string") {
      return { valid: false, error: "TCString is not a valid string" };
    }
    try {
      if (!/^[A-Za-z0-9+/=]+$/.test(tcString)) {
        return { valid: false, error: "TCString format is invalid" };
      }
      const decodedModel = initDecode()(tcString);
      if (!decodedModel) {
        return { valid: false, error: "TCString decode failed" };
      }
      if (!decodedModel.cmpId || !decodedModel.vendorListVersion) {
        return { valid: false, error: "TCString missing required fields" };
      }
      return { valid: true, model: decodedModel };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }, "validateTCString");
  var registerTcfApi = /* @__PURE__ */ __name(() => {
    logIfDev("\u23F3 Registrando __tcfapi");
    initDecode();
    const eventListeners = /* @__PURE__ */ new Set();
    let cmpStatus = "loading";
    const createTCDataResponse = /* @__PURE__ */ __name((model, tcString, includeInApp = false) => {
      if (!tcString || typeof tcString !== "string") {
        tcString = localStorage.getItem("euconsent-v2") || "";
        if (!tcString) {
          warnIfDev("\u274C No valid TCString available for response");
          tcString = "";
        }
      }
      const validation = validateTCString(tcString);
      if (!validation.valid) {
        warnIfDev("\u274C TCString validation failed:", validation.error);
        try {
          if (gvlInstance) {
            const newTcModel = new TCModel(gvlInstance);
            newTcModel.cmpId = 10;
            newTcModel.cmpVersion = 1;
            newTcModel.consentScreen = 0;
            newTcModel.consentLanguage = "EN";
            newTcModel.publisherCountryCode = "US";
            newTcModel.purposeOneTreatment = false;
            newTcModel.vendorListVersion = gvlInstance.vendorListVersion;
            for (const purposeId of Object.keys(gvlInstance.purposes)) {
              const id = Number(purposeId);
              newTcModel.purposeConsents.set(id, false);
              newTcModel.purposeLegitimateInterests.set(id, false);
            }
            for (const vendorId of Object.keys(gvlInstance.vendors)) {
              const id = Number(vendorId);
              newTcModel.vendorConsents.set(id, false);
              newTcModel.vendorLegitimateInterests.set(id, false);
            }
            tcString = TCString.encode(newTcModel);
            localStorage.setItem("euconsent-v2", tcString);
            window.__tcString = tcString;
            model = newTcModel;
            logIfDev("\u2705 Generated new valid TCString after validation failure");
          }
        } catch (err) {
          warnIfDev(
            "\u274C Error generating new TCString after validation failure:",
            err
          );
          tcString = "";
        }
      } else {
        model = validation.model;
      }
      const gdprApplies = getGDPRStatus();
      const tcfPolicyVersion = gvlInstance?.tcfPolicyVersion || 2;
      const response = {
        tcString,
        tcfPolicyVersion: parseInt(tcfPolicyVersion),
        // Use TCF policy version from GVL
        gdprApplies,
        // Use proper GDPR detection
        cmpId: parseInt(model.cmpId),
        cmpVersion: parseInt(model.cmpVersion),
        consentScreen: parseInt(model.consentScreen),
        consentLanguage: model.consentLanguage,
        vendorListVersion: parseInt(model.vendorListVersion),
        publisherCC: model.publisherCountryCode,
        purposeOneTreatment: model.purposeOneTreatment,
        isServiceSpecific: true,
        useNonStandardStacks: model.useNonStandardStacks,
        specialFeatureOptins: model.specialFeatureOptIns ? vectorToEntries(model.specialFeatureOptIns) : {},
        purpose: {
          consents: vectorToEntries(model.purposeConsents),
          legitimateInterests: vectorToEntries(model.purposeLegitimateInterests)
        },
        vendor: {
          consents: vectorToEntries(model.vendorConsents),
          legitimateInterests: vectorToEntries(model.vendorLegitimateInterests)
        },
        publisher: {
          consents: vectorToEntries(model.publisherConsents),
          legitimateInterests: vectorToEntries(
            model.publisherLegitimateInterests
          ),
          customPurpose: {
            consents: vectorToEntries(model.publisherCustomConsents),
            legitimateInterests: vectorToEntries(
              model.publisherCustomLegitimateInterests
            )
          },
          restrictions: model.publisherRestrictions && model.publisherRestrictions.restrictions ? Object.fromEntries(
            Array.from(
              model.publisherRestrictions.restrictions.entries()
            ).map(([purposeId, vendors]) => [
              purposeId,
              Object.fromEntries(
                Array.from(vendors.entries()).map(
                  ([vendorId, restrictionType]) => [
                    vendorId,
                    restrictionType
                  ]
                )
              )
            ])
          ) : {}
        },
        eventStatus: "tcloaded",
        cmpStatus,
        displayStatus: userHasInteracted ? "disabled" : "visible",
        apiVersion: parseInt(2)
      };
      if (includeInApp) {
        response.inApp = { ...response };
      }
      return response;
    }, "createTCDataResponse");
    const createFallbackResponse = /* @__PURE__ */ __name((status = "stub") => {
      let tcString = localStorage.getItem("euconsent-v2") || "";
      if (!tcString) {
        try {
          if (gvlInstance) {
            const tcModel = new TCModel(gvlInstance);
            tcModel.cmpId = 10;
            tcModel.cmpVersion = 1;
            tcModel.consentScreen = 0;
            tcModel.consentLanguage = "EN";
            tcModel.publisherCountryCode = "US";
            tcModel.purposeOneTreatment = false;
            tcModel.vendorListVersion = gvlInstance.vendorListVersion;
            if (gvlInstance.purposes) {
              for (const purposeId of Object.keys(gvlInstance.purposes)) {
                const id = Number(purposeId);
                tcModel.purposeConsents.set(id, false);
                tcModel.purposeLegitimateInterests.set(id, false);
              }
            }
            if (gvlInstance.vendors) {
              for (const vendorId of Object.keys(gvlInstance.vendors)) {
                const id = Number(vendorId);
                tcModel.vendorConsents.set(id, false);
                tcModel.vendorLegitimateInterests.set(id, false);
              }
            }
            tcString = TCString.encode(tcModel);
            localStorage.setItem("euconsent-v2", tcString);
            window.__tcString = tcString;
            logIfDev("\u2705 Generated fallback TCString:", {
              length: tcString.length,
              preview: tcString.substring(0, 50) + "...",
              vendorListVersion: gvlInstance.vendorListVersion
            });
          }
        } catch (err) {
          warnIfDev("\u274C Error creating fallback TCString:", err);
          tcString = "";
        }
      }
      const gdprApplies = getGDPRStatus();
      const tcfPolicyVersion = gvlInstance?.tcfPolicyVersion || 2;
      return {
        tcString,
        tcfPolicyVersion: parseInt(tcfPolicyVersion),
        // Use TCF policy version from GVL
        gdprApplies,
        // Use proper GDPR detection
        cmpId: parseInt(10),
        cmpVersion: parseInt(1),
        consentScreen: parseInt(0),
        consentLanguage: "EN",
        vendorListVersion: parseInt(gvlInstance?.vendorListVersion || 0),
        publisherCC: "US",
        purposeOneTreatment: false,
        isServiceSpecific: true,
        useNonStandardStacks: false,
        specialFeatureOptins: {},
        purpose: {
          consents: {},
          legitimateInterests: {}
        },
        vendor: {
          consents: {},
          legitimateInterests: {}
        },
        publisher: {
          consents: {},
          legitimateInterests: {},
          customPurpose: {
            consents: {},
            legitimateInterests: {}
          },
          restrictions: {}
        },
        eventStatus: "tcloaded",
        cmpStatus: status,
        displayStatus: userHasInteracted ? "disabled" : "visible",
        apiVersion: parseInt(2)
      };
    }, "createFallbackResponse");
    window.__tcfapi = (command, version, callback, parameter) => {
      logIfDev("\u{1F9EA} __tcfapi called:", { command, version, parameter, cmpStatus });
      if (typeof callback !== "function") {
        warnIfDev("\u274C Callback is not a function");
        return;
      }
      if (command === "ping") {
        const gdprApplies = getGDPRStatus();
        const response = {
          gdprApplies,
          // Correct field name as per TCF specification
          cmpLoaded: cmpStatus !== "loading",
          // Only true if we're past loading state
          cmpStatus,
          displayStatus: userHasInteracted ? "disabled" : "visible",
          apiVersion: parseInt(2),
          gvlVersion: parseInt(gvlInstance?.vendorListVersion || 0),
          tcfPolicyVersion: parseInt(gvlInstance?.tcfPolicyVersion || 2),
          // Read from GVL instead of hardcoding
          cmpId: parseInt(10),
          cmpVersion: parseInt(1),
          cmpDisplayStatus: userHasInteracted ? "disabled" : "visible",
          cmpApiVersion: parseInt(2),
          cmpTcfPolicyVersion: parseInt(gvlInstance?.tcfPolicyVersion || 2),
          // Read from GVL
          cmpGvlVersion: parseInt(gvlInstance?.vendorListVersion || 0)
        };
        logIfDev("\u{1F3D3} Ping response:", response);
        callback(response, true);
        return;
      }
      if (command === "addEventListener") {
        logIfDev("\u{1F4DD} Adding event listener, current status:", cmpStatus);
        eventListeners.add(callback);
        if (cmpStatus === "loaded") {
          try {
            const tcString = localStorage.getItem("euconsent-v2");
            if (tcString) {
              const model = initDecode()(tcString);
              const response = createTCDataResponse(model, tcString);
              logIfDev("\u{1F4E4} addEventListener response (loaded state):", response);
              callback(response, true);
            } else {
              logIfDev(
                "\u{1F4E4} addEventListener response (loaded state, no TCString)"
              );
              callback(createFallbackResponse("loaded"), true);
            }
          } catch (err) {
            warnIfDev("\u274C Error in addEventListener initial state:", err);
            callback(createFallbackResponse("error"), true);
          }
        } else if (cmpStatus === "stub") {
          try {
            const basicResponse = createFallbackResponse("stub");
            logIfDev("\u{1F4E4} addEventListener response (stub state):", basicResponse);
            callback(basicResponse, true);
          } catch (err) {
            warnIfDev("\u274C Error in addEventListener stub state:", err);
            callback(createFallbackResponse("error"), true);
          }
        } else if (cmpStatus === "error") {
          logIfDev("\u{1F4E4} addEventListener response (error state)");
          callback(createFallbackResponse("error"), true);
        } else {
          logIfDev("\u{1F4E4} addEventListener added to listeners (loading state)");
          callback(null, true);
        }
        return;
      }
      if (command === "removeEventListener") {
        logIfDev("\u{1F5D1}\uFE0F Removing event listener");
        eventListeners.delete(callback);
        logIfDev("\u2705 Event listener removed successfully");
        callback(true, true);
        return;
      }
      if (cmpStatus !== "loaded" && command !== "ping") {
        if ((command === "getTCData" || command === "getInAppTCData" || command === "getVendorList") && (cmpStatus === "stub" || cmpStatus === "loading")) {
          (/* @__PURE__ */ __name(async function handleStubCommand() {
            try {
              if (command === "getVendorList") {
                try {
                  const vendorList = await getVendorListData(version);
                  logIfDev(
                    "\u{1F4E4} getVendorList response (stub/loading state):",
                    vendorList
                  );
                  callback(vendorList, true);
                } catch (err) {
                  warnIfDev(
                    "\u274C Error in getVendorList (stub/loading state):",
                    err
                  );
                  const fallbackResponse = {
                    vendorListVersion: parseInt(0),
                    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
                    gvlSpecificationVersion: parseInt(3),
                    tcfPolicyVersion: parseInt(
                      gvlInstance?.tcfPolicyVersion || 2
                    ),
                    vendorList: {
                      vendors: {},
                      purposes: {},
                      specialFeatures: {},
                      features: {},
                      stacks: {}
                    }
                  };
                  logIfDev(
                    "\u{1F4E4} getVendorList fallback response (stub/loading error):",
                    fallbackResponse
                  );
                  callback(fallbackResponse, true);
                }
                return;
              }
              const gvl = gvlInstance || await initGVL();
              const tcModel = new TCModel(gvl);
              tcModel.cmpId = 10;
              tcModel.cmpVersion = 1;
              tcModel.consentScreen = 0;
              tcModel.consentLanguage = "EN";
              tcModel.publisherCountryCode = "US";
              tcModel.purposeOneTreatment = false;
              tcModel.vendorListVersion = gvl.vendorListVersion;
              for (const purposeId of Object.keys(gvl.purposes)) {
                const id = Number(purposeId);
                tcModel.purposeConsents.set(id, false);
                tcModel.purposeLegitimateInterests.set(id, false);
              }
              for (const vendorId of Object.keys(gvl.vendors)) {
                const id = Number(vendorId);
                tcModel.vendorConsents.set(id, false);
                tcModel.vendorLegitimateInterests.set(id, false);
              }
              if (gvl.specialFeatures && Object.keys(gvl.specialFeatures).length > 0 && tcModel.specialFeatureOptIns && typeof tcModel.specialFeatureOptIns.set === "function") {
                for (const featureId of Object.keys(gvl.specialFeatures)) {
                  const id = Number(featureId);
                  tcModel.specialFeatureOptIns.set(id, false);
                }
              }
              const tcString = TCString.encode(tcModel);
              logIfDev("\u2705 Generated TCString (stub state):", {
                length: tcString.length,
                preview: tcString.substring(0, 50) + "...",
                vendorListVersion: gvl.vendorListVersion
              });
              localStorage.setItem("euconsent-v2", tcString);
              window.__tcString = tcString;
              const response = createTCDataResponse(
                tcModel,
                tcString,
                command === "getInAppTCData"
              );
              logIfDev(`\u{1F4E4} ${command} response (stub/loading state):`, response);
              callback(response, true);
            } catch (err) {
              warnIfDev("\u274C Error in stub/loading state command handling:", err);
              if (command === "getVendorList") {
                const fallbackResponse = {
                  vendorListVersion: parseInt(0),
                  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
                  gvlSpecificationVersion: parseInt(3),
                  tcfPolicyVersion: parseInt(gvlInstance?.tcfPolicyVersion || 2),
                  vendorList: {
                    vendors: {},
                    purposes: {},
                    specialFeatures: {},
                    features: {},
                    stacks: {}
                  }
                };
                logIfDev(
                  "\u{1F4E4} getVendorList fallback response (stub error):",
                  fallbackResponse
                );
                callback(fallbackResponse, true);
              } else {
                callback(createFallbackResponse("stub"), true);
              }
            }
          }, "handleStubCommand"))();
          return;
        }
        warnIfDev(
          `\u274C CMP not ready (status: ${cmpStatus}) for command:`,
          command
        );
        if (command === "getVendorList") {
          const fallbackResponse = {
            vendorListVersion: parseInt(0),
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
            gvlSpecificationVersion: parseInt(3),
            tcfPolicyVersion: parseInt(gvlInstance?.tcfPolicyVersion || 2),
            vendorList: {
              vendors: {},
              purposes: {},
              specialFeatures: {},
              features: {},
              stacks: {}
            }
          };
          logIfDev(
            "\u{1F4E4} getVendorList fallback response (CMP not ready):",
            fallbackResponse
          );
          callback(fallbackResponse, true);
        } else {
          callback(createFallbackResponse(cmpStatus), true);
        }
        return;
      }
      if (command === "getVendorList") {
        (/* @__PURE__ */ __name(async function handleGetVendorList() {
          try {
            logIfDev("\u{1F4CB} Handling getVendorList command");
            const vendorList = await getVendorListData(version);
            logIfDev("\u{1F4CB} Vendor list response:", vendorList);
            callback(vendorList, true);
          } catch (error) {
            warnIfDev("\u274C Error in getVendorList:", error);
            const fallbackResponse = {
              vendorListVersion: parseInt(0),
              lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
              gvlSpecificationVersion: parseInt(3),
              tcfPolicyVersion: parseInt(gvlInstance?.tcfPolicyVersion || 2),
              vendorList: {
                vendors: {},
                purposes: {},
                specialFeatures: {},
                features: {},
                stacks: {}
              }
            };
            logIfDev("\u{1F4CB} Vendor list fallback response:", fallbackResponse);
            callback(fallbackResponse, true);
          }
        }, "handleGetVendorList"))();
        return;
      }
      if (command === "getTCData" || command === "getInAppTCData") {
        try {
          logIfDev(`\u{1F4CB} Handling ${command} command`);
          const tcString = localStorage.getItem("euconsent-v2");
          if (tcString) {
            const validation = validateTCString(tcString);
            if (!validation.valid) {
              warnIfDev(
                `\u274C TCString validation failed in ${command}:`,
                validation.error
              );
              if (gvlInstance) {
                const newTcModel = new TCModel(gvlInstance);
                newTcModel.cmpId = 10;
                newTcModel.cmpVersion = 1;
                newTcModel.consentScreen = 0;
                newTcModel.consentLanguage = "EN";
                newTcModel.publisherCountryCode = "US";
                newTcModel.purposeOneTreatment = false;
                newTcModel.vendorListVersion = gvlInstance.vendorListVersion;
                for (const purposeId of Object.keys(gvlInstance.purposes)) {
                  const id = Number(purposeId);
                  newTcModel.purposeConsents.set(id, false);
                  newTcModel.purposeLegitimateInterests.set(id, false);
                }
                for (const vendorId of Object.keys(gvlInstance.vendors)) {
                  const id = Number(vendorId);
                  newTcModel.vendorConsents.set(id, false);
                  newTcModel.vendorLegitimateInterests.set(id, false);
                }
                const newTcString = TCString.encode(newTcModel);
                localStorage.setItem("euconsent-v2", newTcString);
                window.__tcString = newTcString;
                logIfDev("\u2705 Generated new valid TCString for getTCData");
                const response2 = createTCDataResponse(
                  newTcModel,
                  newTcString,
                  command === "getInAppTCData"
                );
                logIfDev(`\u{1F4E4} ${command} response (with new TCString):`, response2);
                callback(response2, true);
              } else {
                throw new Error("GVL not available for TCString generation");
              }
              return;
            }
          }
          if (!tcString || typeof tcString !== "string") {
            throw new Error("Invalid TCString format");
          }
          const model = initDecode()(tcString);
          const response = createTCDataResponse(
            model,
            tcString,
            command === "getInAppTCData"
          );
          logIfDev(`\u{1F4E4} ${command} response:`, response);
          callback(response, true);
          if (command === "getTCData") {
            eventListeners.forEach((listener) => {
              try {
                listener(response, true);
              } catch (err) {
                warnIfDev("\u274C Error in event listener:", err);
              }
            });
          }
        } catch (err) {
          warnIfDev(`\u274C Error in ${command}:`, err);
          const fallbackResponse = createFallbackResponse();
          logIfDev(`\u{1F4E4} ${command} fallback response:`, fallbackResponse);
          callback(fallbackResponse, true);
        }
        return;
      }
      warnIfDev("\u274C Unknown command:", command);
      callback(createFallbackResponse("error"), true);
    };
    window.addEventListener("message", (event) => {
      if (typeof event.data === "object" && event.data.__tcfapiCall) {
        const { command, version, parameter, callId } = event.data.__tcfapiCall;
        logIfDev("\u{1F4E8} Received postMessage:", {
          command,
          version,
          parameter,
          callId
        });
        window.__tcfapi(
          command,
          version,
          (returnValue, success) => {
            const returnMsg = {
              __tcfapiReturn: {
                returnValue,
                success,
                callId
              }
            };
            logIfDev("\u{1F4E4} Sending postMessage response:", returnMsg);
            event.source?.postMessage(returnMsg, "*");
          },
          parameter
        );
      }
    });
    const initializeCMP = /* @__PURE__ */ __name(async () => {
      try {
        logIfDev("\u23F3 Starting CMP initialization...");
        cmpStatus = "loading";
        await initGVL();
        logIfDev("\u2705 GVL initialized, checking TCString...");
        const tcString = localStorage.getItem("euconsent-v2") || "";
        if (tcString) {
          try {
            const validation = validateTCString(tcString);
            if (validation.valid) {
              logIfDev("\u2705 TCString verified successfully");
              cmpStatus = "loaded";
            } else {
              throw new Error(`Invalid TCString: ${validation.error}`);
            }
          } catch (err) {
            warnIfDev("\u274C Invalid TCString in localStorage:", err);
            try {
              const tcModel = new TCModel(gvlInstance);
              tcModel.cmpId = 10;
              tcModel.cmpVersion = 1;
              tcModel.consentScreen = 0;
              tcModel.consentLanguage = "EN";
              tcModel.publisherCountryCode = "US";
              tcModel.purposeOneTreatment = false;
              tcModel.vendorListVersion = gvlInstance.vendorListVersion;
              for (const purposeId of Object.keys(gvlInstance.purposes)) {
                const id = Number(purposeId);
                tcModel.purposeConsents.set(id, false);
                tcModel.purposeLegitimateInterests.set(id, false);
              }
              for (const vendorId of Object.keys(gvlInstance.vendors)) {
                const id = Number(vendorId);
                tcModel.vendorConsents.set(id, false);
                tcModel.vendorLegitimateInterests.set(id, false);
              }
              const newTcString = TCString.encode(tcModel);
              localStorage.setItem("euconsent-v2", newTcString);
              window.__tcString = newTcString;
              logIfDev("\u2705 Generated new TCString:", {
                length: newTcString.length,
                preview: newTcString.substring(0, 50) + "...",
                vendorListVersion: gvlInstance.vendorListVersion
              });
              cmpStatus = "loaded";
            } catch (genErr) {
              warnIfDev("\u274C Error generating new TCString:", genErr);
              cmpStatus = "stub";
            }
          }
        } else {
          logIfDev("\u2139\uFE0F No TCString found, generating new one");
          try {
            const tcModel = new TCModel(gvlInstance);
            tcModel.cmpId = 10;
            tcModel.cmpVersion = 1;
            tcModel.consentScreen = 0;
            tcModel.consentLanguage = "EN";
            tcModel.publisherCountryCode = "US";
            tcModel.purposeOneTreatment = false;
            tcModel.vendorListVersion = gvlInstance.vendorListVersion;
            for (const purposeId of Object.keys(gvlInstance.purposes)) {
              const id = Number(purposeId);
              tcModel.purposeConsents.set(id, false);
              tcModel.purposeLegitimateInterests.set(id, false);
            }
            for (const vendorId of Object.keys(gvlInstance.vendors)) {
              const id = Number(vendorId);
              tcModel.vendorConsents.set(id, false);
              tcModel.vendorLegitimateInterests.set(id, false);
            }
            const newTcString = TCString.encode(tcModel);
            localStorage.setItem("euconsent-v2", newTcString);
            window.__tcString = newTcString;
            logIfDev("\u2705 Generated new TCString:", {
              length: newTcString.length,
              preview: newTcString.substring(0, 50) + "...",
              vendorListVersion: gvlInstance.vendorListVersion
            });
            cmpStatus = "loaded";
          } catch (genErr) {
            warnIfDev("\u274C Error generating new TCString:", genErr);
            cmpStatus = "stub";
          }
        }
        logIfDev(`\u2705 CMP initialization complete, status: ${cmpStatus}`);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const event = new CustomEvent("tcfApiReady", {
          detail: { status: cmpStatus }
        });
        window.dispatchEvent(event);
        window.__tcfapiLocatorReady = true;
        if (cmpStatus === "loaded") {
          const tcString2 = localStorage.getItem("euconsent-v2");
          const model = initDecode()(tcString2);
          const response = createTCDataResponse(model, tcString2);
          eventListeners.forEach((listener) => {
            try {
              listener(response, true);
            } catch (err) {
              warnIfDev("\u274C Error in event listener:", err);
            }
          });
        } else if (cmpStatus === "stub") {
          eventListeners.forEach((listener) => {
            try {
              const basicResponse = createFallbackResponse("stub");
              listener(basicResponse, true);
            } catch (err) {
              warnIfDev("\u274C Error in event listener (stub state):", err);
            }
          });
        }
      } catch (err) {
        warnIfDev("\u274C Error initializing CMP:", err);
        cmpStatus = "error";
        const event = new CustomEvent("tcfApiReady", {
          detail: { status: "error", error: err.message }
        });
        window.dispatchEvent(event);
        window.__tcfapiLocatorReady = true;
      }
    }, "initializeCMP");
    initializeCMP().catch((err) => {
      warnIfDev("\u274C Fatal error during CMP initialization:", err);
      cmpStatus = "error";
    });
  }, "registerTcfApi");
  var forceRegenerateTCString = /* @__PURE__ */ __name(async () => {
    try {
      logIfDev("\u{1F504} Forcing TCString regeneration...");
      const gvl = await initGVL();
      await gvl.readyPromise;
      const tcModel = new TCModel(gvl);
      tcModel.cmpId = 10;
      tcModel.cmpVersion = 1;
      tcModel.consentScreen = 0;
      tcModel.consentLanguage = "EN";
      tcModel.publisherCountryCode = "US";
      tcModel.purposeOneTreatment = false;
      tcModel.vendorListVersion = gvl.vendorListVersion;
      for (const purposeId of Object.keys(gvl.purposes)) {
        const id = Number(purposeId);
        tcModel.purposeConsents.set(id, false);
        tcModel.purposeLegitimateInterests.set(id, false);
      }
      for (const vendorId of Object.keys(gvl.vendors)) {
        const id = Number(vendorId);
        tcModel.vendorConsents.set(id, false);
        tcModel.vendorLegitimateInterests.set(id, false);
      }
      if (gvl.specialFeatures && Object.keys(gvl.specialFeatures).length > 0 && tcModel.specialFeatureOptIns?.set) {
        for (const featureId of Object.keys(gvl.specialFeatures)) {
          const id = Number(featureId);
          tcModel.specialFeatureOptIns.set(id, false);
        }
      }
      const tcString = TCString.encode(tcModel);
      localStorage.setItem("euconsent-v2", tcString);
      window.__tcString = tcString;
      document.cookie = `euconsent-v2=${tcString}; path=/; SameSite=None; Secure`;
      logIfDev("\u2705 TCString regenerated and stored:", {
        length: tcString.length,
        preview: tcString.substring(0, 50) + "...",
        vendorListVersion: gvl.vendorListVersion,
        storedIn: ["localStorage", "window.__tcString", "cookie"]
      });
      return tcString;
    } catch (error) {
      warnIfDev("\u274C Error forcing TCString regeneration:", error);
      throw error;
    }
  }, "forceRegenerateTCString");
  var waitForBodyAndInitTcfApi = /* @__PURE__ */ __name(async () => {
    window.__tcfapiLocatorReady = false;
    injectTcfApiLocator();
    registerTcfApi();
    if (!document.body) {
      const observer = new MutationObserver(() => {
        if (document.body && !document.querySelector('iframe[name="__tcfapiLocator"]')) {
          injectTcfApiLocator();
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
    try {
      const gvl = await initGVL();
      await gvl.readyPromise;
      if (!localStorage.getItem("euconsent-v2")) {
        logIfDev("\u{1F504} No TCString found, generating initial consent (after GVL)");
        await saveConsent(false);
      } else {
        logIfDev("\u2705 TCString already exists in localStorage");
        const existingTCString = localStorage.getItem("euconsent-v2");
        const validation = validateTCString(existingTCString);
        if (!validation.valid) {
          logIfDev("\u26A0\uFE0F Existing TCString is invalid, regenerating...");
          await forceRegenerateTCString();
        }
      }
    } catch (error) {
      warnIfDev("\u274C Error while waiting for GVL before saving consent:", error);
    }
    window.__tcfapi?.("getTCData", 2, (data, success) => {
      if (success) {
        logIfDev("\u{1F4E5} Forzado getTCData para CMP Validator:", data);
      } else {
        warnIfDev("\u274C getTCData fall\xF3 al forzar para CMP Validator");
      }
    });
    setTimeout(async () => {
      try {
        const tcString = localStorage.getItem("euconsent-v2") || window.__tcString;
        if (!tcString) {
          logIfDev(
            "\u26A0\uFE0F No TCString found, forcing regeneration for CMP Validator"
          );
          await forceRegenerateTCString();
        } else {
          const validation = validateTCString(tcString);
          if (!validation.valid) {
            logIfDev(
              "\u26A0\uFE0F TCString validation failed, regenerating for CMP Validator"
            );
            await forceRegenerateTCString();
          }
        }
        window.__tcfapi?.("getTCData", 2, (data, success) => {
          if (success) {
            logIfDev("\u{1F4E5} Second getTCData call for CMP Validator:", data);
          }
        });
      } catch (err) {
        warnIfDev("\u274C Error in CMP Validator compatibility measures:", err);
      }
    }, 2e3);
    setTimeout(() => {
      if (!window.__tcfapiLocatorReady) {
        logIfDev("\u26A0\uFE0F CMP not ready after timeout, forcing initialization");
        window.__tcfapiLocatorReady = true;
      }
    }, 3e3);
  }, "waitForBodyAndInitTcfApi");

  // scripts/captain-consent-script.js
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  __name(gtag, "gtag");
  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted"
  });
  waitForBodyAndInitTcfApi();
  function toggleActions(shadowRoot) {
    const privacyLabels = shadowRoot.querySelectorAll(".privacy-label");
    const toggleAccordion = /* @__PURE__ */ __name((e) => {
      e.currentTarget.classList.toggle("active");
      e.currentTarget.parentElement.nextElementSibling.querySelector("p").classList.toggle("active");
      if (e.currentTarget.parentElement.nextElementSibling.style.maxHeight) {
        e.currentTarget.parentElement.nextElementSibling.style.maxHeight = null;
      } else {
        e.currentTarget.parentElement.nextElementSibling.style.maxHeight = e.currentTarget.parentElement.nextElementSibling.scrollHeight + "px";
      }
    }, "toggleAccordion");
    privacyLabels.forEach((label) => {
      label.addEventListener("click", toggleAccordion);
    });
    const doNotSellSwitch = shadowRoot.getElementById(
      "DO_NOT_SELL_PERSONAL_INFORMATION"
    );
    const targetingSwitch = shadowRoot.getElementById("TARGETING_COOKIES");
    if (doNotSellSwitch && targetingSwitch) {
      doNotSellSwitch.addEventListener("change", function() {
        if (this.checked) {
          targetingSwitch.checked = false;
          targetingSwitch.removeAttribute("checked");
          updateLabelState(targetingSwitch, false);
        }
      });
      targetingSwitch.addEventListener("change", function() {
        if (this.checked) {
          doNotSellSwitch.checked = false;
          doNotSellSwitch.removeAttribute("checked");
          updateLabelState(doNotSellSwitch, false);
        }
      });
    }
  }
  __name(toggleActions, "toggleActions");
  function setGTMDataLayer(event, data) {
    window.dataLayer = window.dataLayer || [];
    const cookies = data?.selectedCookies || {};
    window.dataLayer.push({
      event,
      captainComplianceConsent: {
        ...data
      }
    });
    gtag("consent", "update", {
      analytics_storage: cookies.PERFORMANCE_COOKIES ? "granted" : "denied",
      ad_storage: cookies.TARGETING_COOKIES ? "granted" : "denied",
      ad_user_data: cookies.TARGETING_COOKIES ? "granted" : "denied",
      ad_personalization: cookies.TARGETING_COOKIES ? "granted" : "denied",
      functionality_storage: cookies.FUNCTIONALITY_COOKIES ? "granted" : "denied",
      security_storage: cookies.STRICTLY_NECESSARY_COOKIES ? "granted" : "denied"
    });
  }
  __name(setGTMDataLayer, "setGTMDataLayer");
  function checkIfAllSwitchesAreOff(bannerDisplays) {
    if (!bannerDisplays?.length) return false;
    return (bannerDisplays || []).every(({ display }) => !display);
  }
  __name(checkIfAllSwitchesAreOff, "checkIfAllSwitchesAreOff");
  function getModalPosition(positionX, positionY, mode) {
    let top, bottom, left, right = "unset";
    const positionValue = mode === CC_STANDARD_MODE_BANNER_LINEAL ? "0px" : "10px";
    if (positionY === "top") {
      top = positionValue;
    } else if (positionY === "bottom") {
      bottom = positionValue;
    } else if (positionY === "middle") {
      top = "50%";
    }
    if (positionX === "left") {
      left = positionValue;
    } else if (positionX === "right") {
      right = positionValue;
    } else if (positionX === "middle") {
      left = "50%";
    }
    return {
      top,
      bottom,
      left,
      right
    };
  }
  __name(getModalPosition, "getModalPosition");
  function getModalTranslate(positionX, positionY) {
    let vertical, horizontal = "0px";
    if (positionY === "middle") {
      vertical = "-50%";
    }
    if (positionX === "middle") {
      horizontal = "50%";
    }
    return {
      vertical,
      horizontal
    };
  }
  __name(getModalTranslate, "getModalTranslate");
  function addStyleToShadowRoot(cssString, shadowRoot) {
    const template = document.createElement("template");
    template.innerHTML = cssString.trim();
    const styleElement = template.content.querySelector("style");
    if (styleElement) {
      shadowRoot.appendChild(styleElement);
    } else {
      console.warn(
        "Provided CSS string doesn't contain a valid <style> tag:",
        cssString
      );
    }
  }
  __name(addStyleToShadowRoot, "addStyleToShadowRoot");
  function createConsentBannerStyles(bannerConfiguration, banner, cssModal, cssSettings, cssIcon, shadowRoot, isGPCEnabled) {
    const { mode, styles } = bannerConfiguration;
    const { bottom, left, right, top } = getModalPosition(
      styles.positionX,
      styles.positionY,
      mode
    );
    const { vertical, horizontal } = getModalTranslate(
      styles.positionX,
      styles.positionY
    );
    const modalClosed = sessionStorage.getItem(CC_COOKIE_MODAL) === "true" || isGPCEnabled;
    const showCookieVillain = bannerConfiguration.overrideGlobalSettings ? bannerConfiguration.alwaysShowIcon : banner.alwaysShowIcon;
    const forceDisplayCookieIcon = mode === CC_STANDARD_MODE_ONLY_SETTINGS || modalClosed || showCookieVillain;
    const shouldHidden = styles.defaultHidden || forceDisplayCookieIcon || modalClosed || !shouldDisplayBanner(bannerConfiguration, banner);
    const modalNodeStyles = `
    <style type="text/css">
      html {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
    *, *:before, *:after {
      -webkit-box-sizing: inherit;
      -moz-box-sizing: inherit;
      box-sizing: inherit;
      }
      :host {
            --compliance-theme: ${styles.theme};
            --compliance-position-top: ${top};
            --compliance-position-left: ${left};
            --compliance-position-right: ${right};
            --compliance-position-bottom: ${bottom};
            --compliance-transform-vertical: ${vertical};
            --compliance-transform-horizontal: ${horizontal};
            --compliance-border-radius: ${styles.borderRadius};
            --compliance-default-hidden: ${shouldHidden ? "hidden" : "visible"};
            --compliance-default-hidden-cookie: ${forceDisplayCookieIcon ? "visible" : "hidden"};
        }
        h1, h2, h3, h4, p {
          margin: 0;
        }
    </style>
  `;
    addStyleToShadowRoot(modalNodeStyles, shadowRoot);
    addStyleToShadowRoot(cssSettings, shadowRoot);
    addStyleToShadowRoot(cssModal, shadowRoot);
    addStyleToShadowRoot(cssIcon, shadowRoot);
  }
  __name(createConsentBannerStyles, "createConsentBannerStyles");
  function getItemConfiguration(bannerDisplays, id) {
    const foundItem = (bannerDisplays || []).find(
      ({ cookieTypeId }) => cookieTypeId === id
    );
    return foundItem || {
      display: true,
      checked: false
    };
  }
  __name(getItemConfiguration, "getItemConfiguration");
  function createSwitchList(switchData, bannerDisplays) {
    const preferences = (() => {
      try {
        const cookie = getCookie(`${CC_COOKIE_MODAL}_preference`);
        return cookie ? JSON.parse(cookie) : null;
      } catch {
        return null;
      }
    })();
    const selectedCookies = preferences?.selectedCookies || {};
    const finalSwitchData = switchData.sort((a, b) => {
      if (a.order !== void 0 || b.order !== void 0) {
        return (a.order ?? Infinity) - (b.order ?? Infinity);
      }
      return 0;
    }).reduce((html, { key, name, id }) => {
      const item = getItemConfiguration(bannerDisplays, id);
      if (key === "UNCLASSIFIED_COOKIES" || !item?.display) {
        return html;
      }
      const switchStatus = selectedCookies[key] ?? item?.checked;
      const isStrictlyNecessary = key === "STRICTLY_NECESSARY_COOKIES";
      const isChecked = isStrictlyNecessary || switchStatus;
      const attributes = [
        isChecked ? "checked" : "",
        isStrictlyNecessary ? "disabled checked" : ""
      ].filter(Boolean).join(" ");
      const switchItem = `
      <div class="captain-compliance-modal-settings-body_content_switch_list_item">
        <div class="captain-compliance-modal-settings-body_content_switch_list_item_preset">
          <input type="checkbox" id="${key}" ${attributes} />
          <label for="${key}">Toggle</label>
        </div>
        <p class="captain-compliance-modal-settings-body_content_switch_list_item_preset_label">
          ${name.replace("cookies", "")}
        </p>
      </div>
    `;
      return html + switchItem;
    }, "");
    const doNotSellPersonalInfoAttributes = preferences?.notSellPersonalInfo ? "checked" : "";
    const doNotSellPersonalInfo = `
  <div class="captain-compliance-modal-settings-body_content_switch_list_item" style=" padding-top: 10px; padding-bottom: 10px; padding: 10px 5px; margin-top: 15px; border-top: 1px solid lightgray;">
        <div class="captain-compliance-modal-settings-body_content_switch_list_item_preset">
          <input type="checkbox" id="${CC_MODE_DO_NOT_SELL_PERSONAL_INFO}" ${doNotSellPersonalInfoAttributes} />
          <label for="${CC_MODE_DO_NOT_SELL_PERSONAL_INFO}">Toggle</label>
        </div>
        <p class="captain-compliance-modal-settings-body_content_switch_list_item_preset_label">
          Do Not Sell or Share My Personal Information
        </p>
      </div>
  `;
    return finalSwitchData + doNotSellPersonalInfo;
  }
  __name(createSwitchList, "createSwitchList");
  function generateHtmlModalNode() {
    const modalNode = document.createElement("div");
    modalNode.classList.add("captain-compliance-modal-container");
    modalNode.style.display = "block";
    const shadowRoot = modalNode.attachShadow({ mode: "open" });
    document.body.appendChild(modalNode);
    return shadowRoot;
  }
  __name(generateHtmlModalNode, "generateHtmlModalNode");
  function addModal(bannerConfiguration, switchData, bannerDisplays, report, html, htmlSettingsModal, htmlIcon, shadowRoot, isGPCEnabled) {
    const hasImage = bannerConfiguration.displayLogo && !!bannerConfiguration.image;
    const shouldNotDisplayPartialButton = checkIfAllSwitchesAreOff(bannerDisplays);
    const switchList = createSwitchList(switchData, bannerDisplays);
    shadowRoot.innerHTML += htmlSettingsModal;
    shadowRoot.innerHTML += !isGPCEnabled ? htmlIcon : "";
    if (parseFloat(bannerConfiguration.overlay) > 0) {
      shadowRoot.innerHTML += `
    <div id="${CC_OVERLAY_ID}" style=" position: absolute; z-index: 9999999999; height: 100vh; width: 100vw; top: 0; left: 0; background: black; opacity: ${bannerConfiguration.overlay};"></div>
    `;
    }
    if (html && !isGPCEnabled) {
      shadowRoot.innerHTML += html;
    }
    const image = shadowRoot.querySelector(
      "#captain-compliance-modal-bn-body_content_icon_id"
    );
    const switchWrapper = shadowRoot.querySelector(
      "#captain-compliance-modal-settings-body_content_switch_list_id"
    );
    const cookieSettingsButton = shadowRoot.querySelector(
      "#cc-modal-cookie-settings"
    );
    const modalTitle = shadowRoot.querySelector(
      "#captain-compliance-modal-bn-body_content_text_title_id"
    );
    const modalDescription = shadowRoot.querySelector(
      "#captain-compliance-modal-bn-body_content_text_description_id"
    );
    const modalTransparencyPage = shadowRoot.querySelector(
      "#captain-compliance-modal-bn-body_footer_transparency_id"
    );
    if (modalTransparencyPage && report.active) {
      modalTransparencyPage.href = `https://${report.cname}.cookietransparency.com`;
    } else if (modalTransparencyPage) {
      modalTransparencyPage.remove();
    }
    if (modalTitle && !!bannerConfiguration.title.length) {
      modalTitle.textContent = bannerConfiguration.title;
    } else if (modalTitle) {
      modalTitle.remove();
    }
    if (modalDescription && !!bannerConfiguration.description.length) {
      modalDescription.textContent = bannerConfiguration.description;
    } else if (modalDescription) {
      modalDescription.remove();
    }
    if (switchWrapper && !shouldNotDisplayPartialButton) {
      switchWrapper.innerHTML += switchList;
    } else if (switchWrapper && cookieSettingsButton) {
      switchWrapper.remove();
      cookieSettingsButton.remove();
    }
    if (image && hasImage) {
      image.src = bannerConfiguration.image;
    } else if (image) {
      image.remove();
    }
  }
  __name(addModal, "addModal");
  function mergeCookieList(cookieList) {
    const firstPartyValues = Object.keys(cookieList.firstParty);
    const dataToReturn = firstPartyValues.reduce((accumulator, key) => {
      if (CC_MODES_ALLOWED.includes(key)) return accumulator;
      return [
        ...accumulator,
        ...cookieList.firstParty[key].data,
        ...cookieList.thirdParty[key].data
      ];
    }, []).map(({ name, domain, path, regex }) => ({ name, domain, path, regex }));
    return dataToReturn;
  }
  __name(mergeCookieList, "mergeCookieList");
  function getCookieTypesToNotRemove(shadowRoot, switchData) {
    return switchData.reduce((accumulator, { key }) => {
      const checked = shadowRoot.getElementById(key)?.checked;
      if (checked || CC_MODES_ALLOWED.includes(key)) {
        return [...accumulator, key];
      }
      return accumulator;
    }, []);
  }
  __name(getCookieTypesToNotRemove, "getCookieTypesToNotRemove");
  function removeKeyFromObject(cookieList, listToNotRemove) {
    const localCookieList = { ...cookieList };
    listToNotRemove.forEach((key) => {
      delete localCookieList.firstParty[key];
      delete localCookieList.thirdParty[key];
    });
    return localCookieList;
  }
  __name(removeKeyFromObject, "removeKeyFromObject");
  function addCookie(suffix, value, dueDays) {
    var now = /* @__PURE__ */ new Date();
    var time = now.getTime();
    var expireTime;
    if (typeof dueDays === "number" && !isNaN(dueDays)) {
      expireTime = time + 1e3 * 60 * 60 * 24 * dueDays;
    } else {
      expireTime = time + 1e3 * 60 * 60 * 24 * 30;
    }
    now.setTime(expireTime);
    document.cookie = `${CC_COOKIE_MODAL}_${suffix}=${value}; Expires=` + now.toUTCString() + "; Path=/;";
  }
  __name(addCookie, "addCookie");
  function closeModal(shadowRoot, scannerId, dueDays, isGPCEnabled) {
    if (!isGPCEnabled) {
      shadowRoot.getElementById(CC_MODAL_ID).style.display = "none";
    }
    addCookie(scannerId, "ok", dueDays);
  }
  __name(closeModal, "closeModal");
  function addClickHandlerByClass(shadowRoot, className, cb) {
    const elements = shadowRoot.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.onclick = function() {
        cb();
      };
    });
  }
  __name(addClickHandlerByClass, "addClickHandlerByClass");
  function triggerAllowedRemove(cookieList, listToNotRemove, callbackUrl) {
    const listUpdated = removeKeyFromObject(cookieList, listToNotRemove);
    reject(mergeCookieList(listUpdated), callbackUrl);
  }
  __name(triggerAllowedRemove, "triggerAllowedRemove");
  function handlePartialAllowedRemove(shadowRoot, switchData, cookieList, callbackUrl) {
    const listToNotRemove = getCookieTypesToNotRemove(shadowRoot, switchData);
    triggerAllowedRemove(cookieList, listToNotRemove, callbackUrl);
  }
  __name(handlePartialAllowedRemove, "handlePartialAllowedRemove");
  function handleDisplayModalSettings(modal, modalSettings, isGPCEnabled) {
    return () => {
      if (!isGPCEnabled) {
        modal.style.display = "none";
      }
      modalSettings.style.visibility = "visible";
    };
  }
  __name(handleDisplayModalSettings, "handleDisplayModalSettings");
  function fillSwitchesFromPreferences(shadowRoot, switchData, gtmData) {
    const userPreferenceCookie = gtmData ?? getCookie(`${CC_COOKIE_MODAL}_preference`);
    if (!userPreferenceCookie) return;
    let preferences;
    try {
      preferences = typeof userPreferenceCookie === "object" ? userPreferenceCookie : JSON.parse(userPreferenceCookie);
    } catch (error) {
      console.error("Error parsing cookie preferences:", error);
      return;
    }
    const selectedCookies = preferences.selectedCookies || {};
    if (preferences?.notSellPersonalInfo) {
      selectedCookies[CC_MODE_DO_NOT_SELL_PERSONAL_INFO] = true;
    }
    [...switchData, { key: CC_MODE_DO_NOT_SELL_PERSONAL_INFO }].forEach(
      ({ key }) => {
        const switchElement = shadowRoot.getElementById(key);
        if (!switchElement) return;
        const isStrictlyNecessary = key === "STRICTLY_NECESSARY_COOKIES";
        const isChecked = isStrictlyNecessary || selectedCookies?.[key] || false;
        updateSwitchState(switchElement, isChecked, isStrictlyNecessary);
        updateLabelState(switchElement, isChecked);
      }
    );
  }
  __name(fillSwitchesFromPreferences, "fillSwitchesFromPreferences");
  function updateSwitchState(element, isChecked, isStrictlyNecessary) {
    element.checked = isChecked;
    if (isChecked) {
      element.setAttribute("checked", "");
    } else {
      element.removeAttribute("checked");
    }
    if (isStrictlyNecessary) {
      element.setAttribute("disabled", "");
    } else {
      element.removeAttribute("disabled");
    }
  }
  __name(updateSwitchState, "updateSwitchState");
  function updateLabelState(switchElement, isChecked) {
    const parentPreset = switchElement.closest(
      ".captain-compliance-modal-settings-body_content_switch_list_item_preset"
    );
    parentPreset?.querySelector("label")?.classList.toggle("active", isChecked);
  }
  __name(updateLabelState, "updateLabelState");
  async function handleDataLayerReporting(gtmData, dueDays) {
    const data = await bannerTagTracking(gtmData);
    const dataWithId = { ...gtmData, id: data.id };
    addCookie("preference", JSON.stringify(dataWithId), dueDays);
    setGTMDataLayer("captainComplianceConsent", dataWithId);
  }
  __name(handleDataLayerReporting, "handleDataLayerReporting");
  function modalActions(cookieList, switchData, banner, configuration, shadowRoot, geoInfo, isGPCEnabled, scripts) {
    const { scannerId, id: bannerId } = banner;
    const redirectURL = configuration?.webLink || "https://captaincompliance.com/solutions/cookie-consent-manager/";
    const modal = shadowRoot.getElementById(CC_MODAL_ID);
    const modalSettings = shadowRoot.getElementById(CC_MODAL_ID_SETTINGS);
    const selectedCookieButton = shadowRoot.getElementById(
      "cc-cookie-simple-button_id"
    );
    const overlay = shadowRoot.getElementById(CC_OVERLAY_ID);
    const handleDisplayModalSettingsTrigger = handleDisplayModalSettings(
      modal,
      modalSettings,
      isGPCEnabled
    );
    if (selectedCookieButton) {
      selectedCookieButton.onclick = function() {
        if (configuration.mode === CC_STANDARD_MODE_ONLY_SETTINGS && modalSettings) {
          modalSettings.style.visibility = "visible";
        } else if (modal) {
          modal.style.display = "block";
          modal.style.visibility = "visible";
          sessionStorage.removeItem(CC_COOKIE_MODAL);
        }
        selectedCookieButton.style.visibility = "hidden";
      };
      addClickHandlerByClass(
        shadowRoot,
        "cc-modal-logo-footer-compliance",
        () => window.open(redirectURL, "_blank")
      );
    }
    const selectedModalCloseButton = shadowRoot.getElementById("cc-modal-close-all");
    if (selectedModalCloseButton) {
      selectedModalCloseButton.onclick = function() {
        const cookieRemoved = isCookieRemoved(`${CC_COOKIE_MODAL}_${scannerId}`);
        const hasThirdPartyClass = modal?.classList.contains(
          "cc-trigger-from-third-party"
        );
        if (cookieRemoved && modal && !hasThirdPartyClass) {
          modal.style.display = "block";
        }
        if (configuration.mode === CC_STANDARD_MODE_ONLY_SETTINGS) {
          selectedCookieButton.style.visibility = "visible";
        }
        if (modalSettings) {
          modalSettings.style.visibility = "hidden";
          fillSwitchesFromPreferences(shadowRoot, switchData);
        }
      };
    }
    const partialAllowedButton = shadowRoot.getElementById(
      "cc-modal-allow-selection"
    );
    if (partialAllowedButton) {
      partialAllowedButton.onclick = function() {
        closeModal(shadowRoot, scannerId, configuration.dueDays, isGPCEnabled);
        updateStatus(bannerId, "PARTIALLY_ALLOWED");
        modalSettings.style.visibility = "hidden";
        handlePartialAllowedRemove(
          shadowRoot,
          switchData,
          cookieList,
          configuration?.callbackUrl
        );
        const selectedCookies = switchData.reduce((accumulator, { key }) => {
          const checked = shadowRoot.getElementById(key)?.checked ?? false;
          return { ...accumulator, [key]: checked };
        }, {});
        const doNotSellPersonalInfoSwitch = shadowRoot.getElementById(
          CC_MODE_DO_NOT_SELL_PERSONAL_INFO
        );
        if (overlay) {
          overlay.style.visibility = "hidden";
        }
        const doNotSellPersonalInfoEnabled = doNotSellPersonalInfoSwitch?.checked ?? false;
        const gtmData = {
          status: "PARTIALLY_ALLOWED",
          scannerId,
          bannerId,
          geoInfo,
          notSellPersonalInfo: doNotSellPersonalInfoEnabled,
          selectedCookies,
          scripts,
          callbackUrl: configuration?.callbackUrl || ""
        };
        restoreScripts(selectedCookies);
        saveConsent(true);
        handleDataLayerReporting(gtmData, configuration.dueDays);
        fillSwitchesFromPreferences(shadowRoot, switchData, gtmData);
      };
    }
    const allowAllButton = shadowRoot.getElementById("cc-modal-allow-all");
    if (allowAllButton) {
      allowAllButton.onclick = function() {
        const restoredCookies = {
          STRICTLY_NECESSARY_COOKIES: true,
          TARGETING_COOKIES: true,
          FUNCTIONALITY_COOKIES: true,
          PERFORMANCE_COOKIES: true,
          UNCLASSIFIED_COOKIES: true
        };
        restoreScripts(restoredCookies);
        closeModal(shadowRoot, scannerId, configuration.dueDays, isGPCEnabled);
        updateStatus(bannerId, "ALLOWED");
        reject([]);
        const gtmData = {
          status: "ALLOWED",
          scannerId,
          bannerId,
          geoInfo,
          notSellPersonalInfo: false,
          selectedCookies: restoredCookies,
          scripts,
          callbackUrl: ""
        };
        if (overlay) {
          overlay.style.visibility = "hidden";
        }
        saveConsent(true);
        handleDataLayerReporting(gtmData, configuration.dueDays);
        fillSwitchesFromPreferences(shadowRoot, switchData, gtmData);
      };
    }
    const rejectAllButton = shadowRoot.getElementById("cc-modal-reject-all");
    if (rejectAllButton) {
      rejectAllButton.onclick = function() {
        const rejectedCookies = {
          STRICTLY_NECESSARY_COOKIES: false,
          TARGETING_COOKIES: false,
          FUNCTIONALITY_COOKIES: false,
          PERFORMANCE_COOKIES: false,
          UNCLASSIFIED_COOKIES: false
        };
        blockScripts(scripts, rejectedCookies);
        closeModal(shadowRoot, scannerId, configuration.dueDays, isGPCEnabled);
        updateStatus(bannerId, "REJECTED");
        reject(mergeCookieList(cookieList), configuration?.callbackUrl);
        const gtmData = {
          status: "REJECTED",
          scannerId,
          bannerId,
          geoInfo,
          notSellPersonalInfo: false,
          selectedCookies: rejectedCookies,
          scripts,
          callbackUrl: configuration?.callbackUrl || ""
        };
        if (overlay) {
          overlay.style.visibility = "hidden";
        }
        saveConsent(false);
        handleDataLayerReporting(gtmData, configuration.dueDays);
        fillSwitchesFromPreferences(shadowRoot, switchData, gtmData);
      };
    }
    const modalCloseIconButton = shadowRoot.getElementById(
      "cc-cookie-simple-button-close_id"
    );
    if (modalCloseIconButton) {
      modalCloseIconButton.onclick = function() {
        modal.style.display = "none";
        selectedCookieButton.style.visibility = "visible";
        sessionStorage.setItem(CC_COOKIE_MODAL, "true");
      };
    }
    const externalButton = document.getElementById("id-open-settings-cc");
    if (externalButton) {
      externalButton.addEventListener("click", () => {
        if (!isGPCEnabled) {
          modal?.classList?.add("cc-trigger-from-third-party");
        }
        handleDisplayModalSettingsTrigger();
      });
    } else {
      document.body.addEventListener("click", function(event) {
        if (event.target && event.target.id === "id-open-settings-cc") {
          if (!isGPCEnabled) {
            modal?.classList?.add("cc-trigger-from-third-party");
          }
          handleDisplayModalSettingsTrigger();
        }
      });
    }
    addClickHandlerByClass(
      shadowRoot,
      "captain-compliance-open-settings",
      handleDisplayModalSettingsTrigger
    );
  }
  __name(modalActions, "modalActions");
  async function safeRemoveCookiesOnList(cookieList) {
    await new Promise((resolve) => setTimeout(resolve, 3e3));
    const preferenceCookie = getCookie(`${CC_COOKIE_MODAL}_preference`);
    const preferenceData = preferenceCookie ? JSON.parse(preferenceCookie) : {};
    const callbackUrl = preferenceData.callbackUrl || "";
    await removeCookiesOnList(cookieList, callbackUrl);
  }
  __name(safeRemoveCookiesOnList, "safeRemoveCookiesOnList");
  async function sendCookieListToEndpoint(cookieList, callbackUrl) {
    try {
      const response = await fetch(callbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ cookieList })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Cookie list sent");
      return true;
    } catch (error) {
      console.error("Error sending cookie list to endpoint:", error);
      throw error;
    }
  }
  __name(sendCookieListToEndpoint, "sendCookieListToEndpoint");
  async function removeCookiesOnList(cookieList, callbackUrl) {
    const regex = new RegExp(`${CC_COOKIE_MODAL}_\\d+`);
    const cookies = document.cookie.split(";");
    const cookiesServer = await getCookiesFromServer();
    const cookiesServerArray = cookiesServer.cookies ? Object.keys(cookiesServer.cookies) : [];
    const fromServer = [];
    cookieList.forEach((cookieItem) => {
      const prefix = cookieItem.name;
      fromServer.push(prefix);
      [...cookies, ...cookiesServerArray].forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        const isMatch = name.startsWith(prefix) && name.length >= prefix.length;
        const isRegexMatch = cookieItem.regex ? new RegExp(cookieItem.regex).test(name) : isMatch;
        if (!regex.test(name) && isRegexMatch) {
          const expiration = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
          document.cookie = `${expiration}`;
          document.cookie = `${expiration} path=/;`;
          document.cookie = `${expiration} path=/; domain=${cookieItem.domain}`;
          document.cookie = `${expiration} path=/; domain=${cookieItem.domain}; secure`;
          document.cookie = `${expiration} path=/; domain=${cookieItem.domain}; SameSite=None; Secure`;
          const cookieRemoved = isCookieRemoved(name);
          if (!cookieRemoved) {
            let date = /* @__PURE__ */ new Date();
            date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1e3);
            const expires = "; expires=" + date.toGMTString();
            document.cookie = `${name}=${expires}; path=/;`;
          }
        }
      });
    });
    if (callbackUrl) {
      await sendCookieListToEndpoint(
        cookieList.map((cookie) => ({
          name: cookie.name,
          domain: cookie.domain,
          regex: cookie.regex
        })),
        callbackUrl
      );
    }
  }
  __name(removeCookiesOnList, "removeCookiesOnList");
  function checkAndRemoveMissingCookies() {
    const regex = new RegExp(`^${CC_COOKIE_MODAL}_(\\d+)$`);
    const hasCookieModalCookie = document.cookie.split(";").some((cookie) => {
      const cookieName = cookie.trim().split("=")[0];
      return cookieName && regex.test(cookieName);
    });
    if (!hasCookieModalCookie) {
      return;
    }
    const storedPendingCookies = localStorage.getItem(CC_PENDING_COOKIES_KEY);
    const pendingCookies = storedPendingCookies ? JSON.parse(storedPendingCookies) : [];
    safeRemoveCookiesOnList(pendingCookies);
  }
  __name(checkAndRemoveMissingCookies, "checkAndRemoveMissingCookies");
  function isCookieRemoved(cookieName) {
    return document.cookie.split(";").every((cookie) => {
      return cookie.trim().startsWith(`${cookieName}=`) === false;
    });
  }
  __name(isCookieRemoved, "isCookieRemoved");
  function reject(cookieList, callbackUrl) {
    removeCookiesOnList(cookieList, callbackUrl);
    localStorage.setItem(CC_PENDING_COOKIES_KEY, JSON.stringify(cookieList));
  }
  __name(reject, "reject");
  function shouldDisplayBanner(bannerConfiguration, banner) {
    if (!!bannerConfiguration && !bannerConfiguration.active && !bannerConfiguration.region.isGlobal) {
      return false;
    }
    const cookieRemoved = isCookieRemoved(
      `${CC_COOKIE_MODAL}_${banner.scannerId}`
    );
    if (!cookieRemoved) return false;
    return true;
  }
  __name(shouldDisplayBanner, "shouldDisplayBanner");
  function getDomain() {
    return window.location.hostname.replace("www.", "");
  }
  __name(getDomain, "getDomain");
  function getDomainFromString(urlString) {
    try {
      const url = new URL(urlString);
      return url.hostname.replace("www.", "");
    } catch (error) {
      return "Invalid URL";
    }
  }
  __name(getDomainFromString, "getDomainFromString");
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  __name(getCookie, "getCookie");
  function handleUserConsentPreferences() {
    const userPreferenceCookie = getCookie(`${CC_COOKIE_MODAL}_preference`);
    if (!userPreferenceCookie) return;
    try {
      const preferences = JSON.parse(userPreferenceCookie);
      setGTMDataLayer("captainComplianceConsent", preferences);
    } catch (error) {
      return;
    }
  }
  __name(handleUserConsentPreferences, "handleUserConsentPreferences");
  function getBannerDefaultStyles(bannerModeStyle, bannerConfiguration, icon, settings) {
    return {
      html: bannerConfiguration.html || bannerModeStyle.html,
      css: bannerConfiguration.css || bannerModeStyle.styles,
      miniHtml: bannerConfiguration.miniHtml || icon.html,
      miniCss: bannerConfiguration.miniCss || icon.styles,
      settingsHtml: bannerConfiguration.settingsHtml || settings.html,
      settingsCss: bannerConfiguration.settingsCss || settings.styles
    };
  }
  __name(getBannerDefaultStyles, "getBannerDefaultStyles");
  function handleBlockScripts(scripts) {
    if (!scripts && !getCookie(`${CC_COOKIE_MODAL}_preference`)) {
      return;
    }
    const cookie = getCookie(`${CC_COOKIE_MODAL}_preference`);
    let preferences;
    try {
      preferences = typeof cookie === "object" ? cookie : JSON.parse(cookie);
    } catch (error) {
      console.error("Error parsing cookie preferences:", error);
      return;
    }
    const cookieScripts = preferences?.scripts;
    if ((!scripts || !Array.isArray(scripts) || scripts.length === 0) && (!cookieScripts || !Array.isArray(cookieScripts) || cookieScripts.length === 0)) {
      return;
    }
    const scriptsToBlock = scripts || cookieScripts;
    if (!preferences?.selectedCookies) {
      blockAllScripts(scriptsToBlock);
      return;
    }
    blockScripts(scriptsToBlock, preferences.selectedCookies);
  }
  __name(handleBlockScripts, "handleBlockScripts");
  async function renderModal() {
    const isGPCEnabled = navigator.globalPrivacyControl === true;
    const data = await loadBannerData();
    const currentDomain = getDomain();
    const expectedDomain = getDomainFromString(data.banner.scanner.domain);
    if (currentDomain !== expectedDomain && !IS_DEV) {
      console.log(
        "%cSORRY THIS IS NOT THE ALLOWED DOMAIN",
        "color: red; font-size: 20px"
      );
      return;
    }
    const {
      bannerConfiguration,
      bannerDisplays,
      banner,
      report,
      geoInfo,
      bannerModeStyle,
      scripts
    } = data;
    const geolocation = {
      country: geoInfo.country,
      countryCode: geoInfo.countryCode,
      region: geoInfo.region,
      regionName: geoInfo.regionName,
      city: geoInfo.city,
      timezone: geoInfo.timezone
    };
    window.__ccGeoInfo = geolocation;
    const bannerReport = await loadData(banner.scannerId);
    if (bannerReport) {
      console.log("renderModal", scripts);
      handleBlockScripts(scripts);
      const switchData = await loadSwitchData();
      const shadowRoot = generateHtmlModalNode();
      if (isGPCEnabled) {
        console.log("%cGPC Signal", "color: blue; font-size: 15px");
        triggerAllowedRemove(bannerReport.reportInformation.cookies, [
          "STRICTLY_NECESSARY_COOKIES",
          "UNCLASSIFIED_COOKIES"
        ]);
        const gtmData = {
          status: "GPC_SIGNAL",
          scannerId: banner.scannerId,
          bannerId: banner.id,
          notSellPersonalInfo: true,
          geoInfo: geolocation,
          selectedCookies: {
            STRICTLY_NECESSARY_COOKIES: true,
            TARGETING_COOKIES: true,
            FUNCTIONALITY_COOKIES: false,
            PERFORMANCE_COOKIES: false,
            UNCLASSIFIED_COOKIES: true
          }
        };
        handleDataLayerReporting(gtmData, bannerConfiguration.dueDays);
      }
      const settingsModalStructure = await getModalStructure("SETTINGS");
      const iconCookieStructure = await getModalStructure("ICON");
      const bannerStructured = getBannerDefaultStyles(
        bannerModeStyle,
        bannerConfiguration,
        iconCookieStructure,
        settingsModalStructure
      );
      trackBannerLoad(banner.id);
      addModal(
        bannerConfiguration,
        switchData,
        bannerDisplays,
        report,
        bannerStructured.html,
        bannerStructured.settingsHtml,
        bannerStructured.miniHtml,
        shadowRoot,
        isGPCEnabled
      );
      createConsentBannerStyles(
        bannerConfiguration,
        banner,
        bannerStructured.css,
        bannerStructured.settingsCss,
        bannerStructured.miniCss,
        shadowRoot,
        isGPCEnabled
      );
      modalActions(
        bannerReport.reportInformation.cookies,
        switchData,
        banner,
        bannerConfiguration,
        shadowRoot,
        geolocation,
        isGPCEnabled,
        scripts
      );
      toggleActions(shadowRoot);
    }
  }
  __name(renderModal, "renderModal");
  (function() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    function onRouteChange(url) {
      console.log(`Navigated to: ${url}`);
      checkAndRemoveMissingCookies();
      handleUserConsentPreferences();
    }
    __name(onRouteChange, "onRouteChange");
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      onRouteChange(window.location.href);
    };
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      onRouteChange(window.location.href);
    };
    window.addEventListener("popstate", function() {
      onRouteChange(window.location.href);
    });
  })();
  (function() {
    function onContentLoaded() {
      console.log("All content loaded successfully.");
      checkAndRemoveMissingCookies();
      handleUserConsentPreferences();
      handleBlockScripts();
    }
    __name(onContentLoaded, "onContentLoaded");
    if (document.readyState === "complete") {
      onContentLoaded();
    } else {
      window.addEventListener("load", onContentLoaded);
    }
    console.log("Content load listener initialized.");
  })();
  window.addEventListener("beforeunload", function() {
    checkAndRemoveMissingCookies();
    handleUserConsentPreferences();
    handleBlockScripts();
  });
  renderModal();
})();
