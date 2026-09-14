import {
  Banknote,
  Bath,
  BedDouble,
  CarFront,
  LandPlot,
  LucideIcon,
} from 'lucide-react-native';

export const keyToIcon: Record<
  (typeof rangeSelectorsData)[number]['key'],
  LucideIcon
> = {
  price: Banknote,
  size: LandPlot,
  bedrooms: BedDouble,
  bathrooms: Bath,
  parking: CarFront,
};

export const rangeSelectorsData = [
  {
    key: 'price',
    title: 'Price',
  },
  {
    key: 'size',
    title: 'Size',
  },
  {
    key: 'bedrooms',
    title: 'Bedroom',
  },
  {
    key: 'bathrooms',
    title: 'Bathrooms',
  },
  {
    key: 'parking',
    title: 'Parking',
  },
] as const;
