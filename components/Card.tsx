import { styled } from '@pigment-css/react';

import { Owner } from '../types';

const CardDiv = styled('div')<{ owner: Owner; isDragging: boolean }>({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100px',
    width: '100px',
    border: 'dashed',
    variants: [
        { props: { owner: 'red' }, style: { backgroundColor: 'red' } },
        { props: { owner: 'blue' }, style: { backgroundColor: 'blue' } },
        { props: { isDragging: true }, style: { opacity: '50%' } },
    ],
});

const Bottom = styled('div')({ height: '33%' });

const Middle = styled('div')({ height: '34%' });

const Top = styled('div')({ height: '33%' });

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

function getCardStats(id: number): Stats {
    const top = 0;
    const right = 0;
    const bottom = 0;
    const left = 0;
    const type = 'none';

    return { top, right, bottom, left, type };
}

export default function Card({ className, owner, isDragging, id }: Props) {
    const stats = getCardStats(id);

    return (
        <CardDiv className={className} owner={owner} isDragging={isDragging}>
            <Top>{stats.top}</Top>
            <Middle>
                {stats.left} {owner}-{id} {stats.bottom}
            </Middle>
            <Bottom>{stats.bottom}</Bottom>
        </CardDiv>
    );
}
