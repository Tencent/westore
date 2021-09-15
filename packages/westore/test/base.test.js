const { diffData } = require('../index.common');


test('same props', () => {
  expect(diffData(
    { a: 1 },
    { a: 1 }
  )).toStrictEqual({

  })
})

test('update props', () => {
  expect(diffData(
    { a: 1 },
    { a: 2 }
  )).toStrictEqual({
    a: 1
  })
})

test('delete props', () => {
  expect(diffData(
    { a: 1 },
    { a: 1, b: 2 }
  )).toStrictEqual({
    b: null
  })
})

test('add props', () => {
  expect(diffData(
    { a: 1, b: 2 },
    { a: 1 }
  )).toStrictEqual({
    b: 2
  })
})


test('update deep props', () => {
  expect(diffData(
    { user: { name: 'dnt', age: 18 } },
    { user: { name: 'dnt', age: 20 } },
  )).toStrictEqual({
    'user.age': 18
  })
})

test('update deep props', () => {
  expect(diffData(
    { user: { name: 'dnt2', age: 18 } },
    { user: { name: 'dnt', age: 20 } },
  )).toStrictEqual({
    'user.age': 18,
    'user.name': 'dnt2'
  })
})

test('add deep props', () => {
  expect(diffData(
    { user: { name: 'dnt', age: 18 } },
    { user: { name: 'dnt', } },
  )).toStrictEqual({
    'user.age': 18
  })
})

test('add deep props', () => {
  expect(diffData(
    { user: { name: 'dnt', age: 18, sex: 1 } },
    { user: { name: 'dnt', } },
  )).toStrictEqual({
    'user.age': 18,
    'user.sex': 1
  })
})


test('delete deep props', () => {
  expect(diffData(
    { user: { name: 'dnt' } },
    { user: { name: 'dnt', age: 18, sex: 1 } },
  )).toStrictEqual({
    'user.age': null,
    'user.sex': null
  })
})

