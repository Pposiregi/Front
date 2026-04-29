import { parseGpsDateTime } from '../src/utils/dateUtil';

describe('parseGpsDateTime', () => {
  it('treats timezone-less GPS ISO date-times as UTC', () => {
    const date = parseGpsDateTime('2026-04-26T11:07:30.000');

    expect(date.toISOString()).toBe('2026-04-26T11:07:30.000Z');
  });

  it('keeps explicit timezone offsets unchanged', () => {
    const date = parseGpsDateTime('2026-04-26T20:07:30+09:00');

    expect(date.toISOString()).toBe('2026-04-26T11:07:30.000Z');
  });
});
