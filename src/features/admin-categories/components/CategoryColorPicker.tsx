import { CheckOutlined } from '@ant-design/icons';
import { ColorPicker, Typography } from 'antd';

import {
  ADMIN_CATEGORY_COLOR_PRESETS,
  ADMIN_CATEGORY_TAG_COLOR_SWATCHES,
  DEFAULT_ADMIN_CATEGORY_TAG_COLOR,
} from '../constants/admin-category-colors';

interface CategoryColorPickerProps {
  onChange?: (value: string) => void;
  value?: string;
}

const normalizeColor = (color?: string) => color || DEFAULT_ADMIN_CATEGORY_TAG_COLOR;

export function CategoryColorPicker({ onChange, value }: CategoryColorPickerProps) {
  const selectedColor = normalizeColor(value).toUpperCase();

  const handleChange = (color: string) => {
    onChange?.(normalizeColor(color).toUpperCase());
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ColorPicker
          disabledAlpha
          format="hex"
          presets={ADMIN_CATEGORY_COLOR_PRESETS}
          showText={(color) => (
            <Typography.Text strong>{color.toHexString().toUpperCase()}</Typography.Text>
          )}
          value={selectedColor}
          onChange={(_, hexColor) => handleChange(hexColor)}
        />
        <Typography.Text type="secondary" className="text-xs">
          Màu hiển thị trên tag danh mục
        </Typography.Text>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-12">
        {ADMIN_CATEGORY_TAG_COLOR_SWATCHES.map((color) => {
          const swatchColor = color.toUpperCase();
          const isSelected = swatchColor === selectedColor;

          return (
            <button
              key={color}
              type="button"
              aria-label={`Chọn màu ${swatchColor}`}
              className="flex aspect-square min-h-8 items-center justify-center rounded-md border border-white shadow-sm outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-slate-900"
              style={{
                backgroundColor: color,
                boxShadow: isSelected
                  ? '0 0 0 2px #ffffff, 0 0 0 4px rgba(15, 23, 42, 0.35)'
                  : undefined,
              }}
              title={swatchColor}
              onClick={() => handleChange(color)}
            >
              {isSelected ? <CheckOutlined className="text-white drop-shadow" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
