import type { Mode } from '../types';
import { advance, createRun, result, type BookOrderState } from './state';
import { render } from './render';

export const BOOK_ORDER: Mode<BookOrderState> = {
  id: 'book-order',
  createRun,
  advance,
  render,
  result,
};
