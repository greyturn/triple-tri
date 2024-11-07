'use client';

import { css } from '@pigment-css/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Game from '../components/Game';

export default function Page() {
    return (
        <div>
            <main>
                <div className={css({ fontSize: '30px' })}>Triple Tri</div>
                <DndProvider backend={HTML5Backend}>
                    <Game />
                </DndProvider>
            </main>
            <footer></footer>
        </div>
    );
}
