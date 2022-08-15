import { Icon } from '@visurel/iconify-angular';

export interface MailSidenavLink {
  label: string;
  route: string[];
  icon: Icon;
  routerLinkActiveOptions?: { exact: boolean };
}
