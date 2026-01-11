export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 space-y-6 bg-[#f8fafc] min-h-screen">
      {children}
    </div>
  );
}
