import { Select } from 'antd';
import type { SelectProps } from 'antd';
import type { ReactNode } from 'react';

import { filterSelectOptionByLabelValue } from '@/shared/utils/select';

export type AppSelectValue = string | number;

export interface AppSelectOption<ValueType extends AppSelectValue = string> {
  disabled?: boolean;
  label: ReactNode;
  value: ValueType;
}

interface AppSelectProps<ValueType extends AppSelectValue = string>
  extends Omit<
    SelectProps<ValueType, AppSelectOption<ValueType>>,
    'filterOption' | 'optionFilterProp' | 'options' | 'showSearch'
  > {
  filterByLabelValue?: boolean;
  options?: Array<AppSelectOption<ValueType>>;
  searchable?: boolean;
}

export function AppSelect<ValueType extends AppSelectValue = string>({
  filterByLabelValue = true,
  options,
  searchable = true,
  ...selectProps
}: AppSelectProps<ValueType>) {
  return (
    <Select<ValueType, AppSelectOption<ValueType>>
      showSearch={searchable}
      optionFilterProp="label"
      filterOption={filterByLabelValue ? filterSelectOptionByLabelValue : undefined}
      options={options}
      {...selectProps}
    />
  );
}
