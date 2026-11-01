export const initialRoadmaps = [
  { id: 'linear-algebra', title: 'Linear Algebra', category: 'FOUNDATIONS', level: 'Beginner', icon: '▦', color: 'lavender', description: 'See the geometry hiding inside equations, transformations, and data.', topics: 12, hours: 18, learners: 2840, progress: 35, tags: ['Vectors', 'Matrices', 'Visual'], featured: true },
  { id: 'probability', title: 'Probability', category: 'CHANCE & UNCERTAINTY', level: 'Beginner', icon: '◌', color: 'peach', description: 'Get comfortable reasoning about randomness and the unexpected.', topics: 9, hours: 12, learners: 1960, progress: 0, tags: ['Chance', 'Games', 'Real life'] },
  { id: 'calculus', title: 'Calculus', category: 'CHANGE & MOTION', level: 'Intermediate', icon: '∫', color: 'mint', description: 'Understand how tiny changes add up to a much bigger picture.', topics: 16, hours: 24, learners: 3240, progress: 0, tags: ['Limits', 'Motion', 'Visual'] },
  { id: 'number-theory', title: 'Number Theory', category: 'PATTERNS & PROOFS', level: 'Beginner', icon: '∴', color: 'lemon', description: 'Find surprisingly rich patterns in the numbers you already know.', topics: 8, hours: 10, learners: 1580, progress: 0, tags: ['Primes', 'Puzzles', 'Patterns'] },
  { id: 'statistics', title: 'Statistics', category: 'DATA & DECISIONS', level: 'Intermediate', icon: '▥', color: 'blue', description: 'Turn messy data into clearer questions, stories, and decisions.', topics: 11, hours: 16, learners: 2130, progress: 0, tags: ['Data', 'Evidence', 'Visual'] },
  { id: 'discrete-math', title: 'Discrete Mathematics', category: 'LOGIC & STRUCTURE', level: 'Intermediate', icon: '⌘', color: 'pink', description: 'Explore the logic and structures that make computing possible.', topics: 10, hours: 14, learners: 1760, progress: 0, tags: ['Logic', 'Graphs', 'Computing'] },
];

export const resources = [
  { icon: '▶', type: 'WATCH', title: 'Essence of linear algebra', creator: '3Blue1Brown', duration: '12 min', color: 'lavender' },
  { icon: '↗', type: 'INTERACT', title: 'Vector projection explorer', creator: 'Math Is Fun', duration: '5 min', color: 'mint' },
  { icon: '✳', type: 'TRY IT', title: 'A surprisingly simple puzzle', creator: 'Community pick', duration: '10 min', color: 'lemon' },
];
