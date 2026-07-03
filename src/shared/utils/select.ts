import type { DefaultOptionType } from 'antd/es/select';

const toSearchText = (value: unknown) => String(value ?? '').trim().toLowerCase();

export const filterSelectOptionByLabelValue = (input: string, option?: DefaultOptionType) => {
  const keyword = toSearchText(input);
  const label = toSearchText(option?.label);
  const value = toSearchText(option?.value);

  return label.includes(keyword) || value.includes(keyword);
};
