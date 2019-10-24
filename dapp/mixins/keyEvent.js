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
    }
  },
  beforeDestroy() {
    if (browser.versions.android) {
      window.removeEventListener("resize", this.keyup);
    }
  },
  methods: {
    keyup() {
      const newInnerHeight = window.innerHeight;
      if (this.innerHeight > newInnerHeight) {
        // keyup event
        this.showElement = false;
      } else {
        // keydown event
        this.showElement = true;
      }
    }
  }
};
