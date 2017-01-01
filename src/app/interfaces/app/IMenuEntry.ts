import { MenuType } from 'app/enums';
/**
 * A main menu entry.
 */
interface IMenuEntry {
  id: any;
  name: string;
  type: MenuType;
  icon: any;
  items?: IMenuEntry[];
}

export {
  IMenuEntry
}
