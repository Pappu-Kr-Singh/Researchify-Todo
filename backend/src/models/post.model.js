import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postImg: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reactions: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.plugin(mongooseAggregatePaginate);
export const Post = mongoose.model("Post", postSchema);
