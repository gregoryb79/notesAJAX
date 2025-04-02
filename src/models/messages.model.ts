import { Schema, model, Types } from "mongoose";

const schema = new Schema({   
    note: {
        type: Types.ObjectId,
        ref: "note",
        required: true,
    },
    to: {
        type: Types.ObjectId,
        ref: "to",
        required: true,
    },    
    from: {
        type: Types.ObjectId,
        ref: "from",
        required: true,
    },
}, { timestamps: true });

export const Message = model("messages", schema,"messages");