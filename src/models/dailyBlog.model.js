import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        blog: {
            type: String,
            required: true,
            trim: true,
        },

    },
    { timestamps: true }
);



export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
