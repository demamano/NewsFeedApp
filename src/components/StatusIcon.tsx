import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../theme/theme';

type Glyph =
  | 'bookmark-outline'
  | 'bookmark-filled'
  | 'share'
  | 'link'
  | 'search'
  | 'close'
  | 'sort'
  | 'chevron'
  | 'warning'
  | 'empty'
  | 'check'
  | 'delete'
  | 'offline';

const GLYPHS: Record<Glyph, string> = {
  'bookmark-outline': '☆',
  'bookmark-filled': '★',
  share: '⮡',
  link: '\u{1F517}',
  search: '\u{1F50D}',
  close: '✕',
  sort: '⇵',
  chevron: '›',
  warning: '⚠',
  empty: '\u{1F4ED}',
  check: '✓',
  delete: '\u{1F5D1}',
  offline: '⚡',
};

interface Props {
  glyph: Glyph;
  color?: string;
  size?: number;
  style?: TextStyle;
}

export function StatusIcon({ glyph, color = colors.text, size = 18, style }: Props) {
  return (
    <Text
      allowFontScaling={false}
      style={[{ color, fontSize: size, lineHeight: size + 2 }, style]}>
      {GLYPHS[glyph]}
    </Text>
  );
}
