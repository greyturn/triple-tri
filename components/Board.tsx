import { css } from '@pigment-css/react';

const testCss = css({ fontSize: '100px' });

export function Board() {
    return <div className={testCss}>Board</div>;
}
