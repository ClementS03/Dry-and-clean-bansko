import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const PROMPTS: Record<string, string> = {
  canape:   "clean spotless sofa, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  fauteuil: "clean spotless armchair, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  matelas:  "clean spotless mattress, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  kilim:    "clean spotless rug, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
};

const NEGATIVE = "stains, dirt, damage, wrinkles, dark spots, discoloration, blurry, low quality";

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    console.error("[simulate] FAL_KEY not configured");
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }

  let body: { image?: string; type?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  // Honeypot — bot filled the hidden field
  if (body.website) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  const { image, type } = body;

  if (!image || !type || !PROMPTS[type]) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  // Validate base64 data URL format
  const match = image.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  const [, mime, b64] = match;

  if (!ALLOWED_MIME.includes(mime)) {
    return NextResponse.json({ error: "invalidFormat" }, { status: 400 });
  }

  // Approximate byte size from base64 length
  const approxBytes = (b64.length * 3) / 4;
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ error: "tooLarge" }, { status: 400 });
  }

  fal.config({ credentials: process.env.FAL_KEY });

  try {
    // Cast input to unknown to allow extra fields (negative_prompt) not in SDK types
    const falInput = {
      image_url: image,
      prompt: PROMPTS[type],
      negative_prompt: NEGATIVE,
      strength: 0.5,
      num_inference_steps: 28,
      guidance_scale: 3.5,
    };
    const result = await fal.run("fal-ai/flux/dev/image-to-image", {
      input: falInput as unknown as Parameters<typeof fal.run<"fal-ai/flux/dev/image-to-image">>[1]["input"],
    }) as unknown as { images: Array<{ url: string }> };

    const url = result?.images?.[0]?.url;
    if (!url) {
      return NextResponse.json({ error: "generic" }, { status: 503 });
    }

    return NextResponse.json({ resultUrl: url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("429")) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }
    console.error("[simulate] fal.ai error:", msg);
    return NextResponse.json({ error: "generic" }, { status: 503 });
  }
}
