import {Container} from '@/components/ui/Layout';
import {Voedingswaarde} from '@/types';
import {camelCase} from 'lodash';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface NutritionalValueSliderProps {
  nutritionalValue: Voedingswaarde;
  onSliderChange: (id: number, value: number) => void;
}

const CLASSES = {
  wrapper: 'w-full items-center mb-3',
  label: {
    container: 'flex max-w-full items-end justify-between cursor-pointer grow',
    text: 'text-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-white',
    value: 'text-sm',
  },
  slider:
    'w-full h-2 mb-3 accent-ps-blue-400 bg-gray-200 focus:outline-none rounded-lg appearance-none cursor-pointer dark:bg-gray-700',
  range: {
    container: '-mt-2 flex w-full justify-between',
    value: 'text-sm text-gray-600',
  },
} as const;

const NutritionalValueSlider = ({
  nutritionalValue,
  onSliderChange,
}: NutritionalValueSliderProps) => {
  const {t} = useTranslation('common');
  const {id, name, minValue, maxValue, currentValue} = nutritionalValue;
  const [tempValue, setTempValue] = useState(currentValue);

  useEffect(() => {
    setTempValue(currentValue);
  }, [currentValue]);

  const sliderId = `nutritional-slider-${id}-${name.toString().toLowerCase()}`;
  const translatedName = t(`range.${camelCase(name)}`);
  const roundedMaxValue = Math.ceil(maxValue);

  const handleSliding = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setTempValue(newValue);
    }
  };

  const handleRelease = () => {
    if (tempValue !== currentValue) {
      onSliderChange(id, tempValue);
    }
  };

  return (
    <Container className={CLASSES.wrapper}>
      <label htmlFor={sliderId} className={CLASSES.label.container}>
        <h4 className={CLASSES.label.text}>{translatedName}</h4>
        <span
          className={CLASSES.label.value}
          aria-label={`Current value: ${tempValue}`}
        >
          {tempValue}
        </span>
      </label>

      <input
        type="range"
        id={sliderId}
        name={sliderId}
        className={CLASSES.slider}
        min={minValue}
        max={roundedMaxValue}
        value={tempValue}
        onChange={handleSliding}
        onMouseUp={handleRelease}
        onTouchEnd={handleRelease}
        role="slider"
        aria-valuemin={minValue}
        aria-valuemax={roundedMaxValue}
        aria-valuenow={tempValue}
        aria-labelledby={`${sliderId}-label`}
      />

      <Container className={CLASSES.range.container}>
        <span className={CLASSES.range.value}>{minValue}</span>
        <span className={CLASSES.range.value}>{roundedMaxValue}</span>
      </Container>
    </Container>
  );
};

export default NutritionalValueSlider;
