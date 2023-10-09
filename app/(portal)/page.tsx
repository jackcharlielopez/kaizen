import Link from "next/link";

export default function Learning() {
  return (
    <div>
      Pick which profile to begin
      <Link href="@parent/1">Parent</Link>
      <Link href="@student/1">Parent</Link>
    </div>
  );
}
