import { mysqlTable, serial, varchar, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const boards = mysqlTable('boards', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: int('user_id'),
});

export const items = mysqlTable('items', {
  id: serial('id').primaryKey(),
  boardId: int('board_id'),
  text: varchar('text', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  parentId: int('parent_id'),
});

export const columns = mysqlTable('columns', {
  id: serial('id').primaryKey(),
  boardId: int('board_id'),
  name: varchar('name', { length: 255 }).notNull(),
});

export const columnValues = mysqlTable('column_values', {
  id: serial('id').primaryKey(),
  itemId: int('item_id'),
  columnId: int('column_id'),
  value: varchar('value', { length: 255 }).notNull(),
});
