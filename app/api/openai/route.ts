import openai from "@/lib/openai";

const handler = async (request: Request) => {
  console.log("request: " + request.body);
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: "Say this is a test",
        },
      ],
    });

    const responseText = res.choices[0];

    return Response.json(responseText);
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { handler as GET, handler as POST };
