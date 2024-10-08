import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    plateRegister: defineTable({
        userId: v.id("users"),
        code: v.string(),
        supplier: v.string(),
        lot: v.string(),
        invoice: v.string(),
        rir: v.string(),
        hardnessOne: v.string(),
        hardnessTwo: v.string(),
        hardnessThree: v.string(),
        qualityMember: v.string(),
        image: v.array(v.string()),
    }),
});

export default schema;