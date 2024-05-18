# LoadMore 加载更多

列表滚动到底部自动加载更多数据。

## 何时使用

用户想看到新的数据时，可以上滑页面自动加载数据。

当 `hasMore` 属性为 `true` 时，用户页面滚动到底部 `threshold` (默认为 `250px`)时无限滚动组件会调用定义的 `onLoad` 函数。

## 代码示例

```tsx
import React, { useState } from 'react';
import { LoadMore }from '@/components/LoadMore';
import { List, ListItem } from '@chakra-ui/react';

export default () => {
  const [data, setData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  async function onLoad() {
    // 获取数据
    // 业务中某些场景需要处理分页和搜索逻辑
    const append = await fetchData()
    setData(val => [...val, ...append])
    setHasMore(append.length > 0)
  }

  return (
    <>
      <List>
        {data.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <LoadMore onLoad={onLoad} hasMore={hasMore} />
    </>
  )
}
```

### 注意

LoadMore 会自动对 `onLoad` 函数加锁，避免重复的请求，但是前提是 `onLoad` 函数需要返回一个正确的 Promise，下面是正确和错误的用法示例：

```js
function onLoad() { // 错误
  doRequest()
}

async function onLoad() { // 错误
  doRequest()
}

async function onLoad() { // 正确
  await doRequest()
}

function onLoad() { // 正确
  return doRequest()
}
```
