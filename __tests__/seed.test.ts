import { db } from '../db/client';
import { categories, habitLogs, habits, targets, users } from '../db/schema';
import { seedIfEmpty } from '../db/seed';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue([]),
    }),
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

describe('seedIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts data into all core tables when database is empty', async () => {
    await seedIfEmpty();

    expect(db.insert).toHaveBeenCalledWith(users);
    expect(db.insert).toHaveBeenCalledWith(categories);
    expect(db.insert).toHaveBeenCalledWith(habits);
    expect(db.insert).toHaveBeenCalledWith(habitLogs);
    expect(db.insert).toHaveBeenCalledWith(targets);
  });

  it('does not insert data if habits already exist', async () => {
    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockReturnValue([{ id: 1, name: 'Existing habit' }]),
    });

    await seedIfEmpty();

    expect(db.insert).not.toHaveBeenCalled();
  });
});