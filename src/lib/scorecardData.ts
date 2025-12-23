// // // export const categoryNames = {
// // //   'de': 'Detect',
// // //   'go': 'Governance',
// // //   'id': 'Identify',
// // //   'pr': 'Protect',
// // //   're': 'Recover',
// // //   'rs': 'Respond'
// // // };

// // // export const answerScores = {
// // //   'ans_1': 1,
// // //   'ans_2': 2,
// // //   'ans_3': 3
// // // };

// // // export type CategoryData = Record<string, Record<string, string>>;
// // // export type HistoricalData = { date: string; data: CategoryData }[];
// // // export type CategoryScores = Record<string, { score: number; percentage: number; maxScore: number }>;
// // // export type ComparisonData = Record<string, { current: string; previous: string; change: string }>;

// // // export const calculateCategoryScores = (data: CategoryData): CategoryScores => {
// // //   const scores: CategoryScores = {};

// // //   Object.keys(data).forEach(category => {
// // //     const questions = data[category];
// // //     let totalScore = 0;
// // //     let maxPossibleScore = Object.keys(questions).length * 3;

// // //     Object.values(questions).forEach(answer => {
// // //       totalScore += answerScores[answer];
// // //     });

// // //     scores[category] = {
// // //       score: totalScore,
// // //       percentage: (totalScore / maxPossibleScore) * 100,
// // //       maxScore: maxPossibleScore
// // //     };
// // //   });

// // //   return scores;
// // // };

// // // export const calculateOverallScore = (categoryScores: CategoryScores) => {
// // //   let totalScore = 0;
// // //   let maxPossibleScore = 0;

// // //   Object.values(categoryScores).forEach(category => {
// // //     totalScore += category.score;
// // //     maxPossibleScore += category.maxScore;
// // //   });

// // //   return {
// // //     score: totalScore,
// // //     percentage: (totalScore / maxPossibleScore) * 100,
// // //     maxScore: maxPossibleScore
// // //   };
// // // };

// // // export const generateRandomScores = (): CategoryData => {
// // //   const result: CategoryData = {};

// // //   for (const category in rawData) {
// // //     result[category] = {};
// // //     for (const question in rawData[category]) {
// // //       const randomAnswer = `ans_${Math.floor(Math.random() * 3) + 1}`;
// // //       result[category][question] = randomAnswer;
// // //     }
// // //   }

// // //   return result;
// // // };

// // // export const getCategoryColor = (category: string) => {
// // //   const colors = {
// // //     'de': '#3498db',
// // //     'go': '#9b59b6',
// // //     'id': '#2ecc71',
// // //     'pr': '#f1c40f',
// // //     're': '#e74c3c',
// // //     'rs': '#1abc9c'
// // //   };
// // //   return colors[category] || '#000000';
// // // };

// // export const categoryNames = { 'de': 'Detect', 'go': 'Governance', 'id': 'Identify', 'pr': 'Protect', 're': 'Recover', 'rs': 'Respond' };
// // export const answerScores = { 'ans_1': 1, 'ans_2': 2, 'ans_3': 3, 'ans_4': 4 };
// // export type CategoryData = Record<string, Record<string, string>>;
// // export type HistoricalData = { date: string; data: CategoryData }[];
// // export type CategoryScores = Record<string, { score: number; percentage: number; maxScore: number }>;
// // export type ComparisonData = Record<string, { current: string; previous: string; change: string }>;

// // export const calculateCategoryScores = (data: CategoryData): CategoryScores => {
// //   const scores: CategoryScores = {};
// //   Object.keys(data).forEach(category => {
// //     const questions = data[category];
// //     let totalScore = 0;
// //     let maxPossibleScore = Object.keys(questions).length * 4;
// //     Object.values(questions).forEach(answer => {
// //       totalScore += answerScores[answer] || 0;
// //     });
// //     scores[category] = {
// //       score: totalScore,
// //       percentage: (totalScore / maxPossibleScore) * 100,
// //       maxScore: maxPossibleScore
// //     };
// //   });
// //   return scores;
// // };

