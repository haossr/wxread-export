const { test } = require("node:test");
const assert = require("node:assert/strict");

const { resolveLoginUrl, openLoginPage } = require("../src/entrypoints/popup/loginRedirect.js");

test("resolveLoginUrl chooses login hash when not timeout", () => {
  assert.equal(resolveLoginUrl("unlogin"), "https://weread.qq.com/#login");
  assert.equal(resolveLoginUrl("other"), "https://weread.qq.com/#login");
  assert.equal(resolveLoginUrl(undefined), "https://weread.qq.com/#login");
});

test("resolveLoginUrl chooses base page when timeout", () => {
  assert.equal(resolveLoginUrl("timeout"), "https://weread.qq.com");
});

test("openLoginPage prefers chrome tabs when available", () => {
  const chromeCalls = [];
  const browserCalls = [];
  const windowCalls = [];

  const result = openLoginPage("unlogin", {
    chromeTabs: { create: (opts) => chromeCalls.push(opts) },
    browserTabs: { create: (opts) => browserCalls.push(opts) },
    windowOpen: (url, target) => windowCalls.push({ url, target }),
  });

  assert.equal(result.used, "chrome");
  assert.deepEqual(chromeCalls, [{ url: "https://weread.qq.com/#login" }]);
  assert.equal(browserCalls.length, 0);
  assert.equal(windowCalls.length, 0);
});

test("openLoginPage falls back to browser tabs when chrome tabs missing", () => {
  const browserCalls = [];
  const windowCalls = [];

  const result = openLoginPage("timeout", {
    browserTabs: { create: (opts) => browserCalls.push(opts) },
    windowOpen: (url, target) => windowCalls.push({ url, target }),
  });

  assert.equal(result.used, "browser");
  assert.deepEqual(browserCalls, [{ url: "https://weread.qq.com" }]);
  assert.equal(windowCalls.length, 0);
});

test("openLoginPage uses window.open when no tab APIs exist", () => {
  const windowCalls = [];

  const result = openLoginPage("unlogin", {
    windowOpen: (url, target) => windowCalls.push({ url, target }),
  });

  assert.equal(result.used, "window");
  assert.deepEqual(windowCalls, [{ url: "https://weread.qq.com/#login", target: "_blank" }]);
});
