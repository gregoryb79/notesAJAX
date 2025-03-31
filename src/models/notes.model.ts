import { Schema, model, Types } from "mongoose";

const schema = new Schema({   
    title: {
        type: String,
        required: true,
    },
    body: String,    
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: false,
    },
}, { timestamps: true });

export const Note = model("notes", schema);