import { Button, Divider, FileInput, Group, Stack } from "@mantine/core";
import React, { useRef } from "react";

type DashboardArticleFileInputProps = {
  /**
   * base64 encoded image
   */
  value?: string | null;
  onChange: (stringEncodedImage: string) => void;
  onUploadNew?: () => void;
  onRemove?: () => void;
  imageUrl?: string | null;
};

export function DashboardArticleFileInput({
  value,
  onChange,
}: DashboardArticleFileInputProps) {
  const resetRef = useRef<HTMLButtonElement | null>(null);
  const [file, setFile] = React.useState<File | null>(null);

  function handleUploadNew() {
    onChange("");
    setFile(null);
    resetRef.current?.click();
  }

  const handleFileChange = (file: File) => {
    if (file) {
      setFile(file);
      fileToBase64(file)
        .then((result) => {
          if (result) {
            onChange(result.toString());
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Stack>
      <FileInput
        style={{ display: !!value ? "none" : "block" }}
        ref={resetRef}
        placeholder={"Upload image"}
        value={file}
        onChange={handleFileChange}
        accept="image/png,image/jpeg"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && (
        <>
          <img width={150} height={100} src={value} alt="preview" />

          <Group>
            <Button onClick={handleUploadNew}>Upload new</Button>
            <Divider mih={5} />
            <Button onClick={handleUploadNew}>Delete</Button>
          </Group>
        </>
      )}
    </Stack>
  );
}
