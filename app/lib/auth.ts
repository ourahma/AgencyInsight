import { auth, currentUser } from "@clerk/nextjs/server";

export const getAuth = () => {
  return auth();
};

export const getCurrentUser = () => {
  return currentUser();
};
