<script>
  import { onMount } from "svelte";
  import { openLoginPage } from "./loginRedirect";

  export let loginStatus;

  let redirected = false;

  function triggerLoginRedirect() {
    if (redirected) return;
    redirected = true;
    openLoginPage(loginStatus, {
      chromeTabs: typeof chrome !== "undefined" ? chrome.tabs : undefined,
      browserTabs: typeof browser !== "undefined" ? browser.tabs : undefined,
      windowOpen: typeof window !== "undefined" ? window.open : undefined,
    });
  }

  onMount(() => {
    triggerLoginRedirect();
  });
</script>

<div class="login-wrap">
  <div class="login-title">请先登录微信读书</div>
  <div class="login-tip">
    已自动为你打开登录页面{loginStatus === "timeout" ? "，登录超时请刷新后重试" : "，完成登录后重新打开扩展即可继续导出"}。
  </div>
</div>

<style>
  .login-wrap {
    padding: 14px 12px;
    max-width: 260px;
    line-height: 1.5;
  }

  .login-title {
    font-weight: 600;
    margin-bottom: 6px;
  }

  .login-tip {
    color: #555;
    font-size: 13px;
  }
</style>
