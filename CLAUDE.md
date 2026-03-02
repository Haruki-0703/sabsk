# CLAUDE.md — SubscK Codebase Guide

## Project Overview

**SubscK** (サブスク管理アプリ) is a subscription management app targeting the Japanese market. The core value proposition is helping users instantly see their total monthly costs and avoid forgetting to cancel subscriptions.

- **Current Version**: 1.5.0
- **Platform**: iOS, Android, and Web (via Expo)
- **Primary Language**: TypeScript (strict mode)
- **Package Manager**: pnpm 9.12.0

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Mobile/Web Framework | Expo SDK 54 + React Native 0.81.5 |
| React Version | React 19.1.0 |
| Routing | Expo Router v6 (file-based) |
| State / Data Fetching | TanStack Query v5 + tRPC v11 |
| Local Persistence | AsyncStorage |
| Backend Framework | Express 4 + tRPC Server |
| Database ORM | Drizzle ORM (MySQL dialect) |
| Authentication | Manus OAuth |
| Validation | Zod v4 |
| Serialization | superjson |
| Animation | React Native Reanimated 4 |
| Testing | Vitest |
| Build (server) | esbuild |

---

## Directory Structure

```
sabsk/
├── app/                      # Expo Router screens (file-based routing)
│   ├── (tabs)/               # Bottom tab bar screens
│   │   ├── _layout.tsx       # Tab navigator config
│   │   ├── index.tsx         # Home screen (subscription list + total)
│   │   ├── report.tsx        # Spending reports (charts)
│   │   └── settings.tsx      # Settings screen
│   ├── _layout.tsx           # Root layout (providers + Stack)
│   ├── add.tsx               # Add subscription (modal)
│   ├── templates.tsx         # Template selection (modal)
│   ├── detail/[id].tsx       # Subscription detail (dynamic route)
│   ├── edit/[id].tsx         # Edit subscription (dynamic route)
│   ├── onboarding.tsx        # First-launch onboarding flow
│   ├── payment-history.tsx   # Payment history screen
│   ├── notification-settings.tsx
│   ├── cloud-backup-settings.tsx
│   ├── oauth/callback.tsx    # OAuth deep link handler
│   ├── privacy-policy.tsx
│   ├── terms-of-service.tsx
│   └── modal.tsx
│
├── components/               # Reusable React Native components
│   ├── subscription-card.tsx # Card for a single subscription
│   ├── total-card.tsx        # Monthly/yearly total display
│   ├── themed-text.tsx       # Dark-mode-aware Text
│   ├── themed-view.tsx       # Dark-mode-aware View
│   ├── delete-confirmation-dialog.tsx
│   ├── home-widget.tsx
│   └── ui/
│       ├── icon-symbol.tsx   # Cross-platform icon component
│       └── icon-symbol.ios.tsx
│
├── hooks/                    # Custom React hooks
│   ├── use-subscriptions.ts  # CRUD for subscriptions via AsyncStorage
│   ├── use-auth.ts           # Auth state (user, loading, logout)
│   ├── use-cloud-auth.ts     # Cloud backup auth
│   ├── use-color-scheme.ts   # Platform-aware color scheme
│   ├── use-color-scheme.web.ts
│   ├── use-theme-color.ts
│   ├── use-notifications.ts
│   ├── use-payment-history.ts
│   └── use-multi-select.ts
│
├── lib/                      # Utility / client libraries
│   ├── trpc.ts               # tRPC client + createTRPCClient()
│   ├── auth.ts               # Token storage helpers (SecureStore)
│   ├── api.ts                # REST API helpers (getMe, logout)
│   ├── cloud-backup.ts       # Cloud sync logic
│   ├── icon-utils.ts         # Icon helpers
│   ├── service-logos.ts      # Clearbit logo fetching
│   ├── widget-data.ts        # Home widget data sharing
│   └── manus-runtime.ts      # Manus platform integration
│
├── constants/                # App-wide constants
│   ├── theme.ts              # Colors, Fonts, Spacing, BorderRadius
│   ├── oauth.ts              # OAuth configuration + getApiBaseUrl()
│   ├── templates.ts          # Subscription service templates
│   ├── japanese-subscriptions.ts  # 40+ Japanese service price DB
│   └── const.ts              # Cookie name, timeouts, etc.
│
├── types/                    # TypeScript type definitions
│   └── subscription.ts       # Subscription interface + helpers
│
├── shared/                   # Shared between client and server
│   ├── types.ts              # Re-exports from drizzle schema + errors
│   ├── const.ts              # Shared constants
│   └── _core/errors.ts       # Shared error types
│
├── server/                   # Express + tRPC backend
│   ├── _core/                # Framework infrastructure (do not modify casually)
│   │   ├── index.ts          # Server entry point (Express + tRPC mount)
│   │   ├── trpc.ts           # publicProcedure, protectedProcedure, router
│   │   ├── context.ts        # TrpcContext type definition
│   │   ├── oauth.ts          # OAuth flow handler
│   │   ├── cookies.ts        # Cookie utilities
│   │   ├── env.ts            # ENV object from process.env
│   │   ├── llm.ts            # invokeLLM() helper
│   │   ├── imageGeneration.ts # generateImage() helper
│   │   ├── voiceTranscription.ts # transcribeAudio() helper
│   │   ├── notification.ts   # notifyOwner() helper
│   │   ├── dataApi.ts        # Manus Data API
│   │   ├── systemRouter.ts   # system.* tRPC routes
│   │   └── sdk.ts
│   ├── routers.ts            # App tRPC router (ADD ROUTES HERE)
│   ├── db.ts                 # Database query helpers (ADD QUERIES HERE)
│   └── storage.ts            # storagePut() / storageGet() helpers
│
├── drizzle/                  # Database schema and migrations
│   ├── schema.ts             # Table definitions (ADD TABLES HERE)
│   ├── relations.ts          # Table relationships
│   ├── migrations/           # SQL migration files
│   └── meta/                 # Drizzle migration metadata
│
├── tests/                    # Vitest test files
│   └── auth.logout.test.ts
│
├── scripts/                  # Dev utility scripts
│   ├── load-env.js           # Env loader (used by app.config.ts)
│   └── generate_qr.mjs       # QR code for dev access
│
├── assets/                   # Static assets (icons, images)
├── app.config.ts             # Expo config (app name, bundle IDs, plugins)
├── drizzle.config.ts         # Drizzle Kit config
├── tsconfig.json             # TypeScript config
├── metro.config.cjs          # Metro bundler config
├── eslint.config.js          # ESLint config (flat format)
└── package.json
```

