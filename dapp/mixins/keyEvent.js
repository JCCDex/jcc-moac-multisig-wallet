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
      window.addEventListener("resize", this.keyup);
    } else if (browser.versions.ios) {
      window.addEventListener("focusin", this.focusin);
      window.addEventListener("focusout", this.focusout);
    }
  },
  beforeDestroy() {
    if (browser.versions.android) {
      window.removeEventListener("resize", this.keyup);
    } else if (browser.versions.ios) {
      window.removeEventListener("focusin", this.focusin);
      window.removeEventListener("focusout", this.focusout);
    }
  },
  methods: {
    keyup() {
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
