export const getScoreColorClass = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

export const getAnswerBadgeClass = (answer: string) => {
  if (answer === 'ans_3') return 'bg-green-100 text-green-800';
  if (answer === 'ans_2') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};
