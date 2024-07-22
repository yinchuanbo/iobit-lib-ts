/**
 * 定义类型
 */
type IApiUrls = {
  [key: string]: string;
};

type EventType = MouseEvent | TouchEvent;

interface HttpsTempFunction {
  (str: string): string;
}

enum Language {
  EN = "en",
  AR = "ar",
  TW = "tw",
  KR = "kr",
  JP = "jp",
  IT = "it",
  FR = "fr",
  DE = "de",
  PT = "pt",
  ES = "es",
}

enum Website {
  VD = ".vidnoz.com",
  MIO = ".miocreate.com",
}

enum Environment {
  Production = "production",
  Test = "test",
}

const lang: Language = Language.EN;

const excludedLangs: Language[] = [
  Language.EN,
  Language.AR,
  Language.TW,
  Language.KR,
];

function handleRes(bool: boolean): string;
function handleRes(bool: boolean, type: 1 | 2): string;
function handleRes(bool: boolean, type?: 1 | 2): string {
  if (type === 1) {
    return bool ? "" : `-${lang}`;
  } else if (type === 2) {
    return bool ? "www" : lang;
  } else {
    throw new Error("Invalid type specified");
  }
}

const httpsTemp = (str: string): string => `https://${str}/`;

const domainPrefix: string = handleRes(lang === Language.EN, 2);
const pcSuffix: string = handleRes(lang === Language.EN, 1);
let mSuffix: string = handleRes(excludedLangs.includes(lang), 1);

const host: string = location.host;
const curDomain: string = `${domainPrefix}${Website.VD}`;

const environment: Environment = host.includes(curDomain)
  ? Environment.Production
  : Environment.Test;

const baseApi: string = httpsTemp(
  environment === Environment.Production
    ? "tool-api.vidnoz.com"
    : "tool-api-test.vidnoz.com"
);

const baseApiOld: string = httpsTemp(
  environment === Environment.Production
    ? "api.vidnoz.com"
    : "api-test.vidnoz.com"
);

const pcAppDomain: string = httpsTemp(
  environment === Environment.Production
    ? `aiapp${pcSuffix}.vidnoz.com`
    : "ai-test.vidnoz.com"
);

const mAppDomain: string = httpsTemp(
  environment === Environment.Production
    ? `m${mSuffix}.vidnoz.com`
    : "m-test-f700c64e.vidnoz.com"
);

/**
 * 存储相关
 */
