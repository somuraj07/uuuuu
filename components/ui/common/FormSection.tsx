interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="font-medium text-lg mb-4">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
export default FormSection;