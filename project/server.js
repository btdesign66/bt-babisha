const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsp = require("fs").promises;
const crypto = require("crypto");
const dotenv = require("dotenv");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = path.join(__dirname, "uploads");
const PUBLIC_DIR = path.join(__dirname, "public");
const OUTPUT_PATH = path.join(PUBLIC_DIR, "output.png");

// Static hosting for generated output + frontend files
app.use(express.static(PUBLIC_DIR));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Multer (disk) upload handling
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fsp.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const unique = crypto.randomBytes(12).toString("hex");
    cb(null, `upload-${Date.now()}-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
    if (allowed.has(file.mimetype)) return cb(null, true);
    return cb(new Error("Invalid image. Please upload JPG, PNG, or WebP."));
  },
});

const TRYON_PROMPT =
  "A realistic full-body image of the same person from the first image wearing the clothing from the second image. Preserve face, body shape, pose, and lighting. Replace only clothing. Ensure natural fit, realistic folds, and high quality photorealistic output.";

function decodeBase64ImageToBuffer(base64Data) {
  return Buffer.from(base64Data, "base64");
}

function extractGeneratedPngBufferFromGemini(result) {
  // The SDK returns a GenerateContentResult, where image outputs (when available)
  // often come back as inlineData inside response candidates.
  const parts = result?.response?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      const inline = part?.inlineData;
      if (inline?.data) {
        const mimeType = inline?.mimeType || "";
        if (mimeType.includes("png")) {
          return decodeBase64ImageToBuffer(inline.data);
        }
      }
    }
  }

  // Fallback: sometimes the model returns a data URL or base64 text.
  // Try to locate a base64 PNG in plain text.
  return null;
}

async function extractGeneratedPngBuffer(result) {
  const pngBuf = extractGeneratedPngBufferFromGemini(result);
  if (pngBuf) return pngBuf;

  // Last-resort fallback: parse base64 from text response.
  // (We intentionally keep it simple and only handle the common "data:image/png;base64,..." form.)
  let text = null;
  try {
    text = await result?.response?.text?.();
  } catch {
    // ignore
  }
  if (!text || typeof text !== "string") return null;

  const match = text.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;

  return decodeBase64ImageToBuffer(match[1]);
}

app.post("/generate", upload.fields([{ name: "userImage", maxCount: 1 }, { name: "dressImage", maxCount: 1 }]), async (req, res) => {
  const files = req.files || {};

  if (!files.userImage || !files.dressImage) {
    return res.status(400).json({
      success: false,
      message: "Missing files. Please upload both userImage and dressImage.",
    });
  }

  const userFile = files.userImage[0];
  const dressFile = files.dressImage[0];

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey.trim().length === 0 || apiKey.trim() === "your_api_key_here") {
    return res.status(500).json({
      success: false,
      message:
        "GOOGLE_API_KEY is missing or still the placeholder value. Update project/.env with your real Gemini API key and restart the server.",
    });
  }

  try {
    const userBase64 = (await fsp.readFile(userFile.path)).toString("base64");
    const dressBase64 = (await fsp.readFile(dressFile.path)).toString("base64");

    const userMimeType = userFile.mimetype || "image/jpeg";
    const dressMimeType = dressFile.mimetype || "image/jpeg";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Note: Gemini image generation support depends on the specific API capabilities.
    // We request PNG output via responseMimeType; if unavailable, we will return an error.
    const result = await model.generateContent({
      generationConfig: {
        responseMimeType: "image/png",
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: TRYON_PROMPT },
            { inlineData: { mimeType: userMimeType, data: userBase64 } },
            { inlineData: { mimeType: dressMimeType, data: dressBase64 } },
          ],
        },
      ],
    });

    const outputBuffer = await extractGeneratedPngBuffer(result);
    if (!outputBuffer) {
      return res.status(500).json({
        success: false,
        message:
          "Gemini did not return an image (PNG) in a supported format. Check the API capability and try again.",
      });
    }

    await fsp.writeFile(OUTPUT_PATH, outputBuffer);

    return res.json({
      success: true,
      imageUrl: `/output.png?ts=${Date.now()}`, // cache-bust
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate try-on image.",
    });
  } finally {
    // Cleanup uploaded temp files
    await Promise.allSettled([userFile?.path, dressFile?.path].filter(Boolean).map((p) => fsp.unlink(p)));
  }
});

// Multer + general error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Bad request.",
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`AI Virtual Try-On listening on http://localhost:${PORT}`);
  console.log(`Uploads: ${UPLOAD_DIR}`);
  console.log(`Outputs: ${PUBLIC_DIR}`);
});

