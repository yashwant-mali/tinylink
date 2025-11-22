// path: src/models/Link.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const LinkSchema = new Schema({
    code: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    lastClicked: { type: Date, default: null },
    createdAt: { type: Date, default: () => new Date() }
});

// Avoid model overwrite in dev/reload
export default mongoose.models.Link || mongoose.model("Link", LinkSchema);