import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { StoryRow } from '../src/features/stories/components/StoryRow';
import { Story } from '../src/api/types';

const fixture: Story = {
  id: 42,
  title: 'A riveting story',
  url: 'https://example.com/article',
  by: 'tester',
  score: 123,
  time: Math.floor(Date.now() / 1000) - 60 * 60,
  domain: 'example.com',
};

describe('<StoryRow />', () => {
  it('renders title, score, and domain', () => {
    render(<StoryRow story={fixture} onPress={jest.fn()} />);
    expect(screen.getByText(fixture.title)).toBeTruthy();
    expect(screen.getByText(`${fixture.score} pts`)).toBeTruthy();
    expect(screen.getByText(fixture.domain)).toBeTruthy();
  });

  it('invokes onPress with the story when tapped', () => {
    const onPress = jest.fn();
    render(<StoryRow story={fixture} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledWith(fixture);
  });
});
