"use client";

interface Props {
  action: (fd: FormData) => Promise<void>;
  id: string;
  extraFields?: Record<string, string>;
  message?: string;
  className?: string;
  label?: string;
}

export function DeleteButton({
  action,
  id,
  extraFields,
  message = "정말 삭제하시겠습니까?",
  className = "text-xs text-stone-400 hover:text-red-700",
  label = "삭제",
}: Props) {
  return (
    <button
      type="button"
      className={className}
      style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", alignSelf: "flex-start" }}
      onClick={async () => {
        if (!confirm(message)) return;
        const fd = new FormData();
        fd.append("id", id);
        if (extraFields) {
          Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v));
        }
        await action(fd);
      }}
    >
      {label}
    </button>
  );
}
