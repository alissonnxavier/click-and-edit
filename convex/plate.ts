import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";


export const create = mutation({
    args: {
        code: v.string(),
        description: v.string(),
        amount: v.string(),
        image: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        };

        const plateRegisterId = await ctx.db.insert("plateRegister", {
            userId,
            code: args.code,
            description: args.description,
            amount: args.amount,
            image: args.image,
        });

        return plateRegisterId;
    }
})