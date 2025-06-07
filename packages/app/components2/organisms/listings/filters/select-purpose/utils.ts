import { CommonFilters } from 'app/components/cards/molecules/listings';
import {
  Award,
  Sparkles,
  CreditCard,
  HousePlus,
  Handshake,
} from 'lucide-react-native';
import { PurposeProps } from './purpose';

export const purposes: Pick<PurposeProps, 'Icon' | 'filterType' | 'id'>[] = [
  {
    id: '1',
    Icon: Award,
    filterType: CommonFilters.Premium,
  },
  {
    id: '2',
    Icon: Sparkles,
    filterType: CommonFilters.Sale,
  },
  {
    id: '3',
    Icon: CreditCard,
    filterType: CommonFilters.Buy,
  },
  {
    id: '4',
    Icon: HousePlus,
    filterType: CommonFilters.GiveOnRent,
  },
  {
    id: '5',
    Icon: Handshake,
    filterType: CommonFilters.TakeOnRent,
  },
];
