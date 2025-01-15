import { styled } from '@pigment-css/react';
import { useDrop } from 'react-dnd';

import PlayCard, { PlayCardType } from './PlayCard';

import { Owner } from '../types';
import { ItemTypes } from '../constants';

const TileDiv = styled('div')<{ owner: Owner; isOver: boolean }>({
    padding: '5px',
    border: 'solid',
    minHeight: '150px',
    minWidth: '150px',
    variants: [
        { props: { owner: 'red' }, style: { backgroundColor: 'pink' } },
        { props: { owner: 'blue' }, style: { backgroundColor: 'lightblue' } },
        { props: { owner: 'none' }, style: { backgroundColor: 'lightgrey' } },
        { props: { isOver: true }, style: { backgroundColor: 'lightYellow' } },
    ],
});

export interface TileType {
    owner: Owner;
    playCard: (card: PlayCardType, owner: Owner, tileIndex: number) => void;
    tileIndex: number;
    card?: PlayCardType;
}

interface Props extends TileType {
    className?: string;
}

export default function Tile({ tileIndex, card, owner, playCard }: Props) {
    function isEmpty() {
        return !card;
    }

    const [{ isOver }, dropRef] = useDrop(
        () => ({
            accept: ItemTypes.CARD,
            drop: (item: { card: PlayCardType; owner: Owner }) => playCard(item.card, item.owner, tileIndex),
            canDrop: () => isEmpty(),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }),
        [tileIndex, card, owner, playCard]
    );

    return (
        // @ts-expect-error - The typing of ConnectDropTarget is incorrect
        <TileDiv owner={owner} isOver={isOver} ref={dropRef}>
            {tileIndex}
            {card && <PlayCard owner={owner} isDraggable={false} id={card.id} isPlayed card={card} info={card.info} />}
        </TileDiv>
    );
}
