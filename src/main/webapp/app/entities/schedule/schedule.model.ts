import dayjs from 'dayjs/esm';

export interface ISchedule {
  id?: number;
  beginDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
}

export class Schedule implements ISchedule {
  constructor(public id?: number, public beginDate?: dayjs.Dayjs | null, public endDate?: dayjs.Dayjs | null) {}
}

export function getScheduleIdentifier(schedule: ISchedule): number | undefined {
  return schedule.id;
}
