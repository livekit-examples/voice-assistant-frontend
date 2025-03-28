import useCombinedTranscriptions from "@/hooks/useCombinedTranscriptions";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {combinedTranscriptions.map((segment) => (
        <div
          key={segment.id}
          className={
            segment.role === "assistant"
              ? "p-2 self-start fit-content"
              : "bg-gray-800 rounded-md p-2 self-end fit-content"
          }
        >
          {segment.text}
        </div>
      ))}
    </div>
  );
}
