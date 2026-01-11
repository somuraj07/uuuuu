import { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@/app/generated/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth: Missing email or password");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              student: true,
              assignedClasses: true,
              school: {
                select: {
                  name: true,
                  icon: true,
                }
              },
            },
          });

          if (!user) {
            console.log("Auth: User not found for email:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.log("Auth: User has no password set");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.log("Auth: Password mismatch for user:", credentials.email);
            return null;
          }

          console.log("Auth: Successfully authenticated user:", user.email, "Role:", user.role);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            mobile: user.mobile,
            studentId: user.student?.id ?? null,
            subjectsTaught: user.subjectsTaught,
            schoolIcon: user.school?.icon ?? null,
            schoolName: user.school?.name ?? null, // Added schoolName here
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      // First login
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.mobile = user.mobile;
        token.studentId = user.studentId;
        token.subjectsTaught = (user as any).subjectsTaught;
        token.icon = (user as any).schoolIcon; 
        token.schoolName = (user as any).schoolName; // Added schoolName to token
      }

      // 🔥 IMPORTANT: keep schoolId, icon, and name always in sync without bloating headers
      if (token.id && (!token.schoolId || !token.icon || !token.schoolName || !token.name)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            name: true,
            email: true,
            schoolId: true,
            school: { select: { name: true, icon: true } }, 
            student: { 
                select: { 
                    schoolId: true,
                    school: { select: { name: true, icon: true } }
                } 
            },
            adminSchools: { select: { id: true } },
            teacherSchools: { select: { id: true } },
          },
        });
        
        if (!token.name && dbUser?.name) {
          token.name = dbUser.name;
        }
        
        if (!token.email && dbUser?.email) {
          token.email = dbUser.email;
        }

        token.schoolId =
          dbUser?.schoolId ??
          dbUser?.student?.schoolId ??
          dbUser?.adminSchools?.[0]?.id ??
          dbUser?.teacherSchools?.[0]?.id ??
          null;

        if (!token.icon) {
            token.icon = dbUser?.school?.icon ?? dbUser?.student?.school?.icon ?? null;
        }
        
        if (!token.schoolName) {
            token.schoolName = dbUser?.school?.name ?? dbUser?.student?.school?.name ?? null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: (token.name as string) || session.user?.name || null,
        email: (token.email as string) || session.user?.email || null,
        role: token.role as Role,
        schoolId: token.schoolId as string | null,
        mobile: token.mobile as string | null,
        studentId: token.studentId as string | null,
        subjectsTaught: token.subjectsTaught as string | null,
        icon: token.icon as string | null,
        schoolName: token.schoolName as string | null, // Added schoolName to session
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/* ---------------- TYPES ---------------- */
