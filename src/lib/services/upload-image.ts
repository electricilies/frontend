import { toast } from "sonner";

interface PresignedUrlResponse {
  url: string;
  key: string;
}

export const uploadImageToMinio = async (file: File, token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products/images/upload-url`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to get upload URL");
  }
  const data: PresignedUrlResponse = await res.json();
  const uploadRes = await fetch(data.url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!uploadRes.ok) {
    toast.error("Failed to upload image");
    throw new Error("Failed to upload image to storage");
  }
  return {
    key: data.key,
    url: data.url.split("?")[0],
  };
};
