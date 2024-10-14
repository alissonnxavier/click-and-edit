import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";


export const create = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        };

        const plateRegisterId = await ctx.db.insert("plateRegister", {
            userId,
            code: args.code,
            supplier: args.supplier,
            lot: args.lot,
            invoice: args.invoice,
            rir: args.rir,
            hardnessOne: args.hardnessOne,
            hardnessTwo: args.hardnessTwo,
            hardnessThree: args.hardnessThree,
            qualityMember: args.qualityMember,
            image: args.image,
        });

        return plateRegisterId;
    }
});

export const update = mutation({
    args: {
        id: v.id("plateRegister"),
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
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        };

        const plateRegisterId = await ctx.db.patch(args.id, {
            userId,
            code: args.code,
            supplier: args.supplier,
            lot: args.lot,
            invoice: args.invoice,
            rir: args.rir,
            hardnessOne: args.hardnessOne,
            hardnessTwo: args.hardnessTwo,
            hardnessThree: args.hardnessThree,
            qualityMember: args.qualityMember,
            image: args.image,
        });

        return plateRegisterId;
    }
});


export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            return []
        };

        const registers = await ctx.db
            .query("plateRegister")
            .order("desc")
            .collect()

        if (!registers) {
            return [];
        }

        let data = [] as any;

        for (let i = 0; registers.length > i; i++) {
            let array = [];
            for (let n = 0; registers[i].image.length > n; n++) {
                let photo = await ctx.storage.getUrl(registers[i].image[n] as Id<"_storage">);

                array.push(photo);
            }
            let images = { photos: array }
            data.push({ ...registers[i], ...images });
        };

        return data;
    },
});

export const getById = query({
    args: {
        id: v.optional(v.id("plateRegister")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!args.id) {
            return []
        };

        if (!userId) {
            return []
        };

        const result = await ctx.db
            .query("plateRegister")
            .filter((q) => q.eq(q.field("_id"), args.id))
            .collect();

        if (!result) {
            return [];
        }

        let data = [] as any;
        let images = [] as any;
        if (result) {
            let array = [];
            for (let i = 0; result[0]?.image.length > i; i++) {
                let image = await ctx.storage.getUrl(result[0]?.image[i] as Id<"_storage">);
                array.push(image);
            };
            images = { photos: array };
            data = { ...result, ...images }
        };

        return data;
    },
});

export const remove = mutation({
    args: {
        id: v.id("plateRegister")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!args.id) {
            throw new Error("Unauthorized");
        };

        const result = await ctx.db
            .query("plateRegister")
            .filter((q) => q.eq(q.field("_id"), args.id))
            .collect();

        if (!result) {
            return [];
        };

        for (const image of result[0]?.image) {
            await ctx.storage.delete(image);
        };

        await ctx.db.delete(args.id);

        return args.id;
    }
});