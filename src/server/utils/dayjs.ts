import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/vi.js'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

dayjs.locale(process.env.LANG || 'vi')
dayjs.tz.setDefault(process.env.TZ || 'Asia/Ho_Chi_Minh')
export default dayjs
