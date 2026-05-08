export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

export function formatTimeLeft(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Finalizada';
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  if (days > 0) return `${days} día${days > 1 ? 's' : ''} restante${days > 1 ? 's' : ''}`;
  return `${hours} hora${hours !== 1 ? 's' : ''} restante${hours !== 1 ? 's' : ''}`;
}

export function formatPct(count: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((count / total) * 100)}%`;
}

export const ANIMALS: Record<string, string> = {
  fox: '🦊', wolf: '🐺', bear: '🐻', owl: '🦉',
  eagle: '🦅', deer: '🦌', lion: '🦁', rabbit: '🐰',
  panda: '🐼', tiger: '🐯',
};
