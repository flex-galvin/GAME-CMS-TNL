import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('vi')
dayjs.tz.setDefault('Asia/Ho_Chi_Minh')

export const useDayJs = () => {
  const fromTime = (start : Date, end? : Date, noSuffix : boolean = false) : string => {
    const startD = dayjs(start)
    const endD = dayjs(end || new Date())
    return startD.from(endD, noSuffix) as string
  }

  const displayTime = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD [Th]MM YYYY')
  }

  const displayTimeNoYear = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD [Th]MM')
  }

  const displayFull = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD [Th]MM YYYY [lúc] HH:mm')
  }

  return { dayjs, fromTime, displayTime, displayTimeNoYear, displayFull }
}