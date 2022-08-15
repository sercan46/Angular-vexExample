import { MailLabel } from './mail-label.interface';
import { MailAttachment } from './mail-attachment.interface';

export interface Mail {
  id: number;
  from: {
    name: string;
    email: string;
    imgUrl: string;
  };
  to: {
    name: string;
    email: string;
  };
  date: string;
  subject: string;
  body: string;
  labels: MailLabel[];
  attachments: MailAttachment[];
  read: boolean;
  starred: boolean;
}
