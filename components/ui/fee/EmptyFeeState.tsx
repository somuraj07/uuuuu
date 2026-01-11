import AnimatedCard from "../common/AnimatedCard";

export default function EmptyFeeState() {
  return (
    <AnimatedCard>
      <div className="p-8 text-center text-muted-foreground">
        Please select a class to view fee payment details
      </div>
    </AnimatedCard>
  );
}