---

## Development Commands

```bash
# Start everything (server + Metro bundler)
pnpm dev

# Start server only (hot reload via tsx watch)
pnpm dev:server

# Start Metro/Expo only
pnpm dev:metro

# Run on Android/iOS simulator
pnpm android
pnpm ios

# TypeScript type checking
pnpm check

# Linting
pnpm lint

# Code formatting
pnpm format

# Run tests
pnpm test

# Database: generate SQL + run migrations
pnpm db:push

# Build server for production
pnpm build

# Run production server
pnpm start

# Generate QR code for device testing
pnpm qr
```

---

## Architecture Overview

### Data Flow

```
User Interaction
  → React component
    → Custom hook (use-subscriptions, use-auth, etc.)
      → AsyncStorage (local data, offline-first)
      → tRPC hook (cloud/server data)
        → Express server
          → Drizzle ORM → MySQL database
```

### Frontend State Management

The app is **offline-first**. Subscription data lives in `AsyncStorage` (not the database). The database is used for user accounts and cloud backup only.

- `useSubscriptions()` — the primary data hook; reads/writes to AsyncStorage
- `useAuth()` — manages authentication state; differs between web (cookie) and native (SecureStore token)
- tRPC hooks — used for server-side operations (auth, cloud backup, notifications)

### Navigation Structure (Expo Router)

```
Root Stack
├── (tabs)                  # Tab bar (no header)
│   ├── index              # Home — subscription list
│   ├── report             # Reports — charts and stats
│   └── settings           # Settings screen
├── add                    # Modal: add subscription
├── templates              # Modal: choose from templates
├── detail/[id]            # Push: subscription detail
├── edit/[id]              # Push: edit subscription
├── onboarding             # Onboarding flow
├── payment-history        # Payment history
├── notification-settings  # Notification config
├── cloud-backup-settings  # Cloud backup config
├── oauth/callback         # OAuth deep link handler
├── privacy-policy
└── terms-of-service
```

---

## Authentication

Two auth modes depending on platform:

| Platform | Auth Method | Token Storage |
|----------|-------------|---------------|
| iOS/Android | Bearer token | `expo-secure-store` |
| Web | HTTP-only cookie | Browser cookie |

### Usage Pattern

```tsx
import { useAuth } from "@/hooks/use-auth";

function MyScreen() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) return <ActivityIndicator />;
  if (!isAuthenticated) return <LoginButton />;

  return <ThemedText>Welcome, {user.name}</ThemedText>;
}
```

