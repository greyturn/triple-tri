import { styled } from '@pigment-css/react';
import { ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    owner: 'red' | 'blue' | 'none';
}

const TileDiv = styled('div')<Props>({
    padding: '5px',
    border: 'solid',
    minHeight: '40px',
    minWidth: '40px',
    variants: [
        { props: { owner: 'red' }, style: { backgroundColor: 'pink' } },
        { props: { owner: 'blue' }, style: { backgroundColor: 'lightblue' } },
        { props: { owner: 'none' }, style: { backgroundColor: 'lightgrey' } },
    ],
});

export function Tile({ children, owner }: Props) {
    return <TileDiv owner={owner}>{children}</TileDiv>;
}
