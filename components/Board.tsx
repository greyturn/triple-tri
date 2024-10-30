'use client';

import { css, styled } from '@pigment-css/react';
import { useState } from 'react';

import { Tile } from './Tile';

function resetBoard() {
    const emptyTile: BoardTile = { owner: 'none' };
    const newBoard: BoardTile[] = new Array(9).fill(emptyTile);
    return newBoard;
}

const testCss = css({ fontSize: '24px' });

const BoardDiv = styled('div')({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: '600px' });

type BoardTile = {
    owner: 'red' | 'blue' | 'none';
};

interface Props {
    className?: string;
}

export function Board({ className }: Props) {
    const [board, setBoard] = useState<BoardTile[]>(resetBoard());

    return (
        <div className={testCss}>
            <h2>Board</h2>
            <BoardDiv>
                {board.map((tile) => {
                    return (
                        <Tile key={`${tile.owner}`} owner='none'>
                            {tile.owner}
                        </Tile>
                    );
                })}
            </BoardDiv>
        </div>
    );
}
