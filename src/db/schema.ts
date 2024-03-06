import {
    PgTableExtraConfig,
    PrimaryKey,
    boolean,
    json,
    pgTable,
    primaryKey,
    serial,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id"),
    uid: varchar("uid", { length: 32 }).primaryKey().notNull().unique(),
    firstName: varchar("first_name", { length: 32 }).notNull(),
    lastName: varchar("last_name", { length: 32 }),
    email: varchar("email", { length: 128 }).unique().notNull(),
    password: text("password").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    isDeveloper: boolean("is_developer").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const authseed = pgTable("authseed", {
    uid: varchar("uid", { length: 32 })
        .primaryKey()
        .notNull()
        .unique()
        .references(() => users.uid),
    sessions: json("sessions").default({}),
});

export const apps = pgTable("apps", {
    appId: varchar("appId", { length: 64 }).primaryKey().notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    uid: varchar("uid", { length: 32 })
        .notNull()
        .references(() => users.uid),
});

export const appInfo = pgTable("app_info", {
    appId: varchar("appId", { length: 64 })
        .primaryKey()
        .notNull()
        .unique()
        .references(() => apps.appId),
    appName: varchar("app_name", { length: 32 }).notNull(),
    appDesc: varchar("app_desc", { length: 100 }),
    appLogo: text("app_logo"),
    appPolicy: text("app_policy"),
    appTos: text("app_tos"),
});

export const appCreds = pgTable("app_creds", {
    appId: varchar("appId", { length: 64 })
        .primaryKey()
        .notNull()
        .unique()
        .references(() => apps.appId),
    clientId: uuid("client_id"),
    clientSecret: text("client_secret"),
});

export const appDetails = pgTable("app_details", {
    appId: varchar("appId", { length: 64 })
        .primaryKey()
        .notNull()
        .unique()
        .references(() => apps.appId),
    redirectUri: varchar("redirect_uri", { length: 200 }),
    homepage: varchar("homepage", { length: 200 }),
    supportEmail: varchar("support_email", { length: 100 }),
});

export const clientSeeds = pgTable(
    "client_access_seeds",
    {
        uid: varchar("uid", { length: 32 })
            .notNull()
            .references(() => users.uid),
        appId: varchar("appId", { length: 64 })
            .notNull()
            .references(() => apps.appId),
        seeds: json("seeds").default({}),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        pk: primaryKey(table.uid, table.appId),
    })
);
