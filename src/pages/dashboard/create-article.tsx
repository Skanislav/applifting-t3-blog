import React, { useEffect } from "react";
import { Button, Container, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api, type RouterOutputs } from "~/utils/api";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { RichTextEditor } from "@mantine/tiptap";
import { DashboardArticleFileInput } from "~/lib/components/dashboard/file-input";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function CreateArticlePage() {
  const router = useRouter();
  const [file, setFile] = React.useState<File | null>(null);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      image: null,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "This is placeholder" }),
    ],
    content: "",
  });

  const createArticle = api.article.createNewArticle.useMutation();

  const handleSubmit = ({
    title,
  }: Pick<
    RouterOutputs["article"]["createNewArticle"],
    "title" | "content"
  >) => {
    const content = editor?.getHTML();
    if (!file || !content?.length || !title) {
      notifications.show({
        title: "Error",
        message: "Please fill all fields",
        variant: "error",
      });

      return;
    }

    createArticle.mutate({ title, content, image: URL.createObjectURL(file) });
  };

  useEffect(() => {
    if (createArticle.status !== "success") return;
    notifications.show({
      title: "Success",
      message: "Article created",
      variant: "success",
    });
    router.push(`/dashboard`);
  }, [createArticle.status, router]);

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            withAsterisk
            label="Title"
            required
            placeholder="Some Title For The Article"
            {...form.getInputProps("title")}
          />

          <DashboardArticleFileInput onChange={setFile} value={file} />

          <RichTextEditor editor={editor}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
          </RichTextEditor>

          {createArticle.error && (
            <p>Something went wrong! {createArticle.error.message}</p>
          )}

          <Button disabled={createArticle.isLoading} type={"submit"}>
            Create
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
