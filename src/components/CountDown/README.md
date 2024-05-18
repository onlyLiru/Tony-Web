# CountDown 倒计时

## 介绍

用于实时展示倒计时数值，支持毫秒精度。

## 代码演示

### 基础用法

`time` 属性表示倒计时总时长，单位为毫秒。

```jsx
<CountDown time={30 * 60 * 60 * 1000} />
```

### 自定义格式

通过 `format` 属性设置倒计时文本的内容。

```jsx
<CountDown time={30 * 60 * 60 * 1000} format="DD 天 HH 时 mm 分 ss 秒" />
```

### 毫秒级渲染

倒计时默认每秒渲染一次，设置 `millisecond` 属性可以开启毫秒级渲染。

```jsx
<CountDown time={30 * 60 * 60 * 1000} millisecond format="HH:mm:ss:SS" />
```

### 自定义样式

通过`children`自定义倒计时的样式

```jsx
<CountDown time={30 * 60 * 60 * 1000} format="HH:mm:ss">
  {(timeData) => (
    <>
      <Box>{timeData.hours}</Box>
      <Text>:</Text>
      <Box>{timeData.minutes}</Box>
      <Text>:</Text>
      <Box>{timeData.seconds}</Box>
    </>
  )}
</CountDown>
```

### 手动控制

通过 ref 获取到组件实例后，可以调用 `start`、`pause`、`reset` 方法。

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| time        | 倒计时时长，单位毫秒 | _number \| string_ | `0`        |
| format      | 时间格式             | _string_           | `HH:mm:ss` |
| autoStart   | 是否自动开始倒计时   | _boolean_          | `true`     |
| millisecond | 是否开启毫秒级渲染   | _boolean_          | `false`    |

### format 格式

| 格式 | 说明         |
| ---- | ------------ |
| DD   | 天数         |
| HH   | 小时         |
| mm   | 分钟         |
| ss   | 秒数         |
| S    | 毫秒（1 位） |
| SS   | 毫秒（2 位） |
| SSS  | 毫秒（3 位） |
