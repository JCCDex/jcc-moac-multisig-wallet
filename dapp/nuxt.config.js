export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "MOAC多签名钱包",
    meta: [
      { charset: "utf-8" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    script: [
      {
        src:
          process.env.NODE_ENV === "development"
            ? "https://unpkg.com/vue@2.6.10/dist/vue.js"
            : "https://unpkg.com/vue@2.6.10/dist/vue.min.js"
      },
      {
        src: "https://unpkg.com/jcc-moac-utils@0.2.3/dist/jcc-moac-utils.min.js"
      },
      {
        src: "https://unpkg.com/ethers@4.0.37/dist/ethers.min.js"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  env: {
    /**
     * test moac address & secret
     */
    MOAC_ADDRESS: "0x5edccedfe9952f5b828937b325bd1f132aa09f60",
    MOAC_SECRET:
      "8fef3bc906ea19f0348cb44bca851f5459b61e32c5cae445220e2f7066db36d8",
    CONTRACT: process.env.Contract,
    NODE: process.env.Node,
    MAINNET: process.env.Mainnet
  },
  router: {
    mode: "hash",
    middleware: ["redirect"]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "~/style/media.scss",
    "~/style/button.scss",
    "~/style/default.scss",
    "~/style/base.scss",
    "~/assets/iconfont/index.js",
    "flex.css/dist/flex.css",
    "~/style/layout.scss",
    "~/style/arrow.scss",
    "~/style/icon.scss",
    "~/style/scroll.scss",
    "~/style/override-vant.scss",
    "~/style/animation.scss"
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/dpr.js", "~/plugins/vant.js", "~/plugins/i18n.js"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build"],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    publicPath: "/nuxt/",
    extend(config) {
      config.output.publicPath = "./nuxt/";
      config.externals = {
        vue: "Vue",
        ethers: "ethers",
        "jcc-moac-utils": "jcc_moac_utils"
      };

      return config;
    }
  }
};
