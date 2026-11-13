import type { Mode } from '../types';
import { advance, createRun, result, type BookOrderState } from './state';
import { render } from './render';
import { SPEED_CURVE } from './rules';
import { MODE_BOARDS } from './routes';

export const BOOK_ORDER: Mode<BookOrderState> = {
  id: 'book-order',
  boards: MODE_BOARDS,
  // The Rules own the number; the shell only records what the Mode reports.
  curve: SPEED_CURVE,
  createRun,
  advance,
  render,
  result,
};
