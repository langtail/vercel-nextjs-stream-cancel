export const maxDuration = 10;

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "start" })}\n\n`)
      );
      // Keep the connection alive with a heartbeat every 3 seconds
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "ping" })}\n\n`)
        );
      }
    },
    async cancel() {
      console.log("Connection cancelled - stream.cancel()");
    },
  });

  req.signal.addEventListener("abort", async () => {
    console.log("Request aborted - req.signal.addEventListener('abort')");
  });

  req.signal.onabort = async () => {
    console.log("Request aborted - req.signal.onabort");
  };

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
