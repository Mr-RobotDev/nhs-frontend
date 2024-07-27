import { AlertDataType, ReportsType, SingleNameIdObject } from "@/type";
import dayjs from 'dayjs';
import { triggerWhenOptions } from "./form";

export const activeSidebar = (path: string): string => {
  const routes = [
    { name: 'stats', path: '/dashboard/stats' },
    { name: 'users', path: '/dashboard/users' },
    { name: 'devices', path: '/dashboard/devices' },
    { name: 'alerts', path: '/dashboard/alerts' },
    { name: 'data-sources', path: '/dashboard/data-sources' },
    { name: 'profile', path: '/dashboard/profile' },
    { name: 'reports', path: '/dashboard/reports' },
    { name: 'dashboard', path: '/dashboard' },
  ];

  for (const route of routes) {
    if (path.startsWith(route.path)) {
      return route.name;
    }
  }

  return '';
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex: RegExp = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return false;
  }

  const [hours, minutes] = time.split(':');
  const parsedHours: number = parseInt(hours, 10);
  const parsedMinutes: number = parseInt(minutes, 10);

  if (parsedHours < 0 || parsedHours > 24 || parsedMinutes < 0 || parsedMinutes > 59) {
    return false;
  }

  return true;
}


export const validateReportsFormData = (formData: ReportsType | null): { isValid: boolean; message: string } => {
  if (!formData) {
    return { isValid: false, message: "Form data is null." };
  }

  if (!formData.name) {
    return { isValid: false, message: "Name should not be empty." };
  }

  if (!formData.recipients || formData.recipients.length === 0) {
    return { isValid: false, message: "Recipients should not be empty." };
  }

  if (!formData.scheduleType) {
    return { isValid: false, message: "ScheduleType should not be empty." };
  }

  const validScheduleTypes = ["everyday", "weekdays", "custom"];
  if (!validScheduleTypes.includes(formData.scheduleType)) {
    return { isValid: false, message: "ScheduleType must be one of the following values: everyday, weekdays, custom." };
  }

  if (!formData.times || formData.times.length === 0) {
    return { isValid: false, message: "Times should not be empty." };
  }

  if (formData.weekdays.length === 0 && formData.scheduleType === 'custom') {
    return { isValid: false, message: "At least select one day for Custom Schedule Type" };
  }

  return { isValid: true, message: "Form data is valid." };
};


export const validateAlertFormData = (formData: AlertDataType | null): { isValid: boolean, message: string } => {
  if (!formData) {
    return { isValid: false, message: "Form data is null." };
  }

  if (!formData.name) {
    return { isValid: false, message: "Name should not be empty." };
  }

  if (!formData.device) {
    return { isValid: false, message: "Device should not be empty." };
  }

  return { isValid: true, message: "Form data is valid." };
}



export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatDateTime = (isoString: string) => {
  const dateObj = dayjs(isoString);
  const formattedDate = dateObj.format('DD MMM, YYYY');
  const formattedTime = dateObj.format('h:mm A');
  return { formattedDate, formattedTime };
};

export function formatToTitleCase(input: string): string {
  if (!input) {
    return '';
  }
  const words = input.trim().split(/\s+/);

  const formattedWords = words.map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });

  return formattedWords.join(' ');
}

export const iconsBasedOnType = (key: string) => {
  const icons: Record<string, string> = {
    humidity: '/icons/humidity.png',
    pressure: '/icons/highest-pressure.png',
    freezer: '/icons/freezer.png',
    fridge: '/icons/fridge.png',
    motion: '/icons/motion-sensor.png',
    no_motion_detected: '/icons/no-motion.png',
    motion_detected: '/icons/motion.png'
  }

  return icons[key] || '';
}

export const getDeviceLabelFromState = (value: string) => {
  const option = triggerWhenOptions.find(option => option.value === value);
  return option ? option.label : 'UnKnown State';
}

export const tranformObjectForSelectComponent = (objects: SingleNameIdObject[]) => {
  return objects.map(org => ({
    label: org.name+`|${org.code || ''}`,
    value: org.id
  }));
};

export const convertObjectToQueryString = (params: { [key: string]: any }): string => {
  const queryStringParts: string[] = [];

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      if (Array.isArray(params[key])) {
        params[key].forEach((value: string) => {
          queryStringParts.push(`${key}=${value}`);
        });
      } else {
        queryStringParts.push(`${key}=${params[key]}`);
      }
    }
  }

  

  if(queryStringParts.length === 0){
    return ''
  }
  return queryStringParts.join('&');
}