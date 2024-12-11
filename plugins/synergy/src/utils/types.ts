import { ReactElement } from 'react';

export type TabContent = {
  label: string;
  style?: object;
  icon?: ReactElement;
  children: ReactElement;
};
