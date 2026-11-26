const { diffData } = require('../index.common');

describe('diffData with falsy previous values', () => {
  test('previous 0 does not count as a missing value (issue #120)', () => {
    // 之前用 if (!previous) 判断「没有旧值」，
    // 0 / false / '' / null 这些合法旧值都会被误判成首次赋值，
    // 于是直接返回整个 current 而不是空 patch。
    expect(diffData(0, 0)).toStrictEqual({});
    expect(diffData(false, false)).toStrictEqual({});
    expect(diffData('', '')).toStrictEqual({});
  });

  test('falsy previous values inside objects compare element by element', () => {
    expect(diffData({ a: 0 }, { a: 0 })).toStrictEqual({});
    expect(diffData({ a: false }, { a: false })).toStrictEqual({});
    expect(diffData({ a: '' }, { a: '' })).toStrictEqual({});
    // 对象里的 null 走元素比较，与顶层 null 语义不同
    expect(diffData({ a: null }, { a: null })).toStrictEqual({});
  });

  test('falsy previous values inside arrays compare element by element', () => {
    expect(diffData([0, false, '', null], [0, false, '', null])).toStrictEqual({});
  });

  test('null and undefined keep the first-assignment semantics', () => {
    // previous 为 null / undefined 表示「没有旧值」，返回整个 current
    expect(diffData(0, undefined)).toBe(0);
    expect(diffData({ a: 1 }, undefined)).toStrictEqual({ a: 1 });
    expect(diffData(0, null)).toBe(0);
  });

  test('real changes are still reported', () => {
    expect(diffData(false, 0)).toStrictEqual({ '': false });
    expect(diffData(1, 0)).toStrictEqual({ '': 1 });
    expect(diffData({ a: 1 }, { a: 0 })).toStrictEqual({ a: 1 });
  });
});
