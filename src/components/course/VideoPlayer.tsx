interface Props {
  title?: string;
  embedUrl?: string | null;
}

export function VideoPlayer({ title, embedUrl }: Props) {
  if (!embedUrl) return null;
  return (
    <>
      {title && (
        <h3 className="text-lg font-semibold text-white mt-8 mb-3">{title}</h3>
      )}
      <div className="aspect-video w-full my-6 rounded-lg overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={title ?? "Course video"}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
    </>
  );
}
