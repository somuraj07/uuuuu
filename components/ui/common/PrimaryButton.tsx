import { MAIN_COLOR } from "@/constants/colors";
import { motion } from "framer-motion";

interface ButtonProps {
  title: string;
  loading?: boolean;
}

export default function PrimaryButton({ title, loading }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading}
      type="submit"
      className="w-full text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
      style={styles}
    >
      {loading ? "Logging in..." : title}
    </motion.button>
  );
}

const styles = {
    backgroundColor: MAIN_COLOR,
    color: "#FFFFFF",
};