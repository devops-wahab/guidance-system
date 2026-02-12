# Setup Scripts

## Create First Admin User

### Prerequisites

1. Firebase project must be set up
2. Environment variables must be configured in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   ```

### Usage

Run the setup script:

```bash
node scripts/setup-admin.js
```

You will be prompted to enter:

- Admin name
- Admin email
- Admin password (minimum 6 characters)

### What the Script Does

1. **Creates user in Firebase Authentication**
   - Uses the email and password you provide
   - Sets the display name

2. **Assigns admin role**
   - Sets custom claims: `{ role: 'admin' }`
   - This enables role-based access control

3. **Creates Firestore document**
   - Collection: `users`
   - Document ID: User's UID
   - Fields: name, email, role, createdAt

### After Running

Once complete, you can:

1. Navigate to `/login`
2. Sign in with the admin credentials
3. Access the admin dashboard at `/admin`
4. Create additional users (students, advisors, admins) via the UI

### Troubleshooting

**Error: "Email already exists"**

- This email is already registered
- Use a different email or delete the existing user from Firebase Console

**Error: "Invalid email"**

- Check that you entered a valid email format

**Error: "Weak password"**

- Use a password with at least 6 characters

**Error: "Missing environment variables"**

- Ensure `.env.local` is properly configured
- Check that all Firebase credentials are set

### Security Note

⚠️ **Important**: This script should only be run once during initial setup. After creating the first admin, use the admin dashboard UI to create additional users.

For production deployments, consider:

- Deleting this script after initial setup
- Using Firebase Console to create admin users
- Implementing additional security measures
