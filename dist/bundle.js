"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * 定义类型
 */
var Language = /*#__PURE__*/function (Language) {
  Language["en"] = "en";
  Language["ar"] = "ar";
  Language["tw"] = "tw";
  Language["kr"] = "kr";
  Language["jp"] = "jp";
  Language["it"] = "it";
  Language["fr"] = "fr";
  Language["de"] = "de";
  Language["pt"] = "pt";
  Language["es"] = "es";
  return Language;
}(Language || {});
var Env = /*#__PURE__*/function (Env) {
  Env["Production"] = "production";
  Env["Test"] = "test";
  return Env;
}(Env || {});
/**
 * 定义变量
 */
const httpsTempLib = function (str) {
  return `https://${str}/`;
};
const hostLib = location.host;
let langLib;
let domainPrefix;
let curDomain;
let environment;
let baseApiLib;
let baseApiOldLib;
let siteName = "vidnoz";
const setVidnozData = function () {
  curDomain = `${domainPrefix}.vidnoz.com`;
  environment = hostLib.includes(curDomain) ? Env.Production : Env.Test;
  baseApiLib = httpsTempLib(environment === Env.Production ? "tool-api.vidnoz.com" : "tool-api-test.vidnoz.com");
  baseApiOldLib = httpsTempLib(environment === Env.Production ? "api.vidnoz.com" : "api-test.vidnoz.com");
};
const setMiocreateData = function () {
  curDomain = `${domainPrefix}.miocreate.com`;
  environment = hostLib.includes(curDomain) ? Env.Production : Env.Test;
  baseApiLib = httpsTempLib(environment === Env.Production ? "tool-api.miocreate.com" : "tool-api-test.miocreate.com");
};
const errorTips = function (str = "") {
  throw new Error(`${str}`);
};
const setGloalData = function (curLan) {
  if (curLan in Language) {
    langLib = curLan;
    domainPrefix = langLib === Language.en ? "www" : langLib;
  } else {
    errorTips("Language not supported");
  }
};
const setVars = function (curLan, websiteName) {
  setGloalData(curLan);
  siteName = websiteName;
  switch (websiteName) {
    case "vidnoz":
      setVidnozData();
      break;
    case "miocreate":
      setMiocreateData();
      break;
    default:
      errorTips("Website name not supported");
  }
};

/**
 * 存储相关
 */
