import { toCount, toId } from './toId';

describe('toCount', () => {
  it.each<[unknown, number]>([
    ['52', 52],
    [52, 52],
    [undefined, 0],
    ['abc', 0],
  ])('%j → %j', (value, expected) => {
    expect(toCount(value)).toBe(expected);
  });
});

describe('toId', () => {
  it.each<[unknown, number | null]>([
    ['6', 6],
    [6, 6],
    ['', null],
    ['abc', null],
    ['1.5', null],
    [undefined, null],
    [null, null],
  ])('%j → %j', (value, expected) => {
    expect(toId(value)).toBe(expected);
  });
});
