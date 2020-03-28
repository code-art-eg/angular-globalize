module.exports = {
  packages: {
    '../dist/angular-globalize': {
      ignorableDeepImportMatchers: [
        /\/globalize\/dist\/globalize$/
      ]
    }
  }
}
