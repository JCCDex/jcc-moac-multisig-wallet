import { browser } from "@/js/util";

export default {
  data() {
    return {
      innerHeight: window.innerHeight,
      showElement: true
    };
  },
  mounted() {
    if (browser.versions.android) {
      window.addEventListener("resize", this.focus);
    }
  },
  beforeDestroy() {
    if (browser.versions.android) {
      window.removeEventListener("resize", this.focus);
    }
  },
  methods: {
    focus() {
      const newInnerHeight = window.innerHeight;
      if (this.innerHeight > newInnerHeight) {
        // keyup event
        this.focusin();
      } else {
        // keydown event
        this.focusout();
      }
    },
    focusin() {
      this.showElement = false;
    },
    focusout() {
      this.showElement = true;
    }
  }
};
