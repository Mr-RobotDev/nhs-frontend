import { alertRange } from "@/type";
import { ApexOptions } from "apexcharts";

export const humidityColors = [
  "#43A6C6",
  "#6EC5DC",
  "#70C3D2",
  "#74C4CC",
  "#77C5CA",
  "#82C7C8",
  "#8BCBC6",
  "#94CDC4",
  "#9DCFC2",
  "#A6D1C0",
  "#B0D3BE",
];

export const temperatureColors = [
  "#FF6666",
  // "#FF1A1A",
  "#FF0000",
  "#E60000",
  "#CC0000",
  "#B30000",
  "#990000",
  "#800000"
];

export const commonApexOptions: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: false,
        pan: false,
        reset: true,
      },
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
  markers: {
    size: 3,
    strokeWidth: 2,
    hover: {
      size: 4,
    },
  }
}

type Annotation = {
  yaxis: {
    y: number;
    y2: number;
    borderColor: string;
    fillColor: string;
    label?: {
      text: string;
    };
  }[];
};



export const generateAnnotations = (range: alertRange | undefined): Annotation => {
  if (range === undefined) {
    return { yaxis: [] }
  }

  const { lower, upper, type } = range;
  if (type === 'outside') {
    return {
      yaxis: [
        {
          y: lower,
          y2: upper,
          borderColor: 'rgba(0,0,0,0)',
          fillColor: 'rgba(0,0,0,0)',
          label: {
            text: ''
          }
        },
        {
          y: -Infinity,
          y2: lower,
          borderColor: '#FF4560',
          fillColor: 'rgba(255, 69, 96, 0.2)',
          label: {
            text: `Below ${lower}`
          }
        },
        {
          y: upper,
          y2: Infinity,
          borderColor: '#FF4560',
          fillColor: 'rgba(255, 69, 96, 0.2)',
          label: {
            text: `Above ${upper}`
          }
        }
      ]
    };
  } else if (type === 'inside') {
    return {
      yaxis: [
        {
          y: -Infinity,
          y2: lower,
          borderColor: 'rgba(0,0,0,0)',
          fillColor: 'rgba(0,0,0,0)',
        },
        {
          y: upper,
          y2: Infinity,
          borderColor: 'rgba(0,0,0,0)',
          fillColor: 'rgba(0,0,0,0)',
        },
        {
          y: lower,
          y2: upper,
          borderColor: '#FF4560',
          fillColor: 'rgba(255, 69, 96, 0.2)',
          label: {
            text: `Between ${lower} and ${upper}`
          }
        }
      ]
    };
  } else if (type === 'upper') {
    return {
      yaxis: [
        {
          y: upper,
          y2: Infinity,
          borderColor: '#FF4560',
          fillColor: 'rgba(255, 69, 96, 0.2)',
          label: {
            text: `Above ${upper}`
          }
        }
      ]
    };
  } else if (type === 'lower') {
    return {
      yaxis: [
        {
          y: -Infinity,
          y2: lower,
          borderColor: '#FF4560',
          fillColor: 'rgba(255, 69, 96, 0.2)',
          label: {
            text: `Below ${lower}`
          }
        }
      ]
    };
  } else {
    return {
      yaxis: []
    };
  }
}