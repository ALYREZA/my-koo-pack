# Admin Authentication Setup

This document explains how to set up the admin authentication system for the Koo Pack application.

## Overview

The admin system provides:
- Simple password-only authentication using Cloudflare secrets
- Mobile number input and human-readable code generation
- Integration with Supabase for data storage
- Secure access control for admin functions

## Prerequisites

1. **Supabase Project**: You need a Supabase project set up
2. **Cloudflare Account**: For deploying and managing environment variables
3. **Wrangler CLI**: For managing Cloudflare secrets

## Setup Steps

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL script from `supabase-schema.sql` to create the required table:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

4. Note down your Supabase URL and anon key from the project settings

### 2. Cloudflare Configuration

#### Update wrangler.jsonc

1. Open `wrangler.jsonc`
2. Replace `"your-supabase-url-here"` with your actual Supabase URL:

```json
"vars": {
    "SUPABASE_URL": "https://your-project-id.supabase.co"
}
```

#### Set Cloudflare Secrets

Use the Wrangler CLI to set the required secrets:

```bash
# Set admin password  
wrangler secret put ADMIN_PASSWORD

# Set Supabase key
wrangler secret put SUPABASE_KEY

# Set Authorization token
wrangler secret put Authorization
```

When prompted, enter the values:
- `ADMIN_PASSWORD`: Your desired admin password
- `SUPABASE_KEY`: Your Supabase project's key
- `Authorization`: Your authorization token

### 3. Local Development

For local development, create a `.env.local` file in your project root:

```env
ADMIN_PASSWORD=your-admin-password
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-supabase-key
Authorization=your-authorization-token
```

**Note**: Never commit this file to version control.

### 4. Deploy

Deploy your application to Cloudflare Pages:

```bash
pnpm run deploy
```

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` in your deployed application
2. You'll be redirected to `/admin/login`
3. Enter your admin password
4. Upon successful login, you'll be redirected to the admin dashboard

### Admin Features

- **Mobile Code Generation**: Enter a mobile number and generate a human-readable code (format: ABC123)
- **Code Management**: View all generated codes with their status (Active/Used)
- **Status Updates**: Mark codes as used when they've been utilized
- **Data Persistence**: All data is stored in Supabase

### Code Format

Generated codes follow the format: **3 letters + 3 numbers**
- Examples: `ABC123`, `XYZ789`, `DEF456`

## Security Considerations

1. **Environment Variables**: Admin password is stored as Cloudflare secrets, not in the code
2. **Authentication**: Session is stored in localStorage (consider upgrading to more secure storage for production)
3. **Supabase RLS**: Row Level Security is enabled on the database table
4. **HTTPS**: Ensure your application is served over HTTPS in production
5. **Password Security**: Use a strong, unique password for admin access

## Troubleshooting

### Common Issues

1. **"Admin password not configured"**: Ensure you've set the ADMIN_PASSWORD Cloudflare secret properly
2. **"Supabase client not initialized"**: Check that SUPABASE_URL and SUPABASE_KEY are set correctly
3. **Database errors**: Verify the Supabase table was created correctly and RLS policies are set

### Debugging

1. Check Cloudflare Pages logs for server-side errors
2. Use browser developer tools to inspect client-side errors
3. Verify environment variables are accessible in the Cloudflare dashboard

## File Structure

```
src/
├── lib/
│   ├── types/
│   │   └── auth.ts          # Type definitions
│   └── utils/
│       ├── auth.ts          # Authentication utilities
│       └── supabase.ts      # Supabase integration
└── routes/
    └── admin/
        ├── +layout.svelte   # Admin layout with auth
        ├── +layout.ts       # Layout load function
        ├── +page.svelte     # Admin dashboard
        ├── +page.ts         # Page load function
        └── login/
            ├── +page.svelte # Login form
            └── +page.ts     # Login page load
```

## Next Steps

Consider implementing:
- More robust session management
- Role-based access control
- Audit logging
- Rate limiting for code generation
- Email/SMS notifications for generated codes
