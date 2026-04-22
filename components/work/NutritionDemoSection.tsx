import LiveDemoFrame from '@/components/ui/LiveDemoFrame';
import NutritionAssistantDemo from '@/demos/ai-nutrition-assistant';

export default function NutritionDemoSection() {
  return (
    <LiveDemoFrame title="AI Nutrition Assistant">
      <NutritionAssistantDemo />
    </LiveDemoFrame>
  );
}
