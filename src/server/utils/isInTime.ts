export default (startStr : string, endStr : string = '', time? : Date) : boolean => {
  function toMinutes(hhmm : any) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
  if(!startStr || !endStr) return false

  const now = time ? time : new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const start = toMinutes(startStr);
  const end = toMinutes(endStr);

  if (start < end) {
    return nowMinutes >= start && nowMinutes < end;
  } 
  else {
    return nowMinutes >= start || nowMinutes < end;
  }
} 