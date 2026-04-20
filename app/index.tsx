import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function Entrada() {
  const completado = useOnboardingStore((s) => s.completado);
  return <Redirect href={completado ? '/(tabs)' : '/(onboarding)/welcome'} />;
}
