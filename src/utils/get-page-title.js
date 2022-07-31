export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} | ${process.env.VUE_APP_TITLE}`
  }
  return process.env.VUE_APP_TITLE
}
