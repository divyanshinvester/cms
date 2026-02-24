import mongoose from "mongoose";

const performanceTrackSchema = new mongoose.Schema(
    {
        totalTrades: {
            type: String,
            required: true,
            trim: true
        },
        accuracy: {
            type: String,
            required: true,
            trim: true
        },
        avgRiskToReward: {
            type: String,
            required: true,
            trim: true
        },
        best: {
            type: String,
            required: true,
            trim: true
        },
        worst: {
            type: String,
            required: true,
            trim: true
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.models.Blog || mongoose.model("Performance", performanceTrackSchema);
