'use client';

import { css } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { Board } from './Board';
import { Hand } from './Hand';
import { TileType } from './Tile';
import { PlayCardType } from './PlayCard';

import { Owner } from '../types';
import useLogger from '../hooks/useLogger';
import { getCardStats } from './Card';

function testHand(owner: Owner) {
    const newHand = [];

    for (let i = 0; i < 5; i++) {
        const card: PlayCardType = { id: i, owner, isDraggable: true, cardID: i + 10 }; // TODO: create a file of starter cards
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
    const [useAi, _setUseAi] = useState(true);

    const { log, logger } = useLogger();

    function playCardFromHand(owner: Owner, card: PlayCardType) {
        if (owner === 'red' || owner === 'blue') {
            logger(`Playing card ${card.id} for ${owner}`);

            const newCards = { ...playedCards };
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

    function checkForFlip(
        board: TileType[],
        playedCard: number,
        compareCard: number,
        comparison: 'top' | 'bottom' | 'left' | 'right'
    ) {
        if (board[compareCard].card && board[playedCard].card) {
            if (
                comparison === 'top' &&
                getCardStats(board[compareCard].card.id).bottom < getCardStats(board[playedCard].card.id).top
            ) {
                return true;
            }
            if (
                comparison === 'right' &&
                getCardStats(board[compareCard].card.id).left < getCardStats(board[playedCard].card.id).right
            ) {
                return true;
            }
            if (
                comparison === 'bottom' &&
                getCardStats(board[compareCard].card.id).top < getCardStats(board[playedCard].card.id).bottom
            ) {
                return true;
            }
            if (
                comparison === 'left' &&
                getCardStats(board[compareCard].card.id).right < getCardStats(board[playedCard].card.id).left
            ) {
                return true;
            }
        }

        return false;
    }

    function flipOwner(tile: TileType) {
        const newTile = tile;
        if (newTile.owner === 'red' && newTile.card) {
            newTile.owner = 'blue';
            newTile.card.owner = 'blue';
        } else if (newTile.owner === 'blue' && newTile.card) {
            newTile.owner = 'red';
            newTile.card.owner = 'blue';
        }

        return newTile;
    }

    function flipCards(board: TileType[], tileIndex: number) {
        const newBoard = board;
        const top = tileIndex - 3;
        const bottom = tileIndex + 3;
        const right = tileIndex + 1;
        const left = tileIndex - 1;

        logger(`top ${top}`);
        logger(`bottom ${bottom}`);
        logger(`right ${right}`);
        logger(`left ${left}`);

        if (top > 0) {
            if (checkForFlip(board, tileIndex, top, 'top')) {
                const newTile = flipOwner(board[top]);
                newBoard[top] = newTile;
            }
        }

        if (bottom < 9) {
            if (checkForFlip(board, tileIndex, bottom, 'bottom')) {
                const newTile = flipOwner(board[bottom]);
                newBoard[bottom] = newTile;
            }
        }

        if (right % 3 !== 0 && right >= 0 && right < 9) {
            if (checkForFlip(board, tileIndex, right, 'right')) {
                const newTile = flipOwner(board[right]);
                newBoard[right] = newTile;
            }
        }

        if (left % 3 !== 2 && left < 9 && left >= 0) {
            if (checkForFlip(board, tileIndex, left, 'left')) {
                const newTile = flipOwner(board[left]);
                newBoard[left] = newTile;
            }
        }

        return newBoard;
    }

    function playCard(card: PlayCardType, owner: Owner, tileIndex: number) {
        playCardFromHand(owner, card);

        let newBoard = board.map((tile) => ({ ...tile }));
        newBoard[tileIndex] = { owner, playCard, tileIndex, card };

        newBoard = flipCards(newBoard, tileIndex);

        setBoard(newBoard);
        setTurn(turn + 1);
    }

    function resetBoard() {
        const newBoard: TileType[] = [];

        for (let i = 0; i < 9; i++) {
            newBoard.push({ playCard, owner: 'none', tileIndex: i });
        }

        return newBoard;
    }

    /** Brain Dead AI for testing */
    function aiLogic() {
        let tile = 0;
        let noSpace = false;

        for (let i = 0; i < 9; i++) {
            noSpace = true;
            if (board[i].owner === 'none') {
                tile = i;
                noSpace = false;
                break;
            }
        }

        // no available space
        if (noSpace) {
            return;
        }

        playCard(blueHand[0], 'blue', tile);
    }

    useEffect(() => {
        if (useAi) {
            if (turn % 2 === 1) {
                setTimeout(() => {
                    aiLogic();
                }, 2000);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [turn, useAi]);

    return (
        <div>
            <div>Turn: {turn}</div>
            <Hand hand={redHand} owner='red' />
            <Board className={css({ margin: '5px' })} board={board} playCard={playCard} />
            <Hand hand={blueHand} owner='blue' />
            <div>
                LOG
                <ul>
                    {log.map((line, i) => {
                        return <li key={`log-${i}`}>{line}</li>;
                    })}
                </ul>
            </div>
        </div>
    );
}