class Memory {
  setItem(key, value) {
    if (!key) return;
    key = key.toString();
    value = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, value);
  }
  getItem(key) {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) return null;
      return JSON.parse(storedValue);
    } catch (error) {
      return null;
    }
  }
  removeItem(key) {
    if (!key) {
      window.localStorage.clear();
      return;
    }
    if (typeof key === "string") {
      window.localStorage.removeItem(key);
    } else if (Array.isArray(key)) {
      key.forEach(function (k) {
        return window.localStorage.removeItem(k);
      });
    }
  }
  getCookie(cookieName) {
    const allCookies = document.cookie;
    const cookiesArray = allCookies.split(";");
    for (const cookie of cookiesArray) {
      const [key, value] = cookie.trim().split("=");
      if (key === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
}

/**
 * 常用函数
 */
class Methods {
  // 判断是否是 mobile 端
  isMobile() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }
  // 判断是 android 还是 ios
  isIosOrAndroid() {
    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isAndroid) {
      return "android";
    } else if (isiOS) {
      return "ios";
    }
    return undefined;
  }
  // 复制文字到剪切板 - 兼容版
  async copyText(val) {
    function fallbackCopyText(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.width = "100px";
      textArea.style.position = "fixed";
      textArea.style.left = "-999px";
      textArea.style.top = "10px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    if (navigator.clipboard && navigator.permissions) {
      try {
        await navigator.clipboard.writeText(val);
      } catch (error) {
        console.error("Failed to copy text using Clipboard API:", error);
        fallbackCopyText(val);
      }
    } else {
      fallbackCopyText(val);
    }
  }
  // 监听 input file 上传
  watchFileUpload(fileInput, callback) {
    fileInput.addEventListener("change", function (e) {
      var _target$files;
      const target = e.target;
      const file = (_target$files = target.files) === null || _target$files === void 0 ? void 0 : _target$files[0];
      if (file) {
        callback(file);
      }
    });
  }
  // 获取元素类型
  getType(obj) {
    const _toString = Object.prototype.toString;
    const _type = {
      undefined: "undefined",
      number: "number",
      boolean: "boolean",
      string: "string",
      "[object Function]": "function",
      "[object RegExp]": "regexp",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object Error]": "error"
    };
    return _type[typeof obj] || _type[_toString.call(obj)] || (obj ? "object" : "null");
  }
  // 检测元素之外的点击
  checkClickOutside(ele, evt) {
    return !ele.contains(evt.target);
  }
  // 平滑滚动到页面顶部
  scrollToTop() {
    var _this2 = this;
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(function () {
        return _this2.scrollToTop();
      });
      window.scrollTo(0, c - c / 8);
    }
  }
  // 滚动到元素位置
  smoothScroll(element) {
    var _document$querySelect;
    (_document$querySelect = document.querySelector(element)) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.scrollIntoView({
      behavior: "smooth"
    });
  }
  // 即使页面关闭了，继续请求 01
  continueRequestOnUnload1(url = "", data = {}) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      keepalive: true
    });
  }
  // 即使页面关闭了，继续请求 02
  continueRequestOnUnload2(url = "", data = {}) {
    navigator.sendBeacon(url, JSON.stringify(data));
  }
  // FLIP 动画封装函数
  flipAnimate(element, duration = 500) {
    const first = {
      rect: element.getBoundingClientRect(),
      opacity: window.getComputedStyle(element).opacity
    };
    element.style.transform = `translate(${first.rect.left}px, ${first.rect.top}px)`;
    element.style.opacity = "0";
    void element.offsetWidth;
    const last = {
      rect: element.getBoundingClientRect(),
      opacity: window.getComputedStyle(element).opacity
    };
    const deltaX = first.rect.left - last.rect.left;
    const deltaY = first.rect.top - last.rect.top;
    element.style.transform = `translate(0, 0)`;
    element.style.opacity = "1";
    element.animate([{
      transform: `translate(${deltaX}px, ${deltaY}px)`,
      opacity: "0"
    }, {
      transform: "translate(0, 0)",
      opacity: "1"
    }], {
      duration: duration,
      easing: "ease-in-out"
    });
  }
  // 深克隆
  cloneData(data) {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }

  // 查找节点的方法
  qsLib(args) {
    const len = args.length;
    if (!len || len > 2) return null;
    if (len === 1) {
      return document.querySelector(args[0]);
    } else if (len === 2) {
      return args[0].querySelector(args[1]);
    }
    return null;
  }
}

/**
 * 请求方法
 */
class Service extends Memory {
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
      "X-TASK-VERSION": window.XTASKVERSION || "2.0.0",
      "Request-Language": langLib
    };
    const curToken = this.getCookie("access_token");
    if (curToken) headers["Authorization"] = "Bearer " + curToken;
    return headers;
  }
  get(url, headers = {}) {
    return fetch(url, {
      method: "GET",
      headers: _objectSpread(_objectSpread({}, this.getHeaders()), headers)
    }).then(function (response) {
      return response.json();
    });
  }
  post(url, data, headers = {}) {
    return fetch(url, {
      method: "POST",
      headers: _objectSpread(_objectSpread({}, this.getHeaders()), headers),
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json();
    });
  }
  postFormData(url, data, headers = {}) {
    const curHeaders = _objectSpread(_objectSpread({}, this.getHeaders()), headers);
    delete curHeaders["Content-Type"];
    const formData = new FormData();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]);
      }
    }
    return fetch(url, {
      method: "POST",
      headers: curHeaders,
      body: formData
    }).then(function (response) {
      return response.json();
    });
  }
  put(url, data, headers = {}) {
    return fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.status;
    });
  }
}

/**
 * API 封装
 */
