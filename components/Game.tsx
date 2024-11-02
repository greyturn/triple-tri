'use client';

import { css } from '@pigment-css/react';
import { useState } from 'react';

import { Board } from './Board';
import { Hand } from './Hand';
import { TileType } from './Tile';
import { PlayCardType } from './PlayCard';

import { Owner } from '../types';
import useLogger from '../hooks/useLogger';

function testHand(owner: Owner) {
    const newHand = [];

    for (let i = 0; i < 5; i++) {
        const card: PlayCardType = { id: i, owner, isDraggable: true, cardID: i + 100 }; // TODO: create a file of starter cards
        newHand.push(card);
    }

    return newHand;
}

export default function Game() {
    const [board, setBoard] = useState<TileType[]>(resetBoard());
    const [blueHand, setBlueHand] = useState<PlayCardType[]>(testHand('blue'));
    const [redHand, setRedHand] = useState<PlayCardType[]>(testHand('red'));
    const [playedCards, setPlayedCards] = useState<{ blue: PlayCardType[]; red: PlayCardType[] }>({
        blue: [],
        red: [],
    });
    const [turn, setTurn] = useState(0);

    const { log, logger } = useLogger();

    function playCardFromHand(owner: Owner, card: PlayCardType) {
        if (owner === 'red' || owner === 'blue') {
            logger(`Playing card ${card.id} for ${owner}`);

            let newCards = { ...playedCards };
            newCards[owner].push(card);
            setPlayedCards(newCards);

            if (owner === 'red') {
                const filteredHand = redHand.filter((redCard) => redCard.id !== card.id);
                setRedHand([...filteredHand]);
            } else if (owner === 'blue') {
                const filteredHand = blueHand.filter((blueCard) => blueCard.id !== card.id);
                setBlueHand([...filteredHand]);
            }
        }
    }

    function playCard(card: PlayCardType, owner: Owner, tileIndex: number) {
        playCardFromHand(owner, card);

        let newBoard = board.map((tile) => ({ ...tile }));
        newBoard[tileIndex] = { owner, playCard, tileIndex, card };

        setBoard(newBoard);
    }

    function resetBoard() {
        const newBoard: TileType[] = [];

        for (let i = 0; i < 9; i++) {
            newBoard.push({ playCard, owner: 'none', tileIndex: i });
        }

        return newBoard;
    }

    return (
        <div>
            <div>Turn: {turn}</div>
            <Hand hand={redHand} owner='red' />
            <Board className={css({ margin: '5px' })} board={board} playCard={playCard} />
            <Hand hand={blueHand} owner='blue' />
            <div>
                LOG
                <ul>
                    {log.map((line) => {
                        return <li>{line}</li>;
                    })}
                </ul>
            </div>
        </div>
    );
}
