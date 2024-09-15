// @ts-nocheck
"use client";

import Script from "next/script";

export default function BotPreview() {
  return (
    <div>
      <chat-bot-invouge agent-id="8ff34b37-2a3f-460d-a73f-2d1557fde7e1"></chat-bot-invouge>
      <Script
        async={true}
        onLoad={() => {
          console.log("script loaded successfully");
        }}
        src="https://cdn.jsdelivr.net/gh/krakenftw/invouge-bot@latest/m.js"
      />
    </div>
  );
}
