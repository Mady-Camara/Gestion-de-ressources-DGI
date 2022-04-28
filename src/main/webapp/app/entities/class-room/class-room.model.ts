import { ISchedule } from 'app/entities/schedule/schedule.model';
import { ICourse } from 'app/entities/course/course.model';

export interface IClassRoom {
  id?: number;
  classroomName?: string | null;
  schedule?: ISchedule | null;
  course?: ICourse | null;
}

export class ClassRoom implements IClassRoom {
  constructor(
    public id?: number,
    public classroomName?: string | null,
    public schedule?: ISchedule | null,
    public course?: ICourse | null
  ) {}
}

export function getClassRoomIdentifier(classRoom: IClassRoom): number | undefined {
  return classRoom.id;
}
