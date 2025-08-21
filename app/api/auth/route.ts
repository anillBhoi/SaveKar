import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure your authOptions are correctly imported

// The new NextAuth.js App Router route handler is a single line.
const handler = NextAuth(authOptions);

// This handler will automatically manage the GET and POST requests for NextAuth.js.
// You simply export the handler.
export { handler as GET, handler as POST };
