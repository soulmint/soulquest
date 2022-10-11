import {
  addMinutes,
  intervalToDuration,
  isAfter,
  format,
  subMonths,
} from 'date-fns';

export function isValidYMD(year: number, month: number, date: number) {
  const d = new Date(year, month - 1, date); // monthは0始まり
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month - 1 ||
    d.getDate() !== date
  ) {
    return false;
  }
  return true;
}

export function getYMD(date: Date) {
  const y = date.getFullYear();
  const m = `0${date.getMonth() + 1}`.slice(-2);
  const d = `0${date.getDate()}`.slice(-2);
  return `${y}-${m}-${d}`;
}

export function setYMD(date: Date | null, ymd: string) {
  const result = date ? new Date(date) : new Date();
  const [y, m, d] = ymd.split('-').map((e) => parseInt(e));
  result.setFullYear(y);
  result.setMonth(m - 1);
  result.setDate(d);
  return result;
}

export function getHM(date: Date) {
  const h = `0${date.getHours()}`.slice(-2);
  const m = `0${date.getMinutes()}`.slice(-2);
  return `${h}:${m}`;
}

export function setHM(date: Date | null, hm: string) {
  const result = date ? new Date(date) : new Date();
  const [h, m] = hm.split(':').map((e) => parseInt(e));
  result.setHours(h, m);
  return result;
}

export function totallingPeriodFormat(date: Date) {
  return format(date, 'yyyy/MM/dd HH:00');
}

export function getRankingTypeTotallingPeriod(i: number) {
  const date = new Date();
  if (i < 0) {
    return `${totallingPeriodFormat(
      new Date('2021-08-01'),
    )} 〜 ${totallingPeriodFormat(new Date())}`;
  }
  return `${totallingPeriodFormat(
    new Date(date.setDate(date.getDate() - i)),
  )} 〜 ${totallingPeriodFormat(new Date())}`;
}

export function getMonthlyTotallingPeriod(i: number) {
  const date = new Date();
  const fromDate = new Date(date.getFullYear(), date.getMonth() - i, 1);
  // 当月の場合は現在時刻までの表示
  const toDate =
    i === 0 ? date : new Date(date.getFullYear(), date.getMonth() - (i - 1), 1);
  return `${totallingPeriodFormat(fromDate)} 〜 ${totallingPeriodFormat(
    toDate,
  )}`;
}

export function getPeriodMonths(): string[] {
  const date = new Date();
  let month;
  const months: string[] = [];
  for (let i = 0; i < 6; i++) {
    month = format(subMonths(date, i), 'yyyyMM');
    months.push(month);
  }
  // yyyyMM の 6桁を文字列配列で返却
  return months;
}

export function getCurrentTime(): Date {
  return new Date();
}

export function getMinutesOffsetTime(offsetMinutes: number, base?: Date): Date {
  if (!base) base = getCurrentTime();
  return addMinutes(base, offsetMinutes);
}

const ZERO_DURATION = '00:00';
export function calcLastTime(expiredTimeStr: string): string {
  const base = getCurrentTime();
  const expiredTime = new Date(expiredTimeStr);
  if (isAfter(base, expiredTime)) return ZERO_DURATION;
  const duration = intervalToDuration({ start: base, end: expiredTime });
  return `${duration.minutes && duration.minutes > 9 ? '' : '0'}${
    duration.minutes
  }:${duration.seconds && duration.seconds > 9 ? '' : '0'}${duration.seconds}`;
}
