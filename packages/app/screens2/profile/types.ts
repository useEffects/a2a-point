import { ProfileTemplateProps } from 'app/components2/templates/profile/types';

export type ProfileScreenProps = Pick<
  ProfileTemplateProps,
  'company' | 'user' | 'document'
>;
