# @malita/keepalive

react 中的状态保持组件

## 安装

```bash
yarn add @malita/keepalive
```

## 使用

```tsx
import KeepAliveLayout, { useKeepOutlets, KeepAliveContext } from '@malita/keepalive';
import { useLocation } from 'react-router-dom';
import React, { useState, useContext } from 'react';

// 使用 useKeepOutlets 取到当前渲染的页面内容，可能是缓存内容
const Layout = () => {
    const element = useKeepOutlets();
    return (
        {element}
    )
}

// 使用 KeepAliveLayout 包裹上下文
const App = () => {
    return (
        <KeepAliveLayout keepalive={[/./]}>
            // App
        </KeepAliveLayout>
    );
}

// 使用 useContext 取到 dropByCacheKey 清除缓存
const Home = () => {
    const { dropByCacheKey } = useContext<any>(KeepAliveContext);
    const { pathname } = useLocation();
    return (
       <button onClick={() => dropByCacheKey(pathname)}> Click Me! Clear Cache!</button>
    )
}
```