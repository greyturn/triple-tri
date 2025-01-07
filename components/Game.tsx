'use client';

import { css, styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { Board } from './Board';
import { Hand } from './Hand';
import { TileType } from './Tile';
import { PlayCardType } from './PlayCard';

import { Owner } from '../types';
import useLogger from '../hooks/useLogger';
import { getCardStats } from './Card';

const PlayArea = styled('div')({ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' });

const Log = styled('div')({
    maxWidth: '750px',
    ['ul']: { backgroundColor: 'lightGrey', overflow: 'scroll', maxHeight: '200px' },
});

function testHand(owner: Owner) {
    const newHand = [];

    for (let i = 0; i < 5; i++) {
        const card: PlayCardType = { id: i, owner, isDraggable: true, cardID: i + 10 }; // TODO: create a file of starter cards
        newHand.push(card);
    }

    return newHand;
}

function createHand(owner: Owner, cardDb: string) {
    const newHand = [];
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
    const [currentPlayer, setCurrentPlayer] = useState('red');
    const [useAi, _setUseAi] = useState(true);
    const [winner, setWinner] = useState<Owner>('none');
    const [cardDb, setCardDb] = useState('');

    const { log, logMessage } = useLogger();

    function playCardFromHand(owner: Owner, card: PlayCardType) {
        if (owner === 'red' || owner === 'blue') {
            logMessage(`Playing card ${card.id} for ${owner}`);

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
            logMessage(
                `Played Card: {
                  Top: ${getCardStats(board[playedCard].card.id).top.toString()}, 
                  Right: ${getCardStats(board[playedCard].card.id).right.toString()}, 
                  Bottom: ${getCardStats(board[playedCard].card.id).bottom.toString()}, 
                  Left: ${getCardStats(board[playedCard].card.id).left.toString()}
                }`
            );
            logMessage(
                `Compared Card: {
                  Top: ${getCardStats(board[compareCard].card.id).top.toString()}, 
                  Right: ${getCardStats(board[compareCard].card.id).right.toString()}, 
                  Bottom: ${getCardStats(board[compareCard].card.id).bottom.toString()}, 
                  Left: ${getCardStats(board[compareCard].card.id).left.toString()}
                }`
            );

            if (
                comparison === 'top' &&
                getCardStats(board[compareCard].card.id).bottom < getCardStats(board[playedCard].card.id).top
            ) {
                logMessage('Compared top');
                return true;
            } else if (
                comparison === 'right' &&
                getCardStats(board[compareCard].card.id).left < getCardStats(board[playedCard].card.id).right
            ) {
                logMessage('Compared right');
                return true;
            } else if (
                comparison === 'bottom' &&
                getCardStats(board[compareCard].card.id).top < getCardStats(board[playedCard].card.id).bottom
            ) {
                logMessage('Comparing bottom');
                return true;
            } else if (
                comparison === 'left' &&
                getCardStats(board[compareCard].card.id).right < getCardStats(board[playedCard].card.id).left
            ) {
                logMessage('Compared left');
                return true;
            } else {
                logMessage('No Flip');
                return false;
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
            newTile.card.owner = 'red';
        }

        return newTile;
    }

    function flipCards(board: TileType[], tileIndex: number) {
        const newBoard = board;
        const top = tileIndex - 3;
        const bottom = tileIndex + 3;
        const right = tileIndex + 1;
        const left = tileIndex - 1;

        logMessage(`top ${top}`);
        logMessage(`bottom ${bottom}`);
        logMessage(`right ${right}`);
        logMessage(`left ${left}`);

        if (top >= 0) {
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

    function getWinner(board: TileType[]): Owner {
        let winner: Owner = 'none';
        let red = 0;
        let blue = 0;

        for (const tile of board) {
            if (tile.owner === 'blue') {
                blue++;
            } else if (tile.owner === 'red') {
                red++;
            }
        }

        if (red > blue) {
            winner = 'red';
        } else if (blue > red) {
            winner = 'blue';
        }

        return winner;
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

    useEffect(() => {
        if (turn === 9) {
            setWinner(getWinner(board));
        }
    }, [board, turn]);

    return (
        <div>
            <div>
                Turn: {turn} - {currentPlayer.toUpperCase()} is Playing{' '}
                {turn === 9 && winner !== 'none' && <div>{winner} WINS!</div>}
                {turn === 9 && winner === 'none' && <div>TIE GAME</div>}
            </div>
            <PlayArea>
                <Hand hand={redHand} owner='red' />
                <Board className={css({ margin: '5px' })} board={board} playCard={playCard} />
                <Hand hand={blueHand} owner='blue' />
            </PlayArea>

            <Log>
                LOG
                <ul>
                    {log.map((line, i) => {
                        return (
                            <li key={`log-${i}`}>
                                [{line.type}] {line.timestamp} - {line.message}
                            </li>
                        );
                    })}
                </ul>
            </Log>
        </div>
    );
}