// // export const calculateOverallScore = (categoryScores: CategoryScores) => {
// //   let totalScore = 0;
// //   let maxPossibleScore = 0;
// //   Object.values(categoryScores).forEach(category => {
// //     totalScore += category.score;
// //     maxPossibleScore += category.maxScore;
// //   });
// //   return { score: totalScore, percentage: (totalScore / maxPossibleScore) * 100, maxScore: maxPossibleScore };
// // };

// // export const getCategoryColor = (category: string) => {
// //   const colors = { 'de': '#3498db', 'go': '#9b59b6', 'id': '#2ecc71', 'pr': '#f1c40f', 're': '#e74c3c', 'rs': '#1abc9c' };
// //   return colors[category] || '#000000';
// // };

// // export const categoryNames = {
// //   'de': 'Detect',
// //   'go': 'Governance',
// //   'id': 'Identify',
// //   'pr': 'Protect',
// //   're': 'Recover',
// //   'rs': 'Respond'
// // };

// // // Define the possible answer keys as a union type
// // type AnswerKey = 'ans_1' | 'ans_2' | 'ans_3' | 'ans_4';
// // export const answerScores: Record<AnswerKey, number> = {
// //   'ans_1': 1,
// //   'ans_2': 2,
// //   'ans_3': 3,
// //   'ans_4': 4
// // };

// // export type CategoryData = Record<string, Record<string, string>>;
// // export type HistoricalData = { date: string; data: CategoryData }[];
// // export type CategoryScores = Record<string, { score: number; percentage: number; maxScore: number }>;
// // export type ComparisonData = Record<string, { current: string; previous: string; change: string }>;

// // export const calculateCategoryScores = (data: CategoryData): CategoryScores => {
// //   const scores: CategoryScores = {};
// //   Object.keys(data).forEach(category => {
// //     const questions = data[category];
// //     let totalScore = 0;
// //     let maxPossibleScore = Object.keys(questions).length * 4;
// //     Object.values(questions).forEach(answer => {
// //       totalScore += answerScores[answer as AnswerKey] || 0;
// //     });
// //     scores[category] = {
// //       score: totalScore,
// //       percentage: (totalScore / maxPossibleScore) * 100,
// //       maxScore: maxPossibleScore
// //     };
// //   });
// //   return scores;
// // };

// // export const calculateOverallScore = (categoryScores: CategoryScores) => {
// //   let totalScore = 0;
// //   let maxPossibleScore = 0;
// //   Object.values(categoryScores).forEach(category => {
// //     totalScore += category.score;
// //     maxPossibleScore += category.maxScore;
// //   });
// //   return { score: totalScore, percentage: (totalScore / maxPossibleScore) * 100, maxScore: maxPossibleScore };
// // };

// // // Define the category keys as a union type
// // type CategoryKey = 'de' | 'go' | 'id' | 'pr' | 're' | 'rs';
// // export const getCategoryColor = (category: string): string => {
// //   const colors: Record<CategoryKey, string> = {
// //     'de': '#3498db',
// //     'go': '#9b59b6',
// //     'id': '#2ecc71',
// //     'pr': '#f1c40f',
// //     're': '#e74c3c',
// //     'rs': '#1abc9c'
// //   };
// //   return colors[category as CategoryKey] || '#000000';
// // };

// // scorecardData.ts
// export const categoryNames = {
//   'de': 'Detect',
//   'go': 'Governance',
//   'id': 'Identify',
//   'pr': 'Protect',
//   're': 'Recover',
//   'rs': 'Respond'
// };

// type AnswerKey = 'ans_1' | 'ans_2' | 'ans_3' | 'ans_4';
// export const answerScores: Record<AnswerKey, number> = {
//   'ans_1': 1,
//   'ans_2': 2,
//   'ans_3': 3,
//   'ans_4': 4
// };

// export type CategoryData = Record<string, Record<string, string>>;
// export type HistoricalData = { date: string; data: CategoryData }[];
// export type CategoryScores = Record<string, { score: number; percentage: number; maxScore: number }>;
// export type ComparisonData = Record<string, { current: string; previous: string; change: string }>;

