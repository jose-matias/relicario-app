/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './index.css';

interface AppProps {
  onToggle: any;
  isToggled: boolean;
}

const ToggleSwitch: React.FC<AppProps> = ({ onToggle, isToggled }) => {
  return (
    <>
      <label className="toggle-switch">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className="switch" />
      </label>
    </>
  );
};

export default ToggleSwitch;