### Handling Protected tRPC Procedures

Always handle `UNAUTHORIZED` errors on the frontend:

```tsx
try {
  await trpc.someProtectedEndpoint.mutate(data);
} catch (error) {
  if (error.data?.code === 'UNAUTHORIZED') {
    router.push('/login');
    return;
  }
  throw error;
}
```

---

## Theme System

Colors and design tokens live in `constants/theme.ts`. Always use these instead of hardcoded values.

```tsx
import { Colors, CategoryColors, Spacing, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={{ backgroundColor: colors.background, padding: Spacing.lg }}>
      <ThemedText style={{ color: colors.tint }}>Hello</ThemedText>
    </View>
  );
}
```

### Light / Dark Color Palette

| Token | Light | Dark |
|-------|-------|------|
| `background` | `#F2F2F7` | `#000000` |
| `cardBackground` | `#FFFFFF` | `#1C1C1E` |
| `tint` (primary) | `#007AFF` | `#0A84FF` |
| `text` | `#000000` | `#FFFFFF` |
| `textSecondary` | `#8E8E93` | `#8E8E93` |
| `destructive` | `#FF3B30` | `#FF453A` |
| `success` | `#34C759` | `#30D158` |

### Themed Components

Use `ThemedText` and `ThemedView` instead of raw `Text`/`View` wherever possible — they automatically apply the correct text and background colors for the current color scheme.

---

## Core Type Definitions

### Subscription (types/subscription.ts)

```typescript
type BillingCycle = 'monthly' | 'yearly' | 'weekly';
type Category = 'entertainment' | 'music' | 'video' | 'productivity' | 'cloud' | 'gaming' | 'news' | 'fitness' | 'other';

interface Subscription {
  id: string;           // UUID
  name: string;
  amount: number;
  currency: string;     // e.g., 'JPY'
  cycle: BillingCycle;
  nextBillingDate: string;  // ISO date string
  category: Category;
  note?: string;
  createdAt: string;    // ISO date string
  updatedAt: string;    // ISO date string
}
```

**Utility functions in `types/subscription.ts`:**
- `toMonthlyAmount(amount, cycle)` — converts any cycle to monthly equivalent
- `formatCurrency(amount, currency)` — formats with `ja-JP` locale
- `formatDate(dateString)` — formats as Japanese short date
- `generateId()` — generates UUID v4

### Database Schema (drizzle/schema.ts)

Only the `users` table exists currently (for auth). Add new tables here when server-side storage is needed.

---

## Backend: Adding New Features

### Adding a tRPC Route

1. Add query helpers to `server/db.ts`
2. Add the route to `server/routers.ts`

```typescript
// server/routers.ts
import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

  // Add your feature router:
  subscriptions: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getUserSubscriptions(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({ name: z.string().min(1) }))
      .mutation(({ ctx, input }) =>
        db.createSubscription({ userId: ctx.user.id, ...input })
      ),
  }),
});
```

### Adding a Database Table

Edit `drizzle/schema.ts`, then run `pnpm db:push`:

```typescript
// drizzle/schema.ts
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DbSubscription = typeof subscriptions.$inferSelect;
```

### Server-side Services

| Service | Import | Notes |
|---------|--------|-------|
| LLM / AI | `invokeLLM` from `server/_core/llm` | Use only in server procedures |
| Image generation | `generateImage` from `server/_core/imageGeneration` | 5-20s, add loading state |
| Voice transcription | `transcribeAudio` from `server/_core/voiceTranscription` | 16MB limit |
| File storage (S3) | `storagePut` from `server/storage` | Returns `{ key, url }` |
| Owner notifications | `notifyOwner` from `server/_core/notification` | Push to app owner |

---

## Environment Variables

### Server Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session token signing secret |
| `VITE_APP_ID` | Manus OAuth app ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend URL |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL |
| `OWNER_OPEN_ID` | Owner's Manus OAuth ID |
| `OWNER_NAME` | Owner's display name |
| `BUILT_IN_FORGE_API_URL` | Manus API endpoint |
| `BUILT_IN_FORGE_API_KEY` | Manus API key |

### Expo Client Variables (must be prefixed `EXPO_PUBLIC_`)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_APP_ID` | App ID for OAuth |
| `EXPO_PUBLIC_API_BASE_URL` | API server URL |
| `EXPO_PUBLIC_OAUTH_PORTAL_URL` | Login portal URL |

**Never commit `.env` files.** Only `.env*.local` is gitignored; use that for local overrides.

