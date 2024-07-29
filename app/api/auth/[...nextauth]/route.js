import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@model/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        // store the user id from MongoDB to session
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        session.user.id = sessionUser?._id.toString() || null;

        return session;
      } catch (error) {
        console.error("Error fetching user session: ", error.message);
        return session;
      }
    },
    async signIn({ account, profile }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
