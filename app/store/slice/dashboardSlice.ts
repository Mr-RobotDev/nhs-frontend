import axiosInstance from "@/lib/axiosInstance";
import { DashboardType, DashboardCardType } from "@/type";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs, { Dayjs } from "dayjs";
import { Key } from "react";
import { TimeFrameType } from "@/type";
import timeFrames from "@/utils/time_frames";

interface DashboardState {
  dashboards: any[];
  currentDashboard: DashboardType;
  isLoading: {
    create: boolean;
    list: boolean;
    get: boolean;
    delete: boolean;
    updateCard: boolean;
    gettingDashboardCards: boolean;
  };
  dashboardCards: DashboardCardType[];
  error: string;
  timeFrame: TimeFrameType
  fullScreen: boolean
}

interface createCardType {
  dashboard: string;
  cardName: string;
  cols: number;
  rows: number;
  x?: number;
  y?: number;
  devices: Key[]
}


const initialState: DashboardState = {
  dashboards: [],
  currentDashboard: { name: '', cardsCount: 0, devicesCount: 0, id: '' },
  isLoading: {
    create: false,
    list: false,
    get: false,
    delete: false,
    updateCard: false,
    gettingDashboardCards: false,
  },
  dashboardCards: [],
  error: '',
  timeFrame: timeFrames.yesterday,
  fullScreen: false
}

export const getDashboards = createAsyncThunk('dashboard/getDashboards', async () => {
  const response = await axiosInstance.get('/dashboards')
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to fetch dashboards');
})

export const getDashboard = createAsyncThunk('dashboard/getDashboard', async ({ dashboardId }: { dashboardId: string }) => {
  const response = await axiosInstance.get(`/dashboards/${dashboardId}`)
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to fetch dashboard');
})

export const getDashboardCards = createAsyncThunk('dashboard/getDashboardCards', async ({ dashboardId }: { dashboardId: string }) => {
  const response = await axiosInstance.get(`/dashboards/${dashboardId}/cards`)
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to fetch dashboard cards');
})

export const createDashboard = createAsyncThunk('dashboard/createDashboard', async ({ name }: { name: string }) => {
  const response = await axiosInstance.post('/dashboards', { name })
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to create dashboard');
})

export const deleteDashboard = createAsyncThunk('dashboard/deleteDashboard', async ({ dashboardId }: { dashboardId: string }) => {
  const response = await axiosInstance.delete(`/dashboards/${dashboardId}`)
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to delete dashboard');
})

export const updateDashboard = createAsyncThunk('/dashboard/updateDashboard', async ({ dashboardId, dashboardName }: { dashboardId: string, dashboardName: string }) => {
  const response = await axiosInstance.patch(`/dashboards/${dashboardId}`, { name: dashboardName })
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to update dashboard');
})

export const deleteCard = createAsyncThunk('dashboard/deleteCard', async ({ dashboardId, cardId }: { dashboardId: string, cardId: string }) => {
  // /dashboards/:dashboard/cards/:card
  const response = await axiosInstance.delete(`/dashboards/${dashboardId}/cards/${cardId}`)
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to Delete dashboard');
})



export const createCard = createAsyncThunk('/dashboard/card/create', async ({ dashboard, cardName, cols = 2, rows = 2, x = 0, y = 0, devices = [] }: createCardType) => {
  const response = await axiosInstance.post(`/dashboards/${dashboard}/cards`, {
    name: cardName,
    x,
    y,
    rows,
    cols,
    devices,
  })
  console.log('response->', response)
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to create card');
})


export const updateCard = createAsyncThunk('/dashboard/card/update', async ({ dashboardId, cardObj }: { dashboardId: string, cardObj: DashboardCardType }) => {
  const response = await axiosInstance.patch(`/dashboards/${dashboardId}/cards/${cardObj.id}`, {
    name: cardObj.name,
    x: cardObj.x,
    y: cardObj.y,
    rows: cardObj.rows,
    cols: cardObj.cols,
  })
  if (response.status === 200) {
    return response.data
  }

  throw new Error('Failed to update card');
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetState: (state) => {
      Object.assign(state, initialState);
    },
    setCurrentDashboard: (state, action: PayloadAction<any>) => {
      state.dashboardCards = []
      state.currentDashboard = action.payload
    },
    setTimeFrame: (state, action) => {
      state.timeFrame = action.payload;
    },
    setFullScreen: (state, action) => {
      state.fullScreen = action.payload
    },
    clearDashboardCards: (state) => {
      state.dashboardCards = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboards.pending, (state) => {
        state.isLoading.list = true
      })
      .addCase(getDashboards.fulfilled, (state, action) => {
        state.dashboards = action.payload
        state.isLoading.list = false;
        if (state.dashboards.length > 0 && !state.currentDashboard.id) {
          state.currentDashboard = state.dashboards[0]
        }
      })
      .addCase(getDashboards.rejected, (state, action) => {
        state.isLoading.list = false
      })
      .addCase(getDashboard.pending, (state) => {
        state.isLoading.get = true
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.currentDashboard = action.payload
        state.isLoading.get = false;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.isLoading.get = false
      })
      .addCase(getDashboardCards.pending, (state, action) => {
        state.isLoading.get = true
        state.isLoading.gettingDashboardCards = true;
      })
      .addCase(getDashboardCards.fulfilled, (state, action) => {
        state.dashboardCards = action.payload
        state.isLoading.get = false;
        state.isLoading.gettingDashboardCards = false;
      })
      .addCase(getDashboardCards.rejected, (state, action) => {
        state.isLoading.get = false
        state.isLoading.gettingDashboardCards = false;
      })
      .addCase(createDashboard.pending, (state, action) => {
        state.isLoading.create = true;
      })
      .addCase(createDashboard.fulfilled, (state, action) => {
        state.isLoading.create = false;
        state.dashboards.push(action.payload);
        state.currentDashboard = action.payload
        state.dashboardCards = []
        
      })
      .addCase(createDashboard.rejected, (state, action) => {
        state.isLoading.create = false
      })
      .addCase(deleteDashboard.fulfilled, (state, action) => {
        state.isLoading.delete = false;
        state.dashboards = state.dashboards.filter(dashboard => dashboard.id !== action.payload.id)

        if (state.currentDashboard.id === action.payload.id) {
          state.currentDashboard = { name: '', cardsCount: 0, devicesCount: 0, id: '' }
        }
      })

      .addCase(updateDashboard.fulfilled, (state, action) => {
        const index = state.dashboards.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.dashboards[index] = action.payload;  // Update with the confirmed data from the server
        }
        state.currentDashboard = action.payload
      })

      .addCase(createCard.pending, (state, action) => {
        state.isLoading.create = true
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.dashboardCards.push(action.payload)
      })
      .addCase(createCard.rejected, (state, action) => {
        state.isLoading.create = false
      })

      .addCase(deleteCard.pending, (state, action) => {
        state.isLoading.delete = true;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.isLoading.delete = false;
        state.dashboardCards = state.dashboardCards.filter(card => card.id !== action.payload.id)
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.isLoading.delete = false
      })
      .addCase(updateCard.pending, (state, action) => {
        state.error = ''
        state.isLoading.updateCard = true;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        state.isLoading.updateCard = false;
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.isLoading.updateCard = false;
        state.error = action.error.message ?? 'Failed to Update the card';
      })
  }
})

export const {
  resetState,
  setCurrentDashboard,
  setTimeFrame,
  setFullScreen,
  clearDashboardCards
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
