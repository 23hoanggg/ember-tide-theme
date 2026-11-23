import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

type Props = { maxFiles?: number; onDone: (ids: string[]) => void };

export function UploadForm({ maxFiles = 5, onDone }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const uploadMutation = useMutation({
    mutationFn: (list: File[]) => api.upload(list),
    onSuccess: (res) => onDone(res.ids),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) return;
    uploadMutation.mutate(files);
    event.currentTarget.reset();
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <input type="file" multiple accept=".pdf" onChange={(e) => setFiles([...(e.target.files ?? [])].slice(0, maxFiles))} />
      <button disabled={uploadMutation.isPending}>Upload {files.length} file(s)</button>
    </form>
  );
}
