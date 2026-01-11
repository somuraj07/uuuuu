type BrandLogoProps = {
  isbrandLogoWhite?: boolean;
  size?: "navbar" | "auth";
};

export default function BrandLogo({
  isbrandLogoWhite = true,
  size = "navbar",
}: BrandLogoProps) {
  // Logo removed - replaced with text
  return (
    <div className={`flex items-center ${size === "auth" ? "h-12" : "h-10"}`}>
      <span className={`font-bold ${size === "auth" ? "text-2xl" : "text-xl"} bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent`}>
        School Portal
      </span>
    </div>
  );
}
