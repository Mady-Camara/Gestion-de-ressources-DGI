import { IUser } from 'app/entities/user/user.model';

export interface IModule {
  id?: number;
  moduleName?: string | null;
  desccription?: string | null;
  user?: IUser | null;
}

export class Module implements IModule {
  constructor(public id?: number, public moduleName?: string | null, public desccription?: string | null, public user?: IUser | null) {}
}

export function getModuleIdentifier(module: IModule): number | undefined {
  return module.id;
}
