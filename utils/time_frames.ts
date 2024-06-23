import dayjs from 'dayjs';
import { TimeFrameType } from '@/type';

interface TimeFrames {
  [key: string]: TimeFrameType;
}

const timeFrames: TimeFrames = {
  today: {
    startDate: dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'today',
    title: 'Today',
  },
  yesterday: {
    startDate: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'yesterday',
    title: 'Yesterday',
  },
  this_week: {
    startDate: dayjs().startOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'this_week',
    title: 'This Week',
  },
  last_week: {
    startDate: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'last_week',
    title: 'Last Week',
  },
  last_3_days: {
    startDate: dayjs().subtract(2, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'last_3_days',
    title: 'Last 3 days',
  },
  last_7_days: {
    startDate: dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'last_7_days',
    title: 'Last 7 days',
  },
  last_30_days: {
    startDate: dayjs().subtract(29, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'last_30_days',
    title: 'Last 30 days',
  },
  CUSTOM: {
    startDate: '',
    endDate: '',
    key: 'CUSTOM',
    title: 'Custom',
  },
};

export default timeFrames;
