'use client';

import { css, styled } from '@pigment-css/react';
import { useEffect, useState } from 'react';

import { Board } from './Board';
import { Hand } from './Hand';
import { TileType } from './Tile';
import { PlayCardType } from './PlayCard';

import { CardDB, Owner } from '../types';
import useLogger from '../hooks/useLogger';
import ChooseCardDb from './ChooseCardDb';

const PlayArea = styled('div')({ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' });

const Log = styled('div')({
    maxWidth: '750px',
    ['ul']: { backgroundColor: 'lightGrey', overflow: 'scroll', maxHeight: '200px' },
});

function testHand(owner: Owner) {
    const newHand = [];

    for (let i = 0; i < 5; i++) {
        const card: PlayCardType = {
            id: i,
            owner,
            isDraggable: true,
            info: { top: 0, right: 1, bottom: 2, left: 3, type: 'none', id: (i + 10).toString() },
        }; // TODO: create a file of starter cards
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
    const [currentPlayer] = useState('red');
    const [useAi, _setUseAi] = useState(true);
    const [winner, setWinner] = useState<Owner>('none');
    const [cardDb, setCardDb] = useState('cardDB');

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
                  Top: ${board[playedCard].card.info.top.toString()}, 
                  Right: ${board[playedCard].card.info.right.toString()}, 
                  Bottom: ${board[playedCard].card.info.bottom.toString()}, 
                  Left: ${board[playedCard].card.info.left.toString()}
                }`
            );
            logMessage(
                `Compared Card: {
                  Top: ${board[playedCard].card.info.top.toString()}, 
                  Right: ${board[playedCard].card.info.right.toString()}, 
                  Bottom: ${board[playedCard].card.info.bottom.toString()}, 
                  Left: ${board[playedCard].card.info.left.toString()}
                }`
            );

            if (comparison === 'top' && board[playedCard].card.info.bottom < board[playedCard].card.info.top) {
                logMessage('Compared top');
                return true;
            } else if (comparison === 'right' && board[playedCard].card.info.left < board[playedCard].card.info.right) {
                logMessage('Compared right');
                return true;
            } else if (
                comparison === 'bottom' &&
                board[playedCard].card.info.top < board[playedCard].card.info.bottom
            ) {
                logMessage('Comparing bottom');
                return true;
            } else if (comparison === 'left' && board[playedCard].card.info.right < board[playedCard].card.info.left) {
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

    function createHand(owner: Owner, cardDb: CardDB) {
        logMessage(`Creating hand for ${owner}`);
        const newHand: PlayCardType[] = [];

        for (let i = 0; i < 5; i++) {
            const card: PlayCardType = { id: i, owner, isDraggable: true, info: cardDb.cards[i] };
            newHand.push(card);
        }

        return newHand;
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

    useEffect(() => {
        async function fetchCardDb() {
            const response = await fetch(`/api/carddb/${cardDb}`);
            const data: CardDB = await response.json();

            if (data) {
                setRedHand(createHand('red', data));
                setBlueHand(createHand('blue', data));
            }
        }

        fetchCardDb();
    }, [cardDb]);

    return (
        <div>
            <ChooseCardDb setCardDb={setCardDb} cardDb={cardDb} />
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
