import React from 'react';
import { Spin } from 'antd';

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  size?: 'small' | 'large';
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ loading, children, size = "large" }) => {
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
          <Spin size={size} />
        </div>
      )}
      <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {children}
      </div>
    </div>
  );
};

export default LoadingWrapper;
