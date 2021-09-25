Component({
  properties: {
    left: {
      type: Number,
      value: 0,
    },
    type: {
      type: String,
      value: "all",
    },
    done: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    showAll() {
      this.triggerEvent("filter", "all");
    },

    showActive() {
      this.triggerEvent("filter", "active");
    },

    showDone() {
      this.triggerEvent("filter", "done");
    },

    clearDone() {
      this.triggerEvent("clear");
    },
  },
});
