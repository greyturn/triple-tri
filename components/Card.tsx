import { styled } from '@pigment-css/react';

import { Owner } from '../types';

const CardDiv = styled('div')<{ owner: Owner; isDragging: boolean }>({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100px',
    width: '100px',
    border: 'black dashed',
    color: 'white',
    textAlign: 'center',
    variants: [
        { props: { owner: 'red' }, style: { backgroundColor: 'red' } },
        { props: { owner: 'blue' }, style: { backgroundColor: 'blue' } },
        { props: { isDragging: true }, style: { opacity: '50%' } },
    ],
});

const Bottom = styled('div')({ position: 'absolute', fontSize: '20px', left: '45px', top: '70px' });

const Left = styled('div')({ position: 'absolute', fontSize: '20px', left: '10px', top: '35px' });
const Right = styled('div')({ position: 'absolute', fontSize: '20px', left: '80px', top: '35px' });

const Top = styled('div')({ position: 'absolute', fontSize: '20px', top: '5px', left: '45px' });

const Image = styled('img')({
    height: '48px',
    width: '48px',
    objectFit: 'none',
    top: '28px',
    left: '28px',
    position: 'absolute',
});

type Stats = {
    top: number;
    right: number;
    bottom: number;
    left: number;
    type: 'none';
};

export interface CardType {
    owner: Owner;
    id: number;
}

interface Props extends CardType {
    className?: string;
    isDragging: boolean;
}

export function getCardStats(_id: number): Stats {
    const top = 0;
    const right = 1;
    const bottom = 2;
    const left = 3;
    const type = 'none';

    return { top, right, bottom, left, type };
}

export default function Card({ className, owner, isDragging, id }: Props) {
    const stats = getCardStats(id);
    const spriteSrc = '/static/sprites/bulbasaur.png';

    return (
        <CardDiv className={className} owner={owner} isDragging={isDragging}>
            <Image src={spriteSrc} />
            <Top>{stats.top}</Top>
            <div>
                <Right>{stats.right}</Right>
                <Left>{stats.left}</Left>
            </div>
            <Bottom>{stats.bottom}</Bottom>
        </CardDiv>
    );
}
