<template>
  <div>
    <nuxt />
  </div>
</template>

<style lang="scss">
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  color: #4c4f54;
  background-color: #f2f4fb;
}

body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

#__nuxt {
  min-height: 100%;
  min-width: 100%;
  height: 100%;
}

#__layout {
  min-height: 100%;
  min-width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  text-decoration: none;
  color: #a9afc3;
}
</style>
