/**
 * `Title` 은 목록 페이지의 머리글이다. 제목은 `h1`, 부제는 `h2` 로 그린다.
 *
 * 문서에 `h1` 이 하나뿐인지가 검색 노출에 걸려 있어서 태그 수준을 고정해 둔다.
 * 부제가 없을 때 빈 `h2` 를 그리지 않는 것도 함께 본다.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Title from './index';

describe('Title', () => {
  it('제목을 h1 으로 그린다', () => {
    render(<Title title="Post" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Post' })).toBeInTheDocument();
  });

  it('부제를 h2 로 그린다', () => {
    render(<Title title="Post" subtitle="문제를 해결하며 얻은 경험들" />);

    expect(
      screen.getByRole('heading', { level: 2, name: '문제를 해결하며 얻은 경험들' }),
    ).toBeInTheDocument();
  });

  it('부제가 없으면 h2 를 아예 그리지 않는다', () => {
    render(<Title title="Post" />);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('부제가 빈 문자열이어도 h2 를 그리지 않는다', () => {
    render(<Title title="Post" subtitle="" />);

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('h1 은 문서에 하나만 둔다', () => {
    render(<Title title="Post" subtitle="부제" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
