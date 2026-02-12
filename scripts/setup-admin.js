/**
 * Setup Script: Create First Admin User
 * 
 * This script creates the initial admin user for the Guidance System.
 * Run this once during initial setup.
 * 
 * Usage:
 *   node scripts/setup-admin.js
 * 
 * You will be prompted to enter:
 *   - Admin name
 *   - Admin email
 *   - Admin password
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createAdminUser() {
  console.log('\n=== Guidance System - Admin Setup ===\n');
  console.log('This script will create the first admin user.\n');

  try {
    // Get admin details from user
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');

    // Validate input
    if (!name || !email || !password) {
      console.error('\n❌ Error: All fields are required.');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ Error: Password must be at least 6 characters.');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Creating admin user...');

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: name,
    });

    console.log(`✅ User created in Firebase Auth (UID: ${userRecord.uid})`);

    // Set custom claims for admin role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'admin' });
    console.log('✅ Admin role assigned via custom claims');

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name: name,
      email: email,
      role: 'admin',
      createdAt: admin.firestore.Timestamp.now(),
    });

    console.log('✅ User document created in Firestore');

    console.log('\n🎉 Success! Admin user created successfully.\n');
    console.log('Login credentials:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('\nYou can now login at /login and access the admin dashboard.\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.error('\nThis email is already registered. Please use a different email.');
    } else if (error.code === 'auth/invalid-email') {
      console.error('\nInvalid email format. Please enter a valid email address.');
    } else if (error.code === 'auth/weak-password') {
      console.error('\nPassword is too weak. Please use a stronger password.');
    }
    
    rl.close();
    process.exit(1);
  }

  rl.close();
  process.exit(0);
}

// Run the script
createAdminUser();
