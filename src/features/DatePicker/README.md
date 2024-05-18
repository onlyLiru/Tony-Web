# DatePicker 日期选择器

- 基于[React DayPicker](https://react-day-picker.js.org/) 封装

## 代码示例

基础用法

```tsx
import { DatePicker } from '@/features/DatePicker';

export default () => {
  const [value, setValue] = useState()
  return <DatePicker value={value} onChange={setValue} />;
};
```

自定义渲染

```tsx
import { DatePicker } from '@/features/DatePicker';

export default () => {
  const [value, setValue] = useState()
  return (
    <DatePicker value={value} onChange={setValue}>
      (({ value, onToggle }) => (
        <Input value={format(value, 'yyyy-MM-dd HH:ss')} onClick={onToggle} />
      ))
    </DatePicker>
  )
};
```

业务中请自行转换需要的格式

```tsx
import { format } from 'date-fns'

// 表单提交前
const onSubmit = async () => {
  ...
  values.date = format(values.date, 'yyyy-MM-dd HH:ss')
  ...
}

```
