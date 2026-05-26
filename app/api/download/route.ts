import { NextRequest, NextResponse } from "next/server";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const quality = searchParams.get("quality") ?? "1080";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const height = quality ?? "1080";
    const formatFilter = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`;

    // Obtener el título para el nombre del archivo
    let filename = "kicksaver_video.mp4";
    try {
      const { stdout } = await execAsync(`yt-dlp --get-title "${url}"`);
      const title = stdout.trim().replace(/[^a-zA-Z0-9_\-\s]/g, "").trim().substring(0, 50);
      if (title) filename = `${title}_${height}p.mp4`;
    } catch {
      // usar nombre por defecto
    }

    // Stream del video directo al cliente
    const ytdlp = spawn("yt-dlp", [
      "-f", formatFilter,
      "-o", "-",
      "--merge-output-format", "mp4",
      url,
    ]);

    const stream = new ReadableStream({
      start(controller) {
        ytdlp.stdout.on("data", (chunk) => controller.enqueue(chunk));
        ytdlp.stdout.on("end", () => controller.close());
        ytdlp.stderr.on("data", (d) => console.error("yt-dlp:", d.toString()));
        ytdlp.on("error", (err) => controller.error(err));
      },
      cancel() {
        ytdlp.kill();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("yt-dlp error:", error);
    return NextResponse.json({ error: "Failed to process URL" }, { status: 500 });
  }
}