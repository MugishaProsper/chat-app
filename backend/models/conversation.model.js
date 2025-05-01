import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		participants: [ { type: mongoose.Schema.Types.ObjectId, ref: "User", }],
		messages: [	{	type: mongoose.Schema.Types.ObjectId,
				ref: "Message", default: [], }],
		unreadCount: {
			type: Map,
			of: Number,
			default: new Map()
		},
		lastRead: {
			type: Map,
			of: Date,
			default: new Map()
		}
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
