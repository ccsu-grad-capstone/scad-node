
const inDevelopment = () => process.env.NODE_ENV === 'development'

const inProduction = () => process.env.NODE_ENV === 'production'

const getENV = (key) => {
  if (inDevelopment()) {
    let endpoint = `${key}_DEV`
    return process.env[endpoint]
  } else if (inProduction()) {
    let endpoint = `${key}_PROD`
    return `process.env.${endpoint}`
  } else {
    console.log('ENVIORNMENT ERROR')
  }
}

module.exports = { inDevelopment, inProduction, getENV }
