import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import Image from '@/components/Image';

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  data: Array<{ label: string; value: string }>;
  handleSelectChange?: (value: string) => void;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = forwardRef(
  ({ defaultValue, data, handleSelectChange, placeholder, ...props }, ref) => {
    const [selected, setSelect] = useState(defaultValue);
    const [show, setShow] = useState(false);

    const handleSelect = (value: string) => {
      handleSelectChange && handleSelectChange(value);
      setSelect(value.toString());
      setShow(false);
    };

    useImperativeHandle(ref, () => ({
      // changeVal 就是暴露给父组件的方法
      onClose: () => {
        setShow(false);
      },
    }));

    const selectText = useMemo(() => {
      return data?.filter((item) => item.value === selected)?.[0]?.label;
    }, [data, selected]);

    return (
      <div
        {...props}
        className={`form-select relative ${props.className || ''}`}
      >
        <div
          className="flex-between cursor-pointer py-2.5 md:py-4 px-3 md:px-4 "
          onClick={() => setShow(!show)}
        >
          <div className={`${selected ? '' : 'text-[rgba(0,0,0,.25)]'}`}>
            {selectText ?? placeholder}
          </div>
          <Image
            alt=""
            src="/images/points/arrows.png"
            className={`h-3 ${show ? '-rotate-90' : 'rotate-90'}`}
          />
        </div>
        {show && (
          <ul className="absolute z-10 overflow-hidden w-full bg-white shadow-sm shadow-[rgba(0,0,0,0.3)] border rounded-lg border-[rgba(0,0,0,0.3)]">
            {data?.map(({ label, value }) => {
              return (
                <li
                  key={value}
                  className={`text-sm md:text-base px-2 md:px-4 py-2 md:py-3 text-left cursor-pointer hover:bg-black hover:text-white`}
                  onClick={() => handleSelect(value)}
                  value={`${value || ''}`}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
export default Select;
