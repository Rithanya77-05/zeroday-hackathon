declare module "../../firebase" {
  import { FirebaseApp } from "firebase/app";
  import { Firestore } from "firebase/firestore";
  import { Auth } from "firebase/auth";
  export const app: FirebaseApp;
  export const db: Firestore;
  export const auth: Auth;
} 