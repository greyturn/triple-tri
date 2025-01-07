'use client';

import { styled } from '@pigment-css/react';

import PlayCard, { PlayCardType } from './PlayCard';

const HandGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    gridGap: '10px',
    padding: '10px',
});

interface Props {
    className?: string;
    owner: 'red' | 'blue';
    hand: PlayCardType[];
}

export function Hand({ className, hand, owner }: Props) {
    return (
        <div className={className}>
            Hand: {owner}
            <HandGrid>
                {hand.map((card, i) => {
                    return (
                        <PlayCard
                            key={`card-${i}`}
                            owner={card.owner}
                            id={card.id}
                            isDraggable
                            card={card}
                            info={card.info}
                        />
                    );
                })}
            </HandGrid>
        </div>
    );
}
