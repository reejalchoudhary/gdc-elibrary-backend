import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Book", "Notes", "PYQ"],
    },

    department: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      required: true,
    },

    driveLink: {
      type: String,
      required: true,
    },

    fileId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourceSchema);