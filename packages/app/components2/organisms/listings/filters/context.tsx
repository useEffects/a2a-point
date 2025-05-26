import { ExtraSmallLocationCardProps } from 'app/components2/molecules/locations/extra-small/utils';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

export const FiltersContext = createContext<{
  filters: FiltersContextType;
  setFilters: Dispatch<SetStateAction<FiltersContextType>>;
}>({ filters: {}, setFilters: () => {} });

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FiltersContextType>({});
  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export type FiltersContextType = {
  search?: {
    location?: ExtraSmallLocationCardProps;
  };
  purpose?: [];
  costRange?: [];
};
