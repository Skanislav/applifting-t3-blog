import { type RouterInputs } from "~/utils/api";
import { useForm } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import React, { type PropsWithChildren, useState } from "react";
import { Stack, TextInput } from "@mantine/core";
import { DashboardArticleFileInput } from "~/lib/components/dashboard/file-input";
import { RichEditor } from "~/pages/dashboard/rich-editor";

type ArticleFormProps = {
  article?: {
    image_url: string | null;
    title: string;
    content: string;
  };
  onSubmit: (data: RouterInputs["article"]["createNewArticle"]) => void;
};

export const ArticleForm = ({
  article,
  onSubmit,
  children,
}: PropsWithChildren & ArticleFormProps) => {
  const [base64String, setBase64String] = useState<string>("");

  const form = useForm<RouterInputs["article"]["createNewArticle"]>({
    initialValues: {
      ...article,
      title: article?.title || "",
      content: article?.content || "",
      image: article?.image_url || "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "This is placeholder" }),
    ],
    content: article?.content,
  });

  function handleSubmit(data: RouterInputs["article"]["createNewArticle"]) {
    onSubmit({
      title: data.title || "",
      content: editor?.getHTML() || "",
      image: base64String,
    });
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          withAsterisk
          label="Title"
          required
          placeholder="Some Title For The Article"
          {...form.getInputProps("title")}
        />

        <DashboardArticleFileInput
          onChange={setBase64String}
          value={base64String || article?.image_url}
        />

        <RichEditor editor={editor} />

        {children}
      </Stack>
    </form>
  );
};
