import { Button, Divider, FileInput, Group, Stack } from "@mantine/core";
import React, { useMemo, useRef } from "react";

type DashboardArticleFileInputProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  onUploadNew?: () => void;
  onRemove?: () => void;
};

export function DashboardArticleFileInput({
  value,
  onChange,
}: DashboardArticleFileInputProps) {
  const resetRef = useRef<HTMLButtonElement | null>(null);

  function handleUploadNew() {
    onChange(null);
    resetRef.current?.click();
  }

  const image = useMemo(() => {
    return value ? URL.createObjectURL(value) : "";
  }, [value]);

  return (
    <Stack>
      {!value && (
        <FileInput
          ref={resetRef}
          placeholder={"Upload image"}
          value={value}
          onChange={onChange}
          accept="image/png,image/jpeg"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img width={150} height={100} src={image} alt="preview" />}

      <Group>
        <Button onClick={handleUploadNew}>Upload new</Button>
        <Divider mih={5} />
        <Button onClick={handleUploadNew}>Delete</Button>
      </Group>
    </Stack>
  );
}
