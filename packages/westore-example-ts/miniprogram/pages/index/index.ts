// index.ts
// 获取应用实例
// const app = getApp<IAppOption>()

import userStore from "../../stores/user-store";

export type PagesName = "game" | "other" | "logs";

Page({
  data: userStore.data,

  // 事件处理函数
  bindViewTap() {
    this.gotoPage("logs");
  },

  onLoad() {
    userStore.bind("userPage", this);
  },

  getUserProfile() {
    userStore.getUserProfile();
  },

  gotoPage(name: PagesName) {
    wx.navigateTo({
      url: `../${name}/${name}`,
    });
  },

  gotoGamePage() {
    this.gotoPage("game");
  },

  gotoOtherPage() {
    this.gotoPage("other");
  },
});
