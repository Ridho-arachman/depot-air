import { YStack, H2 } from "tamagui";
import { WebView } from "react-native-webview";
import { useState } from "react";
import { homeAssets } from "@/constants/homeAssets";

export function LocationSection() {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <YStack mt="$6" gap="$4">
      <H2 fontSize="$9" fontWeight="bold">
        Lokasi
      </H2>
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        allowsInlineMediaPlayback
        automaticallyAdjustContentInsets={false}
        mixedContentMode="always"
        onTouchStart={() => setScrollEnabled(false)}
        onTouchEnd={() => setScrollEnabled(true)}
        onTouchCancel={() => setScrollEnabled(true)}
        style={{
          borderRadius: 10,
          width: "100%",
          height: 300,
          overflow: "hidden",
        }}
        source={{
          html: `
            <div style="pointer-events: none;">
              <iframe
                src=${homeAssets.urlMap}
                style="pointer-events: auto; width:100%; height:100%; border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          `,
        }}
      />
    </YStack>
  );
}
