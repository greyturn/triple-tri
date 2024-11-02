'use client';

import { useDrag } from 'react-dnd';

import Card, { CardType } from './Card';

import { ItemTypes } from '../constants';

import useLogger from '../hooks/useLogger';

import { Owner } from '../types';

export interface PlayCardType {
    id: number;
    isPlayable?: boolean;
    isPlayed?: boolean;
    isDraggable: boolean;
    owner: Owner;
    cardID: number;
}

interface Props extends PlayCardType {
    className?: string;
    card: PlayCardType;
}

export default function PlayCard({ className, owner, isDraggable, isPlayed = false, isPlayable = true, id, cardID, card }: Props) {
    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.CARD,
            item: { card, owner },
            canDrag: isDraggable,
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [isDraggable, id, owner]
    );

    const { logger } = useLogger();

    return (
        <div
            className={className}
            ref={dragRef}
        >
            <Card isDragging={isDragging} owner={owner} id={cardID}/>
        </div>
    );
}
