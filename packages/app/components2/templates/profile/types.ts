import { Company, User, Document } from 'app/lib/types';

export type ProfileTemplateProps = {
  user: User;
  company: Company;
  document: Document;
};
