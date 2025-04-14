import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { connectToDatabase } from "@/database/mongoose";
import UserModel from "@/database/models/User.model";

export async function POST(req: Request) {
	try {
		const evt = await verifyWebhook(req);

		const { id } = evt.data;
		const eventType = evt.type;

		console.log(
			`Received webhook with ID ${id} and event type of ${eventType}`,
		);
		console.log("Webhook payload:", evt.data);

		switch (eventType) {
			case "user.created": {
				const { email_addresses, first_name, image_url, last_name, username } =
					evt.data;
				const user = {
					email: email_addresses[0].email_address,
					firstName: first_name,
					clerkId: id,
					image: image_url,
					lastName: last_name,
					username,
				};
				try {
					await connectToDatabase();
					await UserModel.create(user);
				} catch (err) {
					console.log("Error creating user: ", err);
				}
				break;
			}
			case "user.deleted":
				try {
					await connectToDatabase();
					await UserModel.findOneAndDelete({ clerkId: id });
				} catch (err) {
					console.log("Error deleting user: ", err);
				}
				break;
			case "user.updated":
				// Update user details
				break;
			default:
				console.warn(`Unhandled event type: ${eventType}`);
		}
		return new Response("Webhook received", { status: 200 });
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error verifying webhook", { status: 400 });
	}
}
