/**
 * is main net or not
 *
 * @returns {boolean}
 */
const isMainnet = (): boolean => {
  return process.env.MAINNET === "true";
};

const browser = {
  versions: (function() {
    let u = navigator.userAgent;
    return {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1
    };
  })()
};

export { isMainnet, browser };
