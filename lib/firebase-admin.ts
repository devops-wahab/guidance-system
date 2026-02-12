// import "server-only";
import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//     }),
//   });
// }

import serviceAccount from "@/serviceAccountKey.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as any),
// });

// if (!admin.apps.length) {
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}
// }

const adminAuth = admin.auth();
const adminDb = admin.firestore();

export { adminAuth, adminDb };
