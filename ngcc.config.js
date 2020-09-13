module.exports = {
  packages: {
    '../dist/angular-globalize': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    },
    '@code-art-eg/angular-globalize': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    }
  }
}
