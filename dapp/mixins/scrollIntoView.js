import { browser } from "@/js/util";

export default {
  mounted() {
    if (browser.versions.android) {
      window.addEventListener("resize", this.scrollIntoView);
    }
  },
  beforeDestroy() {
    if (browser.versions.android) {
      window.removeEventListener("resize", this.scrollIntoView);
    }
  },
  methods: {
    scrollIntoView(time = 200) {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
        setTimeout(() => {
          document.activeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, time);
      }
    }
  }
};
