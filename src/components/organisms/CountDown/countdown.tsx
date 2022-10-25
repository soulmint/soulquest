import React, { useState, useEffect } from 'react';
import { TimerContainer } from './timercontainer';
import classes from './countdown.module.css';
import useThemes from 'src/hooks/useThemes';

interface timeProps {
  date: number | string;
}

const CountDown = ({ date }: timeProps) => {
  const { rootClassName } = useThemes();
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const countDownDate = new Date(date).getTime();

  useEffect(() => {
    // eslint-disable-next-line no-var
    var updateTime = setInterval(() => {
      const now = new Date().getTime();

      const difference = countDownDate - now;

      const newDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      const newHours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const newMinutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const newSeconds = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(newDays);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);

      if (difference <= 0) {
        clearInterval(updateTime);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    });

    return () => {
      clearInterval(updateTime);
    };
  }, [countDownDate]);

  return (
    <div className={`${classes[rootClassName]}`}>
      <TimerContainer
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    </div>
  );
};
export default CountDown;
