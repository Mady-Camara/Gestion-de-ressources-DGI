import dayjs from 'dayjs/esm';
import { IModule } from 'app/entities/module/module.model';
import { IUser } from 'app/entities/user/user.model';
import { IClassRoom } from 'app/entities/class-room/class-room.model';

export interface ICourse {
  id?: number;
  courseName?: string | null;
  pointer?: boolean | null;
  jour?: dayjs.Dayjs | null;
  volumeHoraire?: number | null;
  salle?: string | null;
  heureDeDebut?: string;
  heureDeFin?: string;
  module?: IModule | null;
  user?: IUser | null;
  classe?: IClassRoom | null;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public courseName?: string | null,
    public pointer?: boolean | null,
    public jour?: dayjs.Dayjs | null,
    public volumeHoraire?: number | null,
    public salle?: string | null,
    public heureDeDebut?: string,
    public heureDeFin?: string,
    public module?: IModule | null,
    public user?: IUser | null,
    public classe?: IClassRoom | null
  ) {
    this.pointer = this.pointer ?? false;
  }
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
