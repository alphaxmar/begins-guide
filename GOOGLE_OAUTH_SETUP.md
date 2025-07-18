# Google OAuth Setup Instructions

## 1. Enable Google Provider in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `suemonabwttspbmxaxbi` 
3. Navigate to Authentication > Providers
4. Find Google and click "Enable"

## 2. Configure Google OAuth Settings

### Google Cloud Console Setup:
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing project
3. Enable Google+ API and Google OAuth2 API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
5. Configure consent screen with:
   - Application name: "Begins.Guide"
   - User support email: support@begins.guide
   - Developer contact: support@begins.guide

### OAuth Client Configuration:
- Application type: Web application
- Name: Begins.Guide Production
- Authorized JavaScript origins:
  - https://begins-guide.vercel.app
  - https://suemonabwttspbmxaxbi.supabase.co
  - http://localhost:5173 (for development)
- Authorized redirect URIs:
  - https://suemonabwttspbmxaxbi.supabase.co/auth/v1/callback
  - https://begins-guide.vercel.app/auth/callback

### Copy credentials to Supabase:
1. Copy Client ID and Client Secret from Google Console
2. In Supabase Dashboard > Authentication > Providers > Google:
   - Paste Client ID
   - Paste Client Secret
   - Site URL: https://begins-guide.vercel.app
   - Redirect URLs: https://begins-guide.vercel.app/**

## 3. Test Setup

Once configured, users can sign up with Google by:
1. Clicking "สมัครด้วย Google" button
2. Being redirected to Google OAuth consent
3. Approving permissions
4. Being redirected back to the app with authenticated session

## 4. Error Handling

The app handles these scenarios:
- Provider not enabled: Shows fallback message to use email/password
- User cancels OAuth: Shows cancellation message
- Network errors: Shows connection issue message
- Access denied: Shows permission request message

## 5. Production Checklist

- [ ] Google Cloud project configured
- [ ] OAuth consent screen approved
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URLs configured correctly
- [ ] Test sign-in flow works
- [ ] Error handling tested
