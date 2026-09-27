import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StatCount from './StatCount';

/**
 * `StatCount` 는 페이지를 그린 뒤 API 로 받는 조회수와 좋아요 수를 보여 준다.
 *
 * 받지 못한 경우를 따로 그리지 않으면 skeleton 이 영영 남는다. 화면은 멀쩡해 보여서 조용히 실패한다.
 * `undefined`(받는 중), `null`(받지 못함), 숫자 세 상태가 서로 다르게 보여야 한다.
 */

describe('StatCount 는 받는 중, 받지 못함, 받은 값을 다르게 보여 준다', () => {
  it('받는 중이면 숫자 없이 불러오는 중 상태를 알린다', () => {
    render(<StatCount value={undefined} label="조회수" />);
    expect(screen.getByRole('status', { name: '조회수 불러오는 중' })).toBeInTheDocument();
  });

  it('받지 못하면 skeleton 대신 – 를 보여 준다', () => {
    render(<StatCount value={null} label="조회수" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('조회수를 불러오지 못했습니다')).toHaveTextContent('–');
  });

  it.each([0, 20272])('받은 값 %i 를 그대로 보여 준다', (value) => {
    render(<StatCount value={value} label="조회수" />);
    expect(screen.getByLabelText(`조회수 ${value}`)).toHaveTextContent(String(value));
  });
});
