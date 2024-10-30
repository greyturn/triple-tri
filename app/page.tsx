import { css } from '@pigment-css/react';
import { Board } from '../components/Board';
import { Card } from '../components/Card';
import { Hand } from '../components/Hand';

export default function Page() {
    return (
        <div>
            <main>
                <div className={css({ fontSize: '30px' })}>Triple Tri</div>
                <Card owner='red' />
                <Hand owner='red' />
                <Board />
            </main>
            <footer></footer>
        </div>
    );
}
