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
        src: process.env.NODE_ENV === "development" ? "https://cdn.bootcss.com/vue/2.6.10/vue.js" : "https://cdn.bootcss.com/vue/2.6.10/vue.min.js"
      },
      {
        src: "https://cdn.jsdelivr.net/npm/jcc-moac-utils@0.2.3/dist/jcc-moac-utils.min.js"
      },
      {
        src: "https://cdn.jsdelivr.net/npm/ethers@4.0.37/dist/ethers.min.js"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  env: {
    /**
     * test moac address & secret
     */
    MOAC_ADDRESS: process.env.MoacAddress,
    MOAC_SECRET: process.env.MoacSecret,
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
  plugins: ["~/plugins/dpr", "~/plugins/vant", "~/plugins/i18n", "~/plugins/initAccount"],
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