---

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@/*` | project root (`./`) |
| `@shared/*` | `./shared/*` |

Example: `import { useSubscriptions } from "@/hooks/use-subscriptions"`

---

## Testing

Tests use **Vitest** and live in `tests/`. tRPC procedures are tested directly via `createCaller()`:

```typescript
// tests/my-feature.test.ts
import { describe, expect, it } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

function createMockContext(overrides?: Partial<TrpcContext>): TrpcContext {
  return {
    user: { id: 1, openId: "test-user", role: "user", /* ... */ },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
    ...overrides,
  };
}

describe("my feature", () => {
  it("does the thing", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.myFeature.doThing({ input: "value" });
    expect(result).toBeDefined();
  });
});
```

Run tests: `pnpm test`

---

## Coding Conventions

### Component Patterns

- Always use `useCallback` for event handlers passed to list items
- Use `useSafeAreaInsets()` from `react-native-safe-area-context` for proper padding
- FAB buttons sit above the tab bar: `bottom: Math.max(insets.bottom, 16) + 60`
- Use `StyleSheet.create()` for all styles (not inline objects)
- Prefer `Pressable` over `TouchableOpacity` for interactive elements

### TypeScript

- `strict: true` is enabled — never use `any` without a comment explaining why
- Date values in the `Subscription` type are **ISO strings** (not `Date` objects)
- Use Zod schemas for all user input and tRPC input validation

### UI/Design

- Follow **Apple Human Interface Guidelines** for layout and interaction patterns
- Minimum touch target size: **44pt**
- Base spacing unit: **8pt** (use `Spacing.*` constants)
- Card border radius: **12pt** (`BorderRadius.md`)
- Primary color: `Colors[scheme].tint` (`#007AFF` / `#0A84FF`)

### Localization

- The app UI is in **Japanese**. User-facing strings are in Japanese.
- Currency formatting uses `ja-JP` locale via `Intl.NumberFormat`
- Category labels are in Japanese (see `CATEGORY_LABELS` in `types/subscription.ts`)

---

## Key Files Quick Reference

| File | Purpose |
|------|---------|
| `app/(tabs)/index.tsx` | Home screen — main entry point for users |
| `hooks/use-subscriptions.ts` | All subscription CRUD — primary data hook |
| `types/subscription.ts` | Core data types + utility functions |
| `constants/theme.ts` | All colors, spacing, typography tokens |
| `constants/japanese-subscriptions.ts` | 40+ Japanese service templates with prices |
| `constants/templates.ts` | Template definitions for subscription services |
| `server/routers.ts` | All tRPC API routes |
| `server/db.ts` | All database query functions |
| `drizzle/schema.ts` | Database table definitions |
| `lib/trpc.ts` | tRPC client configuration |
| `lib/auth.ts` | Token/user storage utilities |
| `app.config.ts` | Expo app configuration (bundle ID, icons, plugins) |

---

## Common Pitfalls

1. **Don't use `Date` objects in `Subscription`** — the interface uses ISO date strings. Use `new Date().toISOString()` when setting and `new Date(dateString)` when reading.

2. **Don't hardcode colors** — always reference `Colors[colorScheme ?? "light"].xxx` from `constants/theme.ts`.

3. **tRPC transformer placement** — in tRPC v11, the `transformer: superjson` must be inside `httpBatchLink`, not at the root `createClient` level.

4. **Protected procedures require auth error handling** — when calling `protectedProcedure` endpoints from the frontend, always catch `UNAUTHORIZED` errors.

5. **Database is optional for local features** — the core subscription data lives in AsyncStorage. Only use the database for user accounts and cloud-sync features.

6. **pnpm only** — this project uses pnpm. Do not use npm or yarn.

7. **`db:push` requires `DATABASE_URL`** — the `drizzle.config.ts` will throw if the env var is not set.

---

## Version History Summary

| Version | Key Features |
|---------|-------------|
| v1.0.0 | Core CRUD, AsyncStorage persistence, iOS-style design |
| v1.1.0 | Push notifications, Clearbit logo fetching, spending reports |
| v1.2.0 | 30+ subscription templates |
| v1.2.1 | Japanese price database (40+ services), icon improvements |
| v1.3.0 | Privacy policy, terms, delete confirmation, App Store prep |
| v1.3.1 | Bug fixes, UX polish |
| v1.4.0 | Home widget (iOS/Android), Pull-to-Refresh |
| v1.4.1 | Version display in settings, UI tweaks |
| v1.5.0 | Payment history, Google/Apple Sign-In cloud backup, onboarding |
