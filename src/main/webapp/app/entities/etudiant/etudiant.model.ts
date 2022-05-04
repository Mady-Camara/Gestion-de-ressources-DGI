import { IUser } from 'app/entities/user/user.model';
import { IClassRoom } from 'app/entities/class-room/class-room.model';

export interface IEtudiant {
  id?: number;
  numeroEtudiant?: string | null;
  prenom?: string | null;
  nom?: string | null;
  email?: string | null;
  telephone?: string | null;
  user?: IUser | null;
  classRoom?: IClassRoom | null;
}

export class Etudiant implements IEtudiant {
  constructor(
    public id?: number,
    public numeroEtudiant?: string | null,
    public prenom?: string | null,
    public nom?: string | null,
    public email?: string | null,
    public telephone?: string | null,
    public user?: IUser | null,
    public classRoom?: IClassRoom | null
  ) {}
}

export function getEtudiantIdentifier(etudiant: IEtudiant): number | undefined {
  return etudiant.id;
}
