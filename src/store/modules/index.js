const modulesInDirectory = require.context('.', false, /\.store\.js$/)
const modules = {}

// It's very important  to name file's store like module.store.js for the autoload */
modulesInDirectory.keys().forEach(module => {
  const moduleName = module
    .replace(/(\.\/|\.store\.js)/g, '')
    .replace(/^\w/, c => c.toUpperCase())

  const instance = modulesInDirectory(module).default || modulesInDirectory(module)
  modules[moduleName] = { ...instance, namespaced: true }
})

export default modules
