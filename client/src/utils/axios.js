import axios from 'axios'
import logger from './logger.js'

const {
  VITE_API_BASE
} = import.meta.env

export const request = axios.create({
  baseURL: VITE_API_BASE,
  timeout: 5000,
  withCredentials: true,
  // headers: {'X-Custom-Header': 'foobar'}
})
export default request

// Add a request interceptor
axios.interceptors.request.use(function (req) {
  // Do something before request is sent
  logger.emit('request_intercept', 'trace', { req })
  return req
}, function (err) {
  // Do something with request error
  logger.emit('request_error', 'error', { err })
  return Promise.reject(err)
})

// Add a response interceptor
axios.interceptors.response.use(function (res) {
  // Any status code that lie within the range of 2xx cause
  // this function to trigger. Do something with response data
  logger.emit('response_intercept', 'trace', { res })
  return res
}, function (err) {
  // Any status codes that falls outside the range of 2xx cause
  // this function to trigger. Do something with response error
  logger.emit('request_response_error', 'error', { err })
  return Promise.reject(err)
})
