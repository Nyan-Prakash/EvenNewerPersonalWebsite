import InteractiveBackground from "@/components/InteractiveBackground";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InteractiveBackground lighter={true} />
      {children}
    </>
  );
}