class Memory {
  public setItem(key: string, value: any): void {
    if (!key) return;
    key = key.toString();
    value = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, value);
  }
  public getItem<T>(key: string): T | null {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) return null;
      return JSON.parse(storedValue);
    } catch (error) {
      return null;
    }
  }
  public removeItem(key: string | string[]): void {
    if (!key) {
      window.localStorage.clear();
      return;
    }
    if (typeof key === "string") {
      window.localStorage.removeItem(key);
    } else if (Array.isArray(key)) {
      key.forEach((k) => window.localStorage.removeItem(k));
    }
  }
  public getCookie(cookieName: string): string | null {
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
  public isMobile(): boolean {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  }
  // 判断是 android 还是 ios
  public isIosOrAndroid(): "android" | "ios" | undefined {
    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    const isiOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isAndroid) {
      return "android";
    } else if (isiOS) {
      return "ios";
    }
    return undefined;
  }
  // 复制文字到剪切板 - 兼容版
  public async copyText(val: string): Promise<void> {
    function fallbackCopyText(text: string): void {
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
  public watchFileUpload(
    fileInput: HTMLInputElement,
    callback: (file: File) => void
  ): void {
    fileInput.addEventListener("change", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        callback(file);
      }
    });
  }
  // 获取元素类型
  public getType(obj: any): string {
    const _toString = Object.prototype.toString;
    const _type: { [key: string]: string } = {
      undefined: "undefined",
      number: "number",
      boolean: "boolean",
      string: "string",
      "[object Function]": "function",
      "[object RegExp]": "regexp",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object Error]": "error",
    };
    return (
      _type[typeof obj] ||
      _type[_toString.call(obj)] ||
      (obj ? "object" : "null")
    );
  }
  // 检测元素之外的点击
  public checkClickOutside(ele: HTMLElement, evt: EventType): boolean {
    return !ele.contains(evt.target as Node);
  }
  // 平滑滚动到页面顶部
  public scrollToTop(): void {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(() => this.scrollToTop());
      window.scrollTo(0, c - c / 8);
    }
  }
  // 滚动到元素位置
  public smoothScroll(element: string): void {
    document.querySelector(element)?.scrollIntoView({
      behavior: "smooth",
    });
  }
  // 即使页面关闭了，继续请求 01
  public continueRequestOnUnload1(url: string = "", data: any = {}): void {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      keepalive: true,
    });
  }
  // 即使页面关闭了，继续请求 02
  public continueRequestOnUnload2(url: string = "", data: any = {}): void {
    navigator.sendBeacon(url, JSON.stringify(data));
  }
  // FLIP 动画封装函数
  public flipAnimate(element: HTMLElement, duration: number = 500): void {
    const first = {
      rect: element.getBoundingClientRect(),
      opacity: window.getComputedStyle(element).opacity,
    };
    element.style.transform = `translate(${first.rect.left}px, ${first.rect.top}px)`;
    element.style.opacity = "0";
    void element.offsetWidth;
    const last = {
      rect: element.getBoundingClientRect(),
      opacity: window.getComputedStyle(element).opacity,
    };
    const deltaX = first.rect.left - last.rect.left;
    const deltaY = first.rect.top - last.rect.top;
    element.style.transform = `translate(0, 0)`;
    element.style.opacity = "1";
    element.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)`, opacity: "0" },
        { transform: "translate(0, 0)", opacity: "1" },
      ],
      {
        duration: duration,
        easing: "ease-in-out",
      }
    );
  }
  // 深克隆
  public cloneData<T>(data: T | null): T | null {
    if (!data) return data;
    return JSON.parse(JSON.stringify(data));
  }
}

/**
 * 请求方法
 */
class Service extends Memory {
  public getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-TASK-VERSION": (window as any).XTASKVERSION || "2.0.0",
      "Request-Language": lang,
    };
    const curToken: any = this.getCookie("access_token");
    if (curToken) headers["Authorization"] = "Bearer " + curToken;
    return headers;
  }
  public get(url: string, headers: HeadersInit = {}): Promise<any> {
    return fetch(url, {
      method: "GET",
      headers: {
        ...this.getHeaders(),
        ...headers,
      },
    }).then((response) => response.json());
  }
  public post(url: string, data: any, headers: HeadersInit = {}): Promise<any> {
    return fetch(url, {
      method: "POST",
      headers: {
        ...this.getHeaders(),
        ...headers,
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }
  public postFormData(
    url: string,
    data: Record<string, any>,
    headers: HeadersInit = {}
  ): Promise<any> {
    const curHeaders: HeadersInit = {
      ...this.getHeaders(),
      ...headers,
    };
    delete (curHeaders as Record<string, any>)["Content-Type"];
    const formData = new FormData();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]);
      }
    }
    return fetch(url, {
      method: "POST",
      headers: curHeaders,
      body: formData,
    }).then((response) => response.json());
  }
  public put(
    url: string,
    data: any,
    headers: HeadersInit = {}
  ): Promise<number> {
    return fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }).then((response) => response.status);
  }
}

/**
 * API 封装
 */
class API extends Service {
  public ApiUrls: IApiUrls = {
    "add-task": "ai/ai-tool/add-task",
    "get-task": "ai/tool/get-task",
    "get-access-url": "ai/source/get-access-url",
    "temp-upload-url": "ai/source/temp-upload-url",
    "can-task": "ai/tool/can-task",
    "get-upload-url": "ai/source/get-upload-url",
  };
  public async addTask(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApi}${this.ApiUrls["add-task"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async getTask(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApi}${this.ApiUrls["get-task"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async loopTask(
    addTData: any = {},
    callback: (res: any) => void = () => {}
  ): Promise<any> {
    const _this = this;
    async function getTaskLoop(
      taskId: number,
      cb: (res: any) => void = () => {}
    ): Promise<any> {
      let time = 0;
      while (true) {
        try {
          const res = await _this.getTask({ id: taskId });
          const status = res?.data?.status;
          if (status === 0) {
            await cb?.(res);
            return Promise.resolve(res?.data?.additional_data ?? {});
          } else if (![0, -1, -2].includes(status)) {
            return Promise.reject();
          }
        } catch (error) {
          if (time >= 5) {
            return Promise.reject();
          }
          time++;
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
    try {
      const res = await this.addTask(addTData);
      const code = res?.code;
      const taskId = res?.data?.task_id;
      if (code === 200 && taskId) {
        try {
          const data = await getTaskLoop.call(this, taskId, callback);
          return Promise.resolve({
            code: 200,
            task_id: taskId,
            data,
          });
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        return Promise.resolve({
          code,
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async getAccessUrl(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApi}${this.ApiUrls["get-access-url"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async tempUploadUrl(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApi}${this.ApiUrls["temp-upload-url"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async getUploadUrl(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApiOld}${this.ApiUrls["get-upload-url"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async canTask(params: any = {}): Promise<any> {
    try {
      const res = await this.post(
        `${baseApi}${this.ApiUrls["get-task"]}`,
        params
      );
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  // 资源上传的统一封装
  public async uploadAssets({
    fileName,
    file,
    permanent = false,
  }: {
    fileName: string;
    file: File;
    permanent: boolean;
  }): Promise<any> {
    const readText = (blob: Blob): Promise<boolean> => {
      return new Promise((resolve) => {
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
      const res = await (permanent ? this.getUploadUrl : this.tempUploadUrl)({
        file_name: fileName || `default.${file.type}`,
      });
      const code = res?.code;
      const uploadUrl = res?.data?.upload_url;
      const key = res?.data?.key;
      if (code === 200 && uploadUrl) {
        const blob = new Blob([file], { type: file.type });
        const result = await readText(blob);
        if (!result) {
          return Promise.resolve({
            code: 404,
            message: "no such file",
          });
        }
        const putRes = await this.put(uploadUrl, blob);
        if (putRes === 200) {
          return Promise.resolve({
            code: 200,
            key,
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
  // 资源下载的统一封装 - 本地下载
  public async downloadAssets({
    key,
    filename = "",
    callback = () => {},
  }: {
    key: string;
    filename?: string;
    callback?: (params: any) => void;
  }): Promise<void> {
    try {
      const accessData = await this.getAccessUrl({ key });
      const code = accessData?.code;
      const staticUrl = accessData?.data?.static_url;
      const url = accessData?.data?.url;
      const src = staticUrl || url;
      if (code === 200 && src) {
        let error = false;
        this.get(src)
          .then((response) => {
            if (!response.ok) {
              error = true;
              callback?.({
                status: response.status,
                error: true,
              });
              return;
            } else {
              error = false;
            }
            const contentLength = response.headers.get("Content-Length");
            const total = parseInt(contentLength || "0", 10);
            let loaded = 0;
            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error("Response body is not readable");
            }
            return new ReadableStream({
              start(controller) {
                function pump() {
                  return reader
                    .read()
                    .then(
                      ({
                        done,
                        value,
                      }: {
                        done: boolean;
                        value: Uint8Array;
                      }) => {
                        if (done) {
                          controller.close();
                          return;
                        }
                        loaded += value.length;
                        const progress =
                          total > 0 ? Math.round((loaded / total) * 100) : 0;
                        callback?.({
                          progress,
                          error: false,
                        });
                        controller.enqueue(value);
                        return pump();
                      }
                    )
                    .catch(() => {
                      callback?.({
                        error: true,
                      });
                      controller.error(error);
                      throw error;
                    });
                }
                return pump();
              },
            });
          })
          .then((stream) => new Response(stream))
          .then((response) => response.blob())
          .then((blob) => {
            if (!error) {
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(blobUrl);
            } else {
              callback?.({
                error: true,
              });
            }
          })
          .catch(() => {
            callback?.({
              error: true,
            });
          });
      } else {
        callback?.({
          error: true,
        });
      }
    } catch (error) {
      callback?.({
        error: true,
      });
    }
  }
}

/**
 * 输出
 */
const Imemory = new Memory();
const Imethods = new Methods();
const Iservice = new Service();
const Iapi = new API();

const $$ = {
  m: Imemory,
  f: Imethods,
  s: Iservice,
  a: Iapi,
};