// // export const calculateCategoryScores = (data: CategoryData): CategoryScores => {
// //   const scores: CategoryScores = {};
// //   Object.keys(data).forEach(category => {
// //     const questions = data[category];
// //     let totalScore = 0;
// //     let maxPossibleScore = Object.keys(questions).length * 4;
// //     Object.values(questions).forEach(answer => {
// //       totalScore += answerScores[answer as AnswerKey] || 0;
// //     });
// //     scores[category] = {
// //       score: totalScore,
// //       percentage: (totalScore / maxPossibleScore) * 100,
// //       maxScore: maxPossibleScore
// //     };
// //   });
// //   return scores;
// // };

// // export const calculateOverallScore = (categoryScores: CategoryScores) => {
// //   let totalScore = 0;
// //   let maxPossibleScore = 0;
// //   Object.values(categoryScores).forEach(category => {
// //     totalScore += category.score;
// //     maxPossibleScore += category.maxScore;
// //   });
// //   return { score: totalScore, percentage: (totalScore / maxPossibleScore) * 100, maxScore: maxPossibleScore };
// // };

// export function calculateCategoryScores(score: Record<string, Record<string, string>>, questions: any[]) {
//   const categoryScores: CategoryScores = {};
//   const categoryQuestionCounts = { id: 0, pr: 0, de: 0, rs: 0, re: 0, go: 0 };

//   // Count questions per category
//   questions.forEach((question) => {
//     const code = question.code.split('.')[0].toLowerCase(); // e.g., "ID" -> "id"
//     if (categoryQuestionCounts[code] !== undefined) {
//       categoryQuestionCounts[code]++;
//     }
//   });

//   // Calculate scores per category
//   Object.keys(categoryQuestionCounts).forEach((category) => {
//     let catScore = 0;
//     const maxScore = categoryQuestionCounts[category];

//     if (score[category]) {
//       catScore = Object.values(score[category]).filter(
//         (answer) => answer === 'ans_1'
//       ).length;
//     }

//     categoryScores[category] = {
//       score: catScore,
//       percentage: maxScore > 0 ? (catScore / maxScore) * 100 : 0,
//       maxScore,
//     };
//   });

//   return categoryScores;
// }

// export function calculateOverallScore(categoryScores: CategoryScores, totalQuestions: number = 103) {
//   let score = 0;
//   const maxScore = totalQuestions; // Use 103 questions from questions.length

//   // Sum scores from categoryScores
//   Object.values(categoryScores).forEach((cat) => {
//     score += cat.score; // Assumes cat.score is the count of ans_1
//   });

//   const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

//   return {
//     score, // e.g., 29
//     percentage, // e.g., 28.155339805825242
//     maxScore, // 103
//   };
// }

// // Export CategoryKey
// export type CategoryKey = 'de' | 'go' | 'id' | 'pr' | 're' | 'rs';

// export const getCategoryColor = (category: string): string => {
//   const colors: Record<CategoryKey, string> = {
//     'de': '#3498db',
//     'go': '#9b59b6',
//     'id': '#2ecc71',
//     'pr': '#f1c40f',
//     're': '#e74c3c',
//     'rs': '#1abc9c'
//   };
//   return colors[category as CategoryKey] || '#000000';
// };

export const categoryNames: Record<CategoryKey, string> = {
  de: 'Detect',
  go: 'Governance',
  id: 'Identify',
  pr: 'Protect',
  re: 'Recover',
  rs: 'Respond',
};

type AnswerKey = 'ans_1' | 'ans_2' | 'ans_3' | 'ans_4';
export const answerScores: Record<AnswerKey, number> = {
  ans_1: 1, // Yes
  ans_2: 0, // No
  ans_3: 0, // Not Applicable
  ans_4: 0, // Not Sure
};

export type CategoryData = Record<string, Record<string, string>>;
export type HistoricalData = { date: string; data: CategoryData }[];
export type CategoryScores = Record<
  string,
  { score: number; percentage: number; maxScore: number }
>;
export type ComparisonData = Record<
  string,
  { current: string; previous: string; change: string }
>;
export type CategoryKey = 'de' | 'go' | 'id' | 'pr' | 're' | 'rs';

interface Question {
  code: string;
  description?: string;
}

// export function calculateCategoryScores(
//   score: CategoryData,
//   questions: Question[] | undefined
// ): CategoryScores {
//   const categoryScores: CategoryScores = {};
//   const categoryQuestionCounts: Record<CategoryKey, number> = {
//     id: 0,
//     pr: 0,
//     de: 0,
//     rs: 0,
//     re: 0,
//     go: 0,
//   };

