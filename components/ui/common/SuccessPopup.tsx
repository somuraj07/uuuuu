interface SuccessPopupProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
}

export default function SuccessPopup({
  open,
  title,
  description,
  onClose,
}: SuccessPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl px-10 py-8 w-[320px] text-center shadow-lg relative">
        {/* Check Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-lg font-semibold text-black mb-1">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}

        {/* Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: "#22c55e" }} // green-500
        >
          OK
        </button>
      </div>
    </div>
  );
}
