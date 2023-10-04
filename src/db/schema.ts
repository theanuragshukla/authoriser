import { boolean, json, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id"),
    uid: varchar("uid", { length: 32 }).primaryKey().notNull().unique(),
    firstName: varchar("first_name", { length: 32 }).notNull(),
    lastName: varchar("last_name", { length: 32 }),
    email: varchar("email", { length: 128 }).unique().notNull(),
    password: text("password").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const authseed = pgTable("authseed", {
    uid: varchar("uid", { length: 32 }).primaryKey().notNull().unique().references(() => users.uid),
        sessions:json("sessions", {})
})
