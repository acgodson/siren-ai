import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { customAlphabet } from "nanoid";
import axios from "axios";

const generateSlug = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10
);

export const appRouter = createTRPCRouter({
  getProfile: baseProcedure.query(async () => {}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
