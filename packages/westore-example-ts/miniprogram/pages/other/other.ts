import otherStore from "../../stores/other-store";

Page({
  data: otherStore.data,

  onLoad() {
    otherStore.bind("otherPage", this);
    otherStore.init();
  },

  onCountChanged(evt: any) {
    otherStore.data.count = evt.detail;
  },

  addTodo() {
    otherStore.addTodo();
  },
});
