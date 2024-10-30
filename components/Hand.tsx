'use client';

import { styled } from '@pigment-css/react';
import { useState } from 'react';
import { Card } from './Card';

const HandGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gridGap: '10px',
    padding: '10px',
});

function testHand(owner: 'red' | 'blue') {
    const card = { owner };
    const newHand = new Array(5).fill(card);
    return newHand;
}

interface Props {
    className?: string;
    owner: 'red' | 'blue';
}

export function Hand({ className, owner }: Props) {
    const [hand, setHand] = useState(testHand('red'));

    return (
        <div>
            Hand: {owner}
            <HandGrid>
                {hand.map((card) => {
                    return <Card key={card.owner} owner={card.owner} />;
                })}
            </HandGrid>
        </div>
    );
}
