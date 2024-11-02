'use client';

import { styled } from '@pigment-css/react';

import { PlayCardType } from './PlayCard';
import Tile, { TileType } from './Tile';

import { Owner } from '../types';
import useLogger from '../hooks/useLogger';

const BoardDiv = styled('div')({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '450px' });

interface Props {
    className?: string;
    board: TileType[];
    playCard: (card: PlayCardType, owner: Owner, tileIndex: number) => void;
}

export function Board({ className, board, playCard }: Props) {
    const { logger } = useLogger();

    return (
        <div className={className}>
            <h2>Board</h2>

            <BoardDiv>
                {board.map((tile, i) => {
                    return (
                        <Tile key={`tile-${i}`} tileIndex={i} owner={tile.owner} playCard={playCard} card={tile.card} />
                    );
                })}
            </BoardDiv>
        </div>
    );
}
