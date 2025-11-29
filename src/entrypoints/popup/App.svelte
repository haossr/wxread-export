<script>
  import List from "./List.svelte";
  import Login from "./Login.svelte";
  import { triggerLoginRedirect, closePopupWindow } from "./loginRedirect";
  let loading = true;
  let user = { loggedIn: false, loginStatus: "unlogin" };
  function judgeIsLogin() {
    fetch("https://weread.qq.com/api/user/notebook")
      .then((response) => response.json())
      .then((data) => {
        loading = false;
        if (!data?.data?.errcode) {
          user.loggedIn = true;
          Object.assign(user, {});
          return;
        }
        user.loggedIn = false;
        switch (data?.data?.errcode) {
          case -2012: {
            //登录超时
            user.loginStatus = "timeout";
          }
          case -2010:
          default: {
            break;
          }
        }
        triggerLoginRedirect(user.loginStatus, {
          chromeTabs: typeof chrome !== "undefined" ? chrome.tabs : undefined,
          browserTabs: typeof browser !== "undefined" ? browser.tabs : undefined,
          windowOpen: typeof window !== "undefined" ? window.open : undefined,
        });
        closePopupWindow({
          windowClose: typeof window !== "undefined" ? window.close : undefined,
        });
      })
      .catch((e) => {
        loading = false;
        user.loggedIn = false;
        console.error(e);
      });
  }
  judgeIsLogin();
</script>

{#if loading}
  <div class="mdui-spinner">
    <div class="mdui-spinner-layer">
      <div class="mdui-spinner-circle-clipper mdui-spinner-left">
        <div class="mdui-spinner-circle" />
      </div>
      <div class="mdui-spinner-gap-patch">
        <div class="mdui-spinner-circle" />
      </div>
      <div class="mdui-spinner-circle-clipper mdui-spinner-right">
        <div class="mdui-spinner-circle" />
      </div>
    </div>
  </div>
{/if}
{#if !loading}
  <div class="root-app mdui-theme-primary-indigo mdui-theme-accent-indigo theme-wechat">
    {#if user.loggedIn}
      <List userVid={user.userVid} />
    {/if}
    {#if !user.loggedIn}
      <Login loginStatus={user.loginStatus} />
    {/if}
  </div>{/if}

<style>
  .root-app {
    width: fit-content;
  }

  .theme-wechat {
    --theme-color: #24a0ed;
  }

  .theme-wechat .mdui-color-theme,
  .theme-wechat .mdui-btn.mdui-color-theme {
    background-color: var(--theme-color) !important;
    color: #fff !important;
  }

  .theme-wechat .mdui-toolbar,
  .theme-wechat .mdui-appbar {
    background-color: var(--theme-color) !important;
    color: #fff !important;
  }

  .theme-wechat .mdui-appbar .mdui-toolbar {
    background-color: var(--theme-color) !important;
    color: #fff !important;
  }

  .theme-wechat .mdui-appbar .mdui-toolbar .mdui-typo-title {
    color: #fff !important;
  }

  .theme-wechat .toolbar-actions .mdui-btn {
    border: 1px solid rgba(255, 255, 255, 0.35);
  }

  .theme-wechat .mdui-checkbox-icon:before {
    border-color: #fff;
  }

  .theme-wechat .progress-bar__fill {
    background: linear-gradient(90deg, #24a0ed, #5cc4ff);
  }
</style>
