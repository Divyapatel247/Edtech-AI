import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser(async (user: any, done) => {
  done(null, user);
});

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
//   console.log(user.id);
//   console.log("in serializer");
// });

// passport.deserializeUser(async (id: string, done) => {
//   console.log("in deserializer");
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1059419114112-4kld3e3js7fe95im7mhv30bcmvcu7g2d.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    // {
    //   clientID: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   callbackURL: "http://localhost:3000/api/auth/google/callback",
    // },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Profile:", profile);
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              name: profile.displayName!,
              email: profile.emails![0].value,
            },
          });
        }
        // const sessionUser = { id: user.id, displayName: user.displayName, email: user.email, photo: user.photo };
        // done(null, sessionUser); // Use 'sessionUser' for simplicity

        done(null, profile);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// import passport from "passport";
// import OAuth2Strategy from "passport-oauth2";
// import { PrismaClient } from "@prisma/client";
// import dotenv from "dotenv";

// dotenv.config();
// const prisma = new PrismaClient();

// passport.use(
//   new OAuth2Strategy(
//     {
//       authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
//       tokenURL: "https://oauth2.googleapis.com/token",
//       clientID: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     async (profile: any, done: any) => {
//       try {
//         console.log("Profile:", profile);
//         let user = await prisma.user.findUnique({
//           where: { googleId: profile.id },
//         });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               googleId: profile.id,
//               name: profile.displayName!,
//               email: profile.emails![0].value,
//             },
//           });
//         }

//         done(null, profile);
//       } catch (error) {
//         done(error, undefined);
//       }
//     }
//   )
// );
