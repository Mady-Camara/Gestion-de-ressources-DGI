import dayjs from 'dayjs/esm';
import { IModule } from 'app/entities/module/module.model';
import { IUser } from 'app/entities/user/user.model';

export interface ICourse {
  id?: number;
  courseName?: string | null;
  totalHour?: dayjs.Dayjs | null;
  beginHourse?: dayjs.Dayjs | null;
  endHour?: dayjs.Dayjs | null;
  module?: IModule | null;
  user?: IUser | null;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public courseName?: string | null,
    public totalHour?: dayjs.Dayjs | null,
    public beginHourse?: dayjs.Dayjs | null,
    public endHour?: dayjs.Dayjs | null,
    public module?: IModule | null,
    public user?: IUser | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
