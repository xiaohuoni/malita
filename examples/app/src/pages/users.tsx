import React from 'react';
import { IndexBar, List } from 'antd-mobile';
import { LoremIpsum } from 'lorem-ipsum'
import "./users.css";

export const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4,
    },
    wordsPerSentence: {
        max: 16,
        min: 4,
    },
})

const getRandomList = (min: number, max: number): string[] => {
    return new Array(Math.floor(Math.random() * (max - min) + min)).fill('')
}

const charCodeOfA = 'A'.charCodeAt(0)
const groups = Array(26)
    .fill('')
    .map((_, i) => ({
        title: String.fromCharCode(charCodeOfA + i),
        items: getRandomList(3, 10).map(() => lorem.generateWords(2)),
    }));

const Users = () => {
    return (
        <>
            <IndexBar>
                {groups.map(group => {
                    const { title, items } = group
                    return (
                        <IndexBar.Panel
                            index={title}
                            title={`标题${title}`}
                            key={`标题${title}`}
                        >
                            <List>
                                {items.map((item, index) => (
                                    <List.Item key={index}>{item}</List.Item>
                                ))}
                            </List>
                        </IndexBar.Panel>
                    )
                })}
            </IndexBar>
        </>);
};
export default Users;