//   // Initialize categoryScores for all categories
//   Object.keys(categoryQuestionCounts).forEach((category) => {
//     categoryScores[category] = {
//       score: 0,
//       percentage: 0,
//       maxScore: 0,
//     };
//   });

//   // Count questions per category
//   if (Array.isArray(questions)) {
//     questions.forEach((question) => {
//       const code = question.code.split('.')[0].toLowerCase() as CategoryKey;
//       if (categoryQuestionCounts[code] !== undefined) {
//         categoryQuestionCounts[code]++;
//       }
//     });
//     console.log('Category question counts:', categoryQuestionCounts);
//   } else {
//     console.warn('Questions array is undefined or not an array');
//   }

//   // Calculate scores per category
//   Object.keys(categoryQuestionCounts).forEach((category) => {
//     const maxScore = categoryQuestionCounts[category as CategoryKey];
//     let catScore = 0;

//     if (score[category]) {
//       catScore = Object.values(score[category]).reduce((sum, answer) => {
//         return sum + (answerScores[answer as AnswerKey] || 0);
//       }, 0);
//     }

//     categoryScores[category as CategoryKey] = {
//       score: catScore,
//       percentage: maxScore > 0 ? (catScore / maxScore) * 100 : 0,
//       maxScore,
//     };
//   });

//   console.log('Calculated categoryScores:', categoryScores);
//   return categoryScores;
// }

export function calculateCategoryScores(
  score: CategoryData,
  questions: Question[] | undefined
): CategoryScores {
  const categoryScores: CategoryScores = {};
  const categoryQuestionCounts: Record<CategoryKey, number> = {
    id: 0,
    pr: 0,
    de: 0,
    rs: 0,
    re: 0,
    go: 0,
  };

  // Initialize categoryScores for all categories
  Object.keys(categoryQuestionCounts).forEach((category) => {
    categoryScores[category] = {
      score: 0,
      percentage: 0,
      maxScore: 0,
    };
  });

  // Map question code prefixes to CategoryKey
  const categoryMap: Record<string, CategoryKey> = {
    gv: 'go',
    rc: 're',
    de: 'de',
    id: 'id',
    pr: 'pr',
    rs: 'rs',
  };

  // Count questions per category
  if (Array.isArray(questions)) {
    questions.forEach((question) => {
      const code = question.code.split('.')[0].toLowerCase();
      const category = categoryMap[code] || (code as CategoryKey);
      if (categoryQuestionCounts[category] !== undefined) {
        categoryQuestionCounts[category]++;
      }
    });
    console.log('Category question counts:', categoryQuestionCounts);
  } else {
    console.warn('Questions array is undefined or not an array');
  }

  // Calculate scores per category
  Object.keys(categoryQuestionCounts).forEach((category) => {
    const maxScore = categoryQuestionCounts[category as CategoryKey];
    let catScore = 0;

    if (score[category]) {
      catScore = Object.values(score[category]).reduce((sum, answer) => {
        return sum + (answerScores[answer as AnswerKey] || 0);
      }, 0);
    }

    categoryScores[category as CategoryKey] = {
      score: catScore,
      percentage: maxScore > 0 ? (catScore / maxScore) * 100 : 0,
      maxScore,
    };
  });

  console.log('Calculated categoryScores:', categoryScores);
  return categoryScores;
}

export function calculateOverallScore(categoryScores: CategoryScores): {
  score: number;
  percentage: number;
  maxScore: number;
} {
  let score = 0;
  let maxScore = 0;

  // Sum scores from categoryScores
  Object.values(categoryScores).forEach((cat) => {
    score += cat.score;
    maxScore += cat.maxScore;
  });

  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return {
    score,
    percentage,
    maxScore,
  };
}

export const getCategoryColor = (category: string): string => {
  const colors: Record<CategoryKey, string> = {
    de: '#3498db',
    go: '#9b59b6',
    id: '#2ecc71',
    pr: '#f1c40f',
    re: '#e74c3c',
    rs: '#1abc9c',
  };
  return colors[category as CategoryKey] || '#000000';
};
