import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    plateRegister: defineTable({
        userId: v.id("users"),
        code: v.string(),
        description: v.string(),
        amount: v.string(),
        image: v.array(v.string()),
    }),
});

export default schema;