class API extends Service {
  constructor() {
    super();
    _defineProperty(this, "ApiUrls", ApiUrls);
    if (siteName === "miocreate") {
      console.log("我是 mio, 此处可以修改 this.ApiUrls");
    }
  }
  async postTemp(params = {}, pathname = "", url = "") {
    try {
      const res = await this.post(url || `${baseApiLib}${this.ApiUrls[pathname]}`, params);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async addTask(params = {}) {
    this.postTemp(params, "add-task");
  }
  async danceTask(params = {}) {
    this.postTemp(params, "dance");
  }
  async getTask(params = {}) {
    this.postTemp(params, "get-task");
  }
  async getAccessUrl(params = {}) {
    this.postTemp(params, "get-access-url");
  }
  async tempUploadUrl(params = {}) {
    this.postTemp(params, "temp-upload-url");
  }
  async canTask(params = {}) {
    this.postTemp(params, "can-task");
  }
  async getUploadUrl(params = {}) {
    const url = `${baseApiOldLib || baseApiLib}${this.ApiUrls["get-upload-url"]}`;
    this.postTemp(params, "", url);
  }
  async loopTask(addTData = {}, curTool = "", callback = function () {}) {
    const _this = this;
    async function getTaskLoop(taskId, cb = function () {}) {
      let time = 0;
      while (true) {
        try {
          var _res$data;
          const res = await _this.getTask({
            id: taskId
          });
          const status = res === null || res === void 0 ? void 0 : (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.status;
          if (status === 0) {
            var _res$data2;
            await (cb === null || cb === void 0 ? void 0 : cb(res));
            return Promise.resolve((res === null || res === void 0 ? void 0 : (_res$data2 = res.data) === null || _res$data2 === void 0 ? void 0 : _res$data2.additional_data) ?? {});
          } else if (![0, -1, -2].includes(status)) {
            return Promise.reject();
          }
        } catch (error) {
          if (time >= 5) {
            return Promise.reject();
          }
          time++;
        }
        await new Promise(function (resolve) {
          return setTimeout(resolve, 5000);
        });
      }
    }
    try {
      var _res, _res2, _res2$data;
      let res = null;
      if (curTool === "dance") {
        res = await this.danceTask(addTData);
      } else {
        res = await this.addTask(addTData);
      }
      const code = (_res = res) === null || _res === void 0 ? void 0 : _res.code;
      const taskId = (_res2 = res) === null || _res2 === void 0 ? void 0 : (_res2$data = _res2.data) === null || _res2$data === void 0 ? void 0 : _res2$data.task_id;
      if (code === 200 && taskId) {
        try {
          const data = await getTaskLoop.call(this, taskId, callback);
          return Promise.resolve({
            code: 200,
            task_id: taskId,
            data
          });
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        return Promise.resolve({
          code
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async uploadAssets({
    fileName,
    file,
    permanent = false
  }) {
    const readText = function (blob) {
      return new Promise(function (resolve) {
        const blobReader = new FileReader();
        blobReader.onload = function () {
          resolve(true);
        };
        blobReader.onerror = function (error) {
          resolve(false);
        };
        blobReader.readAsArrayBuffer(blob);
      });
    };
    try {
      var _res$data3, _res$data4;
      const res = await (permanent ? this.getUploadUrl : this.tempUploadUrl)({
        file_name: fileName || `default.${file.type}`
      });
      const code = res === null || res === void 0 ? void 0 : res.code;
      const uploadUrl = res === null || res === void 0 ? void 0 : (_res$data3 = res.data) === null || _res$data3 === void 0 ? void 0 : _res$data3.upload_url;
      const key = res === null || res === void 0 ? void 0 : (_res$data4 = res.data) === null || _res$data4 === void 0 ? void 0 : _res$data4.key;
      if (code === 200 && uploadUrl) {
        const blob = new Blob([file], {
          type: file.type
        });
        const result = await readText(blob);
        if (!result) {
          return Promise.resolve({
            code: 404,
            message: "no such file"
          });
        }
        const putRes = await this.put(uploadUrl, blob);
        if (putRes === 200) {
          return Promise.resolve({
            code: 200,
            key
          });
        } else {
          return Promise.reject();
        }
      } else {
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async downloadAssets({
    key,
    filename = "",
    callback = function () {}
  }) {
    try {
      var _accessData$data, _accessData$data2;
      const accessData = await this.getAccessUrl({
        key
      });
      const code = accessData === null || accessData === void 0 ? void 0 : accessData.code;
      const staticUrl = accessData === null || accessData === void 0 ? void 0 : (_accessData$data = accessData.data) === null || _accessData$data === void 0 ? void 0 : _accessData$data.static_url;
      const url = accessData === null || accessData === void 0 ? void 0 : (_accessData$data2 = accessData.data) === null || _accessData$data2 === void 0 ? void 0 : _accessData$data2.url;
      const src = staticUrl || url;
      if (code === 200 && src) {
        let error = false;
        this.get(src).then(function (response) {
          var _response$body;
          if (!response.ok) {
            error = true;
            callback === null || callback === void 0 ? void 0 : callback({
              status: response.status,
              error: true
            });
            return;
          } else {
            error = false;
          }
          const contentLength = response.headers.get("Content-Length");
          const total = parseInt(contentLength || "0", 10);
          let loaded = 0;
          const reader = (_response$body = response.body) === null || _response$body === void 0 ? void 0 : _response$body.getReader();
          if (!reader) {
            throw new Error("Response body is not readable");
          }
          return new ReadableStream({
            start(controller) {
              function pump() {
                return reader.read().then(function ({
                  done,
                  value
                }) {
                  if (done) {
                    controller.close();
                    return;
                  }
                  loaded += value.length;
                  const progress = total > 0 ? Math.round(loaded / total * 100) : 0;
                  callback === null || callback === void 0 ? void 0 : callback({
                    progress,
                    error: false
                  });
                  controller.enqueue(value);
                  return pump();
                }).catch(function () {
                  callback === null || callback === void 0 ? void 0 : callback({
                    error: true
                  });
                  controller.error(error);
                  throw error;
                });
              }
              return pump();
            }
          });
        }).then(function (stream) {
          return new Response(stream);
        }).then(function (response) {
          return response.blob();
        }).then(function (blob) {
          if (!error) {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(blobUrl);
          } else {
            callback === null || callback === void 0 ? void 0 : callback({
              error: true
            });
          }
        }).catch(function () {
          callback === null || callback === void 0 ? void 0 : callback({
            error: true
          });
        });
      } else {
        callback === null || callback === void 0 ? void 0 : callback({
          error: true
        });
      }
    } catch (error) {
      callback === null || callback === void 0 ? void 0 : callback({
        error: true
      });
    }
  }
}

/**
 * 输出
 */
const $$ = function (curLan = Language.en, websiteName = "vidnoz") {
  setVars(curLan, websiteName);
  const memory = new Memory();
  const methods = new Methods();
  const service = new Service();
  const api = new API();
  return new Proxy({}, {
    get(_, prop) {
      if (prop in memory) {
        return typeof memory[prop] === "function" ? memory[prop].bind(memory) : memory[prop];
      }
      if (prop in methods) {
        return typeof methods[prop] === "function" ? methods[prop].bind(methods) : methods[prop];
      }
      if (prop in service) {
        return typeof service[prop] === "function" ? service[prop].bind(service) : service[prop];
      }
      if (prop in api) {
        return typeof api[prop] === "function" ? api[prop].bind(api) : api[prop];
      }
      return undefined;
    }
  });
};
"use strict";

const ApiUrls = {
  "add-task": "ai/ai-tool/add-task",
  "get-task": "ai/tool/get-task",
  "get-access-url": "ai/source/get-access-url",
  "temp-upload-url": "ai/source/temp-upload-url",
  "can-task": "ai/tool/can-task",
  "get-upload-url": "ai/source/get-upload-url",
  dance: "ai/tool/dance"
};
