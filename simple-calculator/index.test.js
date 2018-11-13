const { transformExpression, calculate } = require('./index');
const test = require('ava').test;

test('transform + -', t => {
    const code = '2 + 3 - 1'
    const right = transformExpression(code);
    t.deepEqual(right, [
        '2',
        '3',
        '+',
        '1',
        '-'
    ])
})

test('transform * /', t => {
  const code = '2 + 3 * 1 / 2'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '2',
      '3',
      '1',
      '*',
      '2',
      '/',
      '+',
  ])
})

test('transform * / ( )', t => {
  const code = '(2 + 3) * 1 / (2 - 1)'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '2',
      '3',
      '+',
      '1',
      '*',
      '2',
      '1',
      '-',
      '/'
  ])
})

test('transform negative number 1', t => {
  const code = '(-3) - (+4)'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '-3',
      '4',
      '-',
  ])
})
test('transform negative number 2', t => {
  const code = '3 + (-4)'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '3',
      '+',
      '4',
      '-',
  ])
})

test('transform decimal number', t => {
  const code = '0.1 + 0.2'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '0.1',
      '0.2',
      '+',
  ])
})

test('test BracketsReg', t => {
  const code = '(-3) - (+4) * ( 3 - 5 * 4)'
  const right = transformExpression(code);
  t.deepEqual(right, [
      '-3',
      '4',
      '3',
      '5',
      '4',
      '*',
      '-',
      '*',
      '-',
  ])
})

test('calculate + -', t => {
  const code = '1 + 2 - 1'
  const right = transformExpression(code);
  const result = calculate(right);
  t.is(result, 2)
})

test('calculate / *', t => {
  const code = '1 + 2 - 4 * 3 / 3'
  const right = transformExpression(code);
  const result = calculate(right);
  t.is(result, -1)
})

test('calculate with BracketsReg', t => {
  const code = '(+1) + (10 - 4) * 3 / 2 + (-1)'
  const right = transformExpression(code);
  const result = calculate(right);
  t.is(result, 9)
})

test('calculate Decimal', t => {
  const code = '0.1 + 0.2'
  const right = transformExpression(code);
  const result = calculate(right);
  t.is(result, 0.3)
})