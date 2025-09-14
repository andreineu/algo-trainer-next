import { getProblems } from "@/lib/problems";
import ProblemsList from "@/components/ProblemsList";

export const revalidate = false;

export default function ProblemsPage() {
  const problems = getProblems();

  return <ProblemsList problems={problems} />;
}
