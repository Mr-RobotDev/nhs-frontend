
export const scheduletypeOptions = [
  { label: 'Every day', value: 'everyday' },
  { label: 'Week days', value: 'weekdays' },
  { label: 'Custom', value: 'custom' }
]

export const timeFrameOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'Last 3 Days', value: 'last_3_days' },
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last 30 Days', value: 'last_30_days' }
];

export const triggerWhenOptions = [
  { label: 'Motion Detected', value: 'MOTION_DETECTED' },
  { label: 'No Motion Detected', value: 'NO_MOTION_DETECTED' },
];

export const triggerRangeTypeOptions = [
  { label: 'Lower', value: 'lower' },
  { label: 'Upper', value: 'upper' },
  { label: 'Outside', value: 'outside' },
  { label: 'Inside', value: 'inside' },
];

export const userRoleOptions = [
  { label: 'User', value: 'User' },
  { label: 'Admin', value: 'Admin' },
];

export const userOrganizationOptions = [
  { label: 'Origin Smart Controls', value: 'Origin Smart Controls' },
  { label: 'NHS', value: 'NHS' },
]

export const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const emptyRoomObject = {
  id: "",
  code: "",
  name: "",
  function: "",
  netUseableArea: '',
  department: "",
  division: "",
  cluster: "",
  clusterDescription: "",
  operationHours: "",
  hoursPerDay: '',
  organization: "",
  site: "",
  building: "",
  maxDeskOccupation: '',
  numWorkstations: ''
}