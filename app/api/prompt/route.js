import { connectToDB } from "@utils/database";
import Prompt from "@model/prompt";

export const GET = async (request) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Failed to fetch all prompts" }),
      { status: 500 }
    );
  }
};
