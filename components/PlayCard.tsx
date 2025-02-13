'use client';

import { useDrag } from 'react-dnd';

import Card, { CardInfo } from './Card';

import { ItemTypes } from '../constants';

import { Owner } from '../types';

export interface PlayCardType {
    id: number;
    isPlayable?: boolean;
    isPlayed?: boolean;
    isDraggable: boolean;
    owner: Owner;
    info: CardInfo;
}

interface Props extends PlayCardType {
    className?: string;
    card: PlayCardType;
}

export default function PlayCard({ className, owner, isDraggable, card }: Props) {
    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.CARD,
            item: { card, owner },
            canDrag: isDraggable,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [isDraggable, card, owner]
    );

    return (
        // @ts-expect-error - The typing of ConnectDragSource is incorrect
        <div className={className} ref={dragRef}>
            <Card isDragging={isDragging} owner={owner} info={card.info} />
        </div>
    );
}
