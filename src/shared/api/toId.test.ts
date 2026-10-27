import { toId } from './toId';

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
