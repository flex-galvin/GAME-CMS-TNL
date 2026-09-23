export default (str : string, num : number = 3) : string => {
  if (str.length <= num) return '*'.repeat(str.length);
  return str.slice(0, num * -1) + '***';
} 