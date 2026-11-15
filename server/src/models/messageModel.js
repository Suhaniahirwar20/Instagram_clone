import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },

    media:{
      url:{
            type:String,
            default:"",
      },
      publicId:{type:String,default:""},
      type:{type:String,enum:["image","video"]},
    },
    isSeen: {
      type: Boolean,
      default: false,
    },

    seenAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({
  conversation: 1,
  createdAt: -1,
});

export default mongoose.model("Message", messageSchema);