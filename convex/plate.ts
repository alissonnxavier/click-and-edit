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

        let arrayPhotosUrl = [] as any;
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