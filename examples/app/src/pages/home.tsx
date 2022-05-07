import React, { useState } from 'react';
import { Image, Swiper, Toast, Grid, Space, List } from 'antd-mobile';
import "./home.css";

const demoSrc =
    'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'

const users = [
    {
        id: '1',
        avatar:
'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Novalee Spicer',
        description: 'Deserunt dolor ea eaque eos',
    },
    {
        id: '2',
        avatar:
'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
        name: 'Sara Koivisto',
        description: 'Animi eius expedita, explicabo',
    },
    {
        id: '3',
        avatar:
'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Marco Gregg',
        description: 'Ab animi cumque eveniet ex harum nam odio omnis',
    },
    {
        id: '4',
        avatar:
'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Edith Koenig',
        description: 'Commodi earum exercitationem id numquam vitae',
    },
];
const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac', '#ffcabd', '#ffc0c0'];

const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
        <div
style={{
    background: color,
    height: '120px',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '48px',
    userSelect: 'none'
}}
onClick={() => {
    Toast.show(`你点击了卡片 ${index + 1}`)
}}
        >
{index + 1}
        </div>
    </Swiper.Item>
));

const grids = colors.map((color) => (<Grid.Item style={{ textAlign: 'center' }} key={color}>
    <Space direction='vertical'>
        <Image src={demoSrc} width={64}
height={64}
fit='cover'
style={{ borderRadius: 4, background: color }} />
        <div style={{
border: 'solid 1px #999999',
background: '#f5f5f5',
textAlign: 'center',
color: '#999999',
height: '100%'
        }}>{color}</div>
    </Space>

</Grid.Item>
))

const Hello = () => {
    return (
        <>
<Swiper>{items}</Swiper>
<Space></Space>
<Grid columns={3} gap={8}>
    {grids}
</Grid>
<List header='用户列表'>
    {users.map(user => (
        <List.Item
key={user.name}
prefix={
    <Image
        src={user.avatar}
        style={{ borderRadius: 20 }}
        fit='cover'
        width={40}
        height={40}
    />
}
description={user.description}
        >
{user.name}
        </List.Item>
    ))}
</List>
        </>);
};

export default Hello;
