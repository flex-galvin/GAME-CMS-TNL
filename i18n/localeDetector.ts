
export default defineI18nLocaleDetector((event, config) => {
  const langs = ['vi', 'en', 'ja', 'ko', 'zh']
  const query = tryQueryLocale(event, { lang: '' })
  if (!!query && langs.includes(query.toString())) return query.toString()

  const cookie = tryCookieLocale(event, { lang: '', name: 'i18n_redirected' })
  if (!!cookie && langs.includes(cookie.toString())) return cookie.toString()

  const header = tryHeaderLocale(event, { lang: '' })
  if (!!header && langs.includes(header.toString())) return header.toString()

  return config.defaultLocale
})