import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Badge from './Badge';

describe('Badge', () => {
  it('받은 글자를 그린다', () => {
    render(<Badge>react</Badge>);

    expect(screen.getByText('react')).toBeInTheDocument();
  });

  it('span 으로 그린다. 글 안에 끼워 넣는 용도다', () => {
    render(<Badge>react</Badge>);

    expect(screen.getByText('react').tagName).toBe('SPAN');
  });

  it('줄바꿈을 막는다', () => {
    render(<Badge>긴 태그 이름</Badge>);

    expect(screen.getByText('긴 태그 이름')).toHaveClass('whitespace-nowrap');
  });

  it('다크모드 클래스를 함께 들고 있다', () => {
    render(<Badge>react</Badge>);

    const badge = screen.getByText('react');

    expect(badge.className).toMatch(/dark:text-/);
    expect(badge.className).toMatch(/dark:bg-/);
  });
});
