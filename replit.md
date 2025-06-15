# Islamic Calendar Application

## Overview

This is a full-stack Islamic calendar application built with React, Express, and PostgreSQL. The app provides Islamic calendar functionality including Hijri date display, prayer times, date conversion between Gregorian and Hijri calendars, and Islamic events tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Islamic-themed color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development Server**: Custom Vite integration for SSR-like development experience

### Database Architecture
- **Database**: PostgreSQL (configured for both local and Neon serverless)
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: Shared between client and server (`/shared/schema.ts`)
- **Migration Strategy**: Drizzle Kit for database migrations

## Key Components

### Database Schema
- **Users**: Basic user authentication system with username/password
- **Prayer Time Settings**: User-specific prayer time preferences including city, coordinates, timezone, and calculation method
- **Islamic Events**: Recurring Islamic holidays and significant dates with Hijri calendar references

### API Endpoints
- `GET /api/hijri-date` - Current Hijri date conversion
- `GET /api/prayer-times` - Prayer times based on user settings
- `POST /api/prayer-settings` - Update prayer time location preferences
- `GET /api/islamic-events` - Retrieve Islamic events and holidays

### Frontend Components
- **IslamicCalendar**: Interactive Hijri calendar display
- **PrayerTimes**: Real-time prayer times with city selection
- **DateConverter**: Bidirectional Gregorian ↔ Hijri date conversion
- **UpcomingEvents**: Display of upcoming Islamic holidays and events

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data from Express API
2. **API Processing**: Express routes handle business logic and data validation using Zod schemas
3. **Database Operations**: Drizzle ORM performs type-safe database operations
4. **Response Handling**: API responses are cached and managed by TanStack Query
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm** & **drizzle-zod**: Database ORM with type-safe schema validation
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: CSS class variant management

### Development Dependencies
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit integration
- **Development Server**: Vite dev server with Express API proxy
- **Database**: PostgreSQL 16 with automatic provisioning
- **Hot Reload**: Full-stack hot reload for both client and server code

### Production Build
- **Client Build**: Vite builds React app to `/dist/public`
- **Server Build**: esbuild bundles Express server to `/dist/index.js`
- **Asset Serving**: Express serves static React build in production
- **Database**: Uses DATABASE_URL environment variable for connection

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Auto-deployment**: Configured for Replit's autoscale deployment target

## Changelog
```
Changelog:
- June 15, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```