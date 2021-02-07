export default {
  get: $key => {
    const value = sessionStorage.getItem($key)
    try {
      return value && value !== 'undefined' && JSON.parse(value)
    } catch {
      return undefined
    }
  },
  set: ($key, $value) => {
    sessionStorage.setItem($key, JSON.stringify($value))
  },
  remove: $key => {
    sessionStorage.removeItem($key)
  },
}
