import { Mail } from '../app/pages/apps/mail/interfaces/mail.interface';
import faker from 'faker/locale/en';
import { MailLabel } from '../app/pages/apps/mail/interfaces/mail-label.interface';
import { MailAttachment } from '../app/pages/apps/mail/interfaces/mail-attachment.interface';

const fakeMailLabels: MailLabel[] = [
  {
    label: 'Business',
    classes: ['bg-primary-light', 'text-primary']
  },
  {
    label: 'Secret',
    classes: ['bg-teal-light', 'text-teal']
  },
  {
    label: 'Important',
    classes: ['bg-warn-light', 'text-warn']
  },
  {
    label: 'Private',
    classes: ['bg-purple-light', 'text-purple']
  }
];

function createFakeMailAttachment(seed: number): MailAttachment {
  faker.seed(seed);

  const type = faker.system.commonFileExt();
  const imgUrl = `assets/img/demo/${faker.random.number(8)}.jpg`;

  return {
    label: faker.system.fileName(type),
    type,
    imgUrl
  };
}

function createFakeMail(id: number): Mail {
  faker.seed(id);
  const from: Mail['from'] = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    imgUrl: faker.image.avatar(),
  };

  const to: Mail['to'] = {
    name: 'David Smith',
    email: 'david.smith@example.org'
  };

  const date: string = faker.date.recent(30).toISOString();
  const subject: string = faker.lorem.sentence();
  const body: string = faker.fake(`<p>Hey ${to.name},</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>Best,<br/>${from.name}</p>`);

  const labels: MailLabel[] = faker.random.boolean() ? [] : [fakeMailLabels[faker.random.number(4)]];
  const attachments: MailAttachment[] = faker.random.boolean() ? [] : createArray(faker.random.number(3)).map(seed => createFakeMailAttachment(seed));
  const read: boolean = faker.random.boolean();
  const starred: boolean = faker.random.boolean();

  return {
    id,
    from,
    to,
    date,
    subject,
    body,
    labels,
    attachments,
    read,
    starred
  };
}

function createArray(length: number) {
  const array = [];

  for (let i = 0; i < length; i++) {
    array.push(i);
  }

  return array;
}

const fakeMailAttachments: MailAttachment[] = createArray(5).map(id => createFakeMailAttachment(id));
export const fakeMails: Mail[] = createArray(20).map(id => createFakeMail(id));
