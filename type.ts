export type alertRange = {
  lower: number;
  upper: number;
  type: 'outside' | 'inside' | 'upper' | 'lower';
};


export interface DevicesType {
  id: string;
  oem: string;
  name: string;
  type: string;
  temperature: number;
  pressure?: number;
  relativeHumidity: number;
  location: {
    lat: number;
    long: number;
  };
  signalStrength: number;
  lastUpdated: string;
  isOffline: boolean;
  alert?: {
    field: string,
    range: alertRange
  }
  state?: string;
}


export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  organization: string;
}


export interface DashboardType {
  name: string;
  cardsCount: number;
  devicesCount: number;
  id: string;
}

export interface DashboardCardType {
  name: string;
  x: number;
  y: number;
  rows: number;
  cols: number;
  devices: Device[];
  field: string;
  id: string;
}

interface Device {
  id: string;
  state: string;
  name: string;
}

export interface EventType {
  oem: string;
  eventType: string;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

export interface DataPoint {
  oem: string;
  eventType: string;
  temperature: number;
  pressure?: number;
  relativeHumidity: number;
  createdAt: string;
  id: string;
}

export interface Event {
  oem: string;
  eventType: string;
  temperature: number;
  relativeHumidity: number;
  pressure?: number;
  createdAt: string;
  id: string;
}

export interface DeviceData {
  data: any[];
  name: string;
}

export type EventsMap = Record<string, DeviceData>;


export interface CardLayoutType {
  key: string;
  rows: number;
  cols: number;
}

export type CardOptionsType = {
  [key: string]: CardLayoutType;
};

export interface TimeFrameType {
  startDate: string
  endDate: string
  key: string
  title: string;
}

export type SeriesType = {
  name: string;
  data: Array<{
    x: Date;
    y: number;
  }>;
};


export interface ReportsType {
  name: string;
  timeframe: string;
  recipients: string[];
  scheduleType: string;
  enabled?: boolean;
  dashboard?: Dashboard;
  weekdays: string[];
  times: string[];
  id?: string;
}

interface Dashboard {
  name: string;
  devicesCount: number;
  id: string;
}

export interface AlertDataType {
  name: string;
  device: string;
  recipients: string[];
  trigger: Trigger;
  scheduleType: string;
  weekdays: string[];
  enabled?: boolean;
  id?: string;
}

interface Trigger {
  state: string;
  duration: number;
}

interface Range {
  lower: number;
  upper: number;
  type: string;
}

interface Device {
  name: string;
  lastUpdated: string;
  id: string;
}

export interface RoomStatsType {
  totalRooms: number;
  red: number;
  yellow: number;
  green: number;
  roomNames: string[];
  roomFunctions: roomFunctionsType[]
  departments: departmentsType[]
}

export interface roomFunctionsType {
  count: number;
  function: string;
}

export interface departmentsType {
  count: number;
  department: string;
}

export interface DeviceFormType {
  oem: string;
  name: string;
  description: string;
  type: string;
  organization: string;
  site: string;
  building: string;
  floor: string;
  room: string;
}

export interface SingleNameIdObject {
  name: string;
  id: string;
}

export interface RoomFormType {
  id?: string;
  code: string;
  name: string;
  function: string;
  netUseableArea: number;
  department: string;
  division: string;
  cluster: string;
  clusterDescription: string;
  operationHours: string;
  hoursPerDay: number;
  organization: string;
  building: string;
  site: string;
}

export interface AlertStatsType {
  totalActiveAlerts: number;
  totalNonActiveAlerts: number;
  activeAlerts: string[];
  nonActiveAlerts: string[];
}