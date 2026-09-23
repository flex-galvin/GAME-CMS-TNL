export default (template : string, values : any) : string => {
  return template.replace(/\{(.*?)\}/g, (match, key) => {
    return key in values ? values[key] : match
  })
}