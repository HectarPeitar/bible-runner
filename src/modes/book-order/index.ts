import type { Mode } from '../types';
import { advance, createRun, result, type BookOrderState } from './state';
import { render } from './render';
import { MODE_BOARDS } from './routes';

export const BOOK_ORDER: Mode<BookOrderState> = {
  id: 'book-order',
  boards: MODE_BOARDS,
  createRun,
  advance,
  render,
  result,
};
