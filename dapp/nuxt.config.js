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
    script: [],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
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
    "~/style/animation.scss",
    "~/style/input.scss"
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
      return config;
    }
  }
};
