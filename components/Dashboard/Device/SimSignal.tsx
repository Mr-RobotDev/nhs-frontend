import React from "react";
import styled from "styled-components";

interface SignalBarProps {
  level: number;
  active: boolean;
  color: string;
}

const SignalWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 30px; // Adjust height as needed
`;

const SignalBar = styled.div<SignalBarProps>`
  width: 4px;
  height: ${({ level }) => `${level}%`};
  border-radius: 2px;
  margin: 0 2px;
  background-color: ${({ active, color }) => (active ? color : "lightgray")};
`;

interface SimSignalProps {
  signalStrength: number;
}

const SimSignal: React.FC<SimSignalProps> = ({ signalStrength }) => {
  const bars = [20, 40, 60, 80, 100];
  const activeBars = Math.ceil(signalStrength / 20);
  let color = "red";

  if (signalStrength > 80) color = "green";
  else if (signalStrength > 60) color = "lightgreen";
  else if (signalStrength > 40) color = "yellow";
  else if (signalStrength > 20) color = "orange";

  return (
    <SignalWrapper>
      {bars.map((bar, index) => (
        <SignalBar
          key={index}
          level={bar}
          active={index < activeBars}
          color={color}
        />
      ))}
    </SignalWrapper>
  );
};

export default SimSignal;
