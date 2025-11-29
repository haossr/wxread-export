const BASE_URL = "https://weread.qq.com";
const LOGIN_PATH = "/#login";

export function resolveLoginUrl(loginStatus) {
  return loginStatus === "timeout" ? BASE_URL : `${BASE_URL}${LOGIN_PATH}`;
}

export function openLoginPage(loginStatus, clients = {}) {
  const url = resolveLoginUrl(loginStatus);
  const chromeTabs = clients.chromeTabs;
  const browserTabs = clients.browserTabs;
  const windowOpen =
    clients.windowOpen || (typeof window !== "undefined" ? window.open : undefined);

  if (chromeTabs?.create) {
    chromeTabs.create({ url });
    return { used: "chrome", url };
  }

  if (browserTabs?.create) {
    browserTabs.create({ url });
    return { used: "browser", url };
  }

  if (typeof windowOpen === "function") {
    windowOpen(url, "_blank");
    return { used: "window", url };
  }

  return { used: "none", url };
}
