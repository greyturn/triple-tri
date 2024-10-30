import { styled } from '@pigment-css/react';

const CardDiv = styled('div')<Props>({
    height: '40px',
    width: '40px',
    border: 'dashed',
    variants: [
        { props: { owner: 'red' }, style: { backgroundColor: 'red' } },
        { props: { owner: 'blue' }, style: { backgroundColor: 'blue' } },
    ],
});

interface Props {
    className?: string;
    owner: 'red' | 'blue';
}

export function Card({ className, owner }: Props) {
    return (
        <div>
            <CardDiv owner={owner}>{owner}</CardDiv>
        </div>
    );
}
