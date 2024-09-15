import { pgTable, text, integer, serial, boolean, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    username: text('username'),
    githubId: integer('github_id').unique(),
    email: text('email').notNull(),
    name: text('name'),
    password: text('password'),
    profilePicture: text('profile_picture').default('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
});

export const agents = pgTable('agents', {
    id: text('id').primaryKey(),
    userId: text('user_id').unique().references(() => users.id),
    name: text('name').notNull(),
});

export const bots = pgTable('bots', {
    id: text('id').primaryKey(),
    agentId: text('agent_id').unique().references(() => agents.id),
    chatBotTitle: text('chat_bot_title').notNull(),
    welcomeMessage: text('welcome_message').notNull(),
    widgetColor: text('widget_color').notNull(),
    collectVisitorInfo: boolean('collect_visitor_info').notNull(),
    widgetButtonPosition: text('widget_button_position').notNull(),
    fontFamily: text('font_family').notNull(),
    fontUrl: text('font_url').notNull(),
    convoStarters: text('convo_starters').array(),
    profileDescription: text('profile_description').notNull(),
    placeholder: text('placeholder').notNull(),
    style: text('style').notNull(),
    showPopupText: boolean('show_popup_text').notNull(),
    popupText: text('popup_text').notNull(),
    expandByDefault: boolean('expand_by_default').notNull(),
    removePoweredBy: boolean('remove_powered_by').notNull(),
    chatIsLocked: boolean('chat_is_locked').notNull(),
    typingMessage: text('typing_message').notNull(),
    userId: text('user_id').notNull(),
    botInteractions: integer('bot_interactions').default(0),
});

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull(),
    email: text('email').notNull(),
    name: text('name').notNull(),
});

export const visitors = pgTable('visitors', {
    id: serial('id').primaryKey(),
    botId: text('bot_id').references(() => bots.id),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
    agent: one(agents, {
        fields: [users.id],
        references: [agents.userId],
    }),
    sessions: many(sessions),
}));

export const agentRelations = relations(agents, ({ one }) => ({
    user: one(users, {
        fields: [agents.userId],
        references: [users.id],
    }),
    bot: one(bots, {
        fields: [agents.id],
        references: [bots.agentId],
    }),
}));

export const botRelations = relations(bots, ({ one, many }) => ({
    agent: one(agents, {
        fields: [bots.agentId],
        references: [agents.id],
    }),
    visitors: many(visitors),
}));

export const visitorRelations = relations(visitors, ({ one }) => ({
    bot: one(bots, {
        fields: [visitors.botId],
        references: [bots.id],
    }),
}));