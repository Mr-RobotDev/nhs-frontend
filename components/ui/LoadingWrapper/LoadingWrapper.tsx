import React from 'react';
import { Spin } from 'antd';

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ loading, children }) => {
  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            zIndex: 10,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {children}
      </div>
    </div>
  );
};

export default LoadingWrapper;
