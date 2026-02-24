import mongoose from "mongoose";
import slugify from "slugify";

const journeyLogsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },

    searchTitle: {
      type: String,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    thumbnailType: {
      type: String,
      enum: ["open", "close"],
      required: true,
    },

    thumbnailOpen: String,
    thumbnailClose: String,

    thumbnailOpenPublicId: String,
    thumbnailClosePublicId: String,

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* ======================
   SAFE PRE-SAVE HOOK
   ====================== */
journeyLogsSchema.pre("save", async function () {
  if (!this.isModified("description")) return;

  this.searchTitle = this.description.toLowerCase();

  const Model = this.constructor; // ✅ SAFE reference

  let baseSlug = slugify(this.description, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let count = 1;

  while (await Model.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
});

/* ======================
   TEXT SEARCH INDEX
   ====================== */
journeyLogsSchema.index(
  { description: "text" },
  { weights: { description: 5 } }
);

export default mongoose.models.JourneyLog ||
  mongoose.model("JourneyLog", journeyLogsSchema);
