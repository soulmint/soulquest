import React from 'react';
import classes from './countdown.module.css';

interface numProp {
  num: string | number;
  unit: string;
  flip: boolean;
}

export const NumberBox = ({ num, unit, flip }: numProp) => {
  return (
    <div className={`${classes.timerNumber}`}>
      <div className="flex flex-col">
        <span className="text-3xl font-bold">{num}</span>
        <span className="text-sm">{unit}</span>
      </div>
    </div>
  );
};
