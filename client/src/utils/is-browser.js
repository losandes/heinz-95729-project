// TODO: is there a better way to figure out if this is
// running in a build/test state vs in the browser? I
// happened upon this approach by accident
export const isBrowser = () => typeof localStorage !== 'undefined'
export default isBrowser