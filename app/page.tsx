'use client';

import { styled } from '@pigment-css/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Game from '../components/Game';

const Title = styled('h1')({ fontSize: '30px' });

export default function Page() {
    const currentYear = new Date().getFullYear();

    return (
        <div>
            <main>
                <Title>Triple Tri</Title>
                <DndProvider backend={HTML5Backend}>
                    <Game />
                </DndProvider>
            </main>
            <footer>Pokémon images & names © 1995-{currentYear} Nintendo/Game Freak.</footer>
        </div>
    );
}
