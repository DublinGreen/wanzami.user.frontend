<template>
  <div>
    <input type="file" @change="uploadFile" />
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store/index.js"

const GRAPHQL_ENDPOINT = store.state.tokenRequiredBackendUrl;

export default {
  methods: {
    async uploadFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const presignedUrl = "https://s3.eu-north-1.amazonaws.com/wanzami.tv.bucket/wanzami.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250314T211803Z&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Expires=300&X-Amz-Credential=AKIA45Y2R2BSO5W52OM5%2F20250314%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=c93095327b9ce1f73968c6b2dcad118fd5eb1709a19e3b964364b22538087656";
        
        // 2. Upload the file to S3 using the pre-signed URL
        await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type },
        });

        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Upload failed", error);
        alert("Upload failed");
      }

    },
  },
};
</script>