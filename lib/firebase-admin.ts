// // import "server-only";
// import admin from "firebase-admin";

// // if (!admin.apps.length) {
// //   admin.initializeApp({
// //     credential: admin.credential.cert({
// //       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// //       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// //       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
// //     }),
// //   });
// // }

// if (!admin.apps.length) {
//   const projectId = process.env.FIREBASE_PROJECT_ID;
//   const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
//   const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

//   // Validate required credentials
//   if (!projectId || !clientEmail || !privateKey) {
//     console.warn(
//       "Firebase Admin credentials not fully configured. Some features may not work.",
//     );
//   } else {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId,
//         clientEmail,
//         privateKey,
//       }),
//     });
//   }
// }

// const adminAuth = admin.auth();
// const adminDb = admin.firestore();

// export { adminAuth, adminDb };

import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
