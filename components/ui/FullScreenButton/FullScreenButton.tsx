import { setFullScreen } from '@/app/store/slice/dashboardSlice';
import { RootState } from '@/app/store/store';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';

const FullScreenButton: React.FC = () => {
  const { fullScreen } = useSelector((state: RootState) => state.dashboardReducer);
  const dispatch = useDispatch()

  const handleFullScreen = () => {
    if (!fullScreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    dispatch(setFullScreen(!fullScreen));
  };

  return (
    <Button onClick={handleFullScreen}>
      {fullScreen ?
        <div className=' w-full h-full flex flex-row items-center gap-2'>
          <p className=' !mb-0'>Exit Full Screen</p>
          <MdFullscreenExit className=' w-6 h-6' />
        </div>
        :
        <div className=' w-full h-full flex flex-row items-center gap-2'>
          <p className=' !mb-0'>Enter Full Screen</p>
          <MdFullscreen className=' w-6 h-6' />
        </div>
      }
    </Button>
  );
};

export default FullScreenButton;
