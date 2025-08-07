import { User } from "./models"; // Assuming you have a `User` model defined

declare namespace Express {
  export interface Request {
    user?: User; // Replace `User` with your actual type
  }
}
