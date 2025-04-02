import { Schema, model, Types } from "mongoose";

const schema = new Schema({   
    note: {
        type: Types.ObjectId,
        ref: "notes",
        required: true,
    },
    to: {
        type: Types.ObjectId,
        ref: "users",
        required: true,
    },    
    from: {
        type: Types.ObjectId,
        ref: "users",
        required: true,
    },
}, { timestamps: true });

export const Message = model("messages", schema,"messages");