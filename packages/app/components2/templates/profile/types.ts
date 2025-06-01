import { Company, User, Document } from 'app/lib/types';
import { Dispatch, SetStateAction } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type ProfileTemplateProps = {
  user: User;
  company: Company;
  document: Document;
};
