import { Lesson } from '@/types/lesson';

export const SAMPLE_LESSONS: Record<string, Lesson> = {
  'binary-search': {
    id: 'sample-binary-search',
    topic: 'Binary Search Algorithm',
    title: 'Mastering Binary Search: Divide and Conquer',
    overview: 'Learn how binary search finds target elements in logarithmic O(log N) time by repeatedly halving the search space of a sorted array.',
    totalDuration: 110,
    scenes: [
      {
        id: 1,
        title: 'The Search Problem & Setup',
        duration: 18,
        narration: 'Welcome to this whiteboard session on Binary Search. Imagine we are looking for the number 23 inside a sorted array of eight numbers. Linear search would check one by one, taking up to eight steps. Binary search does it in just three.',
        keyConcept: 'Binary search requires a sorted array to eliminate half the remaining elements at each step.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Binary Search: Finding 23', fontSize: 26, color: '#3b82f6', y: 40 },
          { type: 'text', timeOffset: 1, text: 'Target value: 23 in a sorted array of 8 elements', fontSize: 16, color: '#64748b', y: 75 },
          {
            type: 'array',
            timeOffset: 3,
            x: 80,
            y: 140,
            arrayValues: [2, 5, 8, 12, 16, 23, 38, 56],
            activeIndices: [0, 1, 2, 3, 4, 5, 6, 7],
            pointers: [
              { index: 0, label: 'L (0)', color: '#10b981', position: 'bottom' },
              { index: 7, label: 'R (7)', color: '#ef4444', position: 'bottom' }
            ]
          },
          { type: 'badge', timeOffset: 7, text: 'Sorted: Ascending Order', bgColor: '#dbeafe', textColor: '#1e40af', x: 80, y: 250 },
          { type: 'text', timeOffset: 10, text: 'Linear Search: O(N) worst case', fontSize: 14, color: '#94a3b8', x: 80, y: 290 },
          { type: 'text', timeOffset: 12, text: 'Binary Search: O(log N) worst case', fontSize: 14, color: '#10b981', bold: true, x: 80, y: 315 }
        ]
      },
      {
        id: 2,
        title: 'Step 1: Calculate the Midpoint',
        duration: 22,
        narration: 'We maintain two pointers: Left at index 0 and Right at index 7. We calculate Mid as Left plus Right divided by 2, which gives index 3. The value at index 3 is 12. Since our target 23 is greater than 12, the target cannot be in the left half!',
        keyConcept: 'Compare target with array[mid]. Since 23 > 12, discard the entire left half.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 1: Find Midpoint & Compare', fontSize: 24, color: '#2563eb', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'mid = floor((0 + 7) / 2) = 3',
            subtext: 'Value at index 3 is 12',
            x: 80,
            y: 90
          },
          {
            type: 'array',
            timeOffset: 5,
            x: 80,
            y: 170,
            arrayValues: [2, 5, 8, 12, 16, 23, 38, 56],
            activeIndices: [0, 1, 2, 3, 4, 5, 6, 7],
            pointers: [
              { index: 0, label: 'L', color: '#10b981', position: 'bottom' },
              { index: 3, label: 'MID (12)', color: '#f59e0b', position: 'top' },
              { index: 7, label: 'R', color: '#ef4444', position: 'bottom' }
            ]
          },
          { type: 'box', timeOffset: 9, x: 70, y: 160, width: 230, height: 80, stroke: '#ef4444', dashed: true, strokeWidth: 2 },
          { type: 'badge', timeOffset: 12, text: '23 > 12: Discard Left Half!', bgColor: '#fee2e2', textColor: '#b91c1c', x: 80, y: 275 },
          { type: 'arrow', timeOffset: 15, fromX: 250, fromY: 310, toX: 380, toY: 310, label: 'Move L -> mid + 1 (index 4)', color: '#3b82f6' }
        ]
      },
      {
        id: 3,
        title: 'Step 2: Narrow Search to Right Half',
        duration: 24,
        narration: 'Now Left moves to mid plus one, which is index 4. The active search space is now indices 4 through 7. We compute the new Mid: 4 plus 7 divided by 2 is index 5. Look at index 5: the value is 23! We have directly matched our target.',
        keyConcept: 'L is now 4, R is 7. New mid is 5. array[5] equals 23 — TARGET FOUND!',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 2: Narrow to Indices 4-7', fontSize: 24, color: '#10b981', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'new mid = floor((4 + 7) / 2) = 5',
            subtext: 'Value at index 5 is 23',
            x: 80,
            y: 90
          },
          {
            type: 'array',
            timeOffset: 6,
            x: 80,
            y: 170,
            arrayValues: [2, 5, 8, 12, 16, 23, 38, 56],
            activeIndices: [4, 5, 6, 7],
            pointers: [
              { index: 4, label: 'L (4)', color: '#10b981', position: 'bottom' },
              { index: 5, label: 'MID: 23 = TARGET!', color: '#10b981', position: 'top' },
              { index: 7, label: 'R (7)', color: '#ef4444', position: 'bottom' }
            ]
          },
          { type: 'highlight', timeOffset: 11, x: 380, y: 160, width: 70, height: 70, color: '#10b981' },
          { type: 'icon', timeOffset: 14, iconType: 'check', x: 415, y: 130, color: '#10b981' },
          { type: 'badge', timeOffset: 16, text: 'Match Found at Index 5 in just 2 comparisons!', bgColor: '#dcfce7', textColor: '#15803d', x: 80, y: 275 }
        ]
      },
      {
        id: 4,
        title: 'Time & Space Complexity Summary',
        duration: 26,
        narration: 'Notice how powerful this is. Even if we had one million sorted elements, binary search would find any element in at most 20 comparisons, because 2 to the power of 20 is over a million! The time complexity is O of log N, and space complexity is O of 1.',
        keyConcept: 'Logarithmic growth means doubling the input size only adds 1 extra step.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Complexity & Key Takeaways', fontSize: 24, color: '#6366f1', y: 40 },
          {
            type: 'box',
            timeOffset: 2,
            x: 80,
            y: 90,
            width: 250,
            height: 120,
            stroke: '#3b82f6',
            fill: '#f8fafc',
            label: 'Time Complexity'
          },
          { type: 'text', timeOffset: 4, text: 'Worst Case: O(log N)', fontSize: 18, bold: true, color: '#1d4ed8', x: 105, y: 140 },
          { type: 'text', timeOffset: 6, text: 'Best Case: O(1)', fontSize: 14, color: '#64748b', x: 105, y: 175 },
          {
            type: 'box',
            timeOffset: 8,
            x: 360,
            y: 90,
            width: 250,
            height: 120,
            stroke: '#10b981',
            fill: '#f8fafc',
            label: 'Space Complexity'
          },
          { type: 'text', timeOffset: 10, text: 'Iterative: O(1)', fontSize: 18, bold: true, color: '#047857', x: 385, y: 140 },
          { type: 'text', timeOffset: 12, text: 'Recursive: O(log N)', fontSize: 14, color: '#64748b', x: 385, y: 175 },
          { type: 'badge', timeOffset: 15, text: '1,000,000 items -> Max 20 steps!', bgColor: '#fef3c7', textColor: '#b45309', x: 80, y: 250 },
          { type: 'text', timeOffset: 18, text: 'Condition: The collection MUST be sorted before binary search.', fontSize: 15, bold: true, color: '#334155', x: 80, y: 300 }
        ]
      },
      {
        id: 5,
        title: 'Review and Follow-up Questions',
        duration: 20,
        narration: 'Great job! You now understand binary search: initialize Left and Right, check the midpoint, and halve the space until found. You can now use the chat box on the right to ask any follow-up questions, such as handling duplicates or comparing with ternary search.',
        keyConcept: 'Binary search is the cornerstone of efficient data retrieval and indexing.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Lesson Complete! Try Asking a Question', fontSize: 24, color: '#0f172a', y: 40 },
          { type: 'icon', timeOffset: 2, iconType: 'sparkle', x: 340, y: 100, color: '#f59e0b' },
          { type: 'badge', timeOffset: 4, text: 'Ask Follow-up Questions in the Chat ->', bgColor: '#ede9fe', textColor: '#6d28d9', x: 170, y: 150 },
          { type: 'text', timeOffset: 7, text: '• "What happens if the target is not in the array?"', fontSize: 15, color: '#475569', x: 140, y: 210 },
          { type: 'text', timeOffset: 10, text: '• "Why does integer overflow happen in (L + R) / 2?"', fontSize: 15, color: '#475569', x: 140, y: 245 },
          { type: 'text', timeOffset: 13, text: '• "Can we do binary search on an answer space?"', fontSize: 15, color: '#475569', x: 140, y: 280 }
        ]
      }
    ],
    suggestedQuestions: [
      'What happens when the target is not present in the array?',
      'Why can (left + right) / 2 overflow, and how do we prevent it?',
      'How does binary search compare to hash table lookups?'
    ]
  },

  'photosynthesis': {
    id: 'sample-photosynthesis',
    topic: 'Photosynthesis in Plants',
    title: 'Photosynthesis: Transforming Sunlight into Life',
    overview: 'Discover how plant cells convert sunlight, water, and carbon dioxide into chemical energy and oxygen inside the chloroplast.',
    totalDuration: 115,
    scenes: [
      {
        id: 1,
        title: 'The Big Picture: Inputs and Outputs',
        duration: 20,
        narration: 'Welcome to our lesson on Photosynthesis. Plants are the solar-powered factories of our planet. They take in sunlight, water from the soil, and carbon dioxide from the air to produce glucose and release life-giving oxygen.',
        keyConcept: 'Photosynthesis converts solar energy into chemical energy stored in glucose bonds.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Photosynthesis: Chemical Engine of Earth', fontSize: 26, color: '#16a34a', y: 40 },
          { type: 'icon', timeOffset: 1, iconType: 'sun', x: 120, y: 110, color: '#eab308' },
          { type: 'text', timeOffset: 2, text: 'Sunlight', fontSize: 16, bold: true, color: '#ca8a04', x: 100, y: 150 },
          { type: 'box', timeOffset: 4, x: 250, y: 100, width: 180, height: 100, stroke: '#16a34a', fill: '#f0fdf4', label: 'Plant Leaf Cell' },
          { type: 'arrow', timeOffset: 6, fromX: 160, fromY: 130, toX: 240, toY: 130, label: 'Energy', color: '#eab308' },
          { type: 'text', timeOffset: 8, text: '+ Water (H2O) from Roots', fontSize: 14, color: '#0284c7', x: 260, y: 140 },
          { type: 'text', timeOffset: 10, text: '+ Carbon Dioxide (CO2)', fontSize: 14, color: '#475569', x: 260, y: 165 },
          { type: 'arrow', timeOffset: 13, fromX: 440, fromY: 140, toX: 540, toY: 140, label: 'Produces', color: '#16a34a' },
          { type: 'badge', timeOffset: 15, text: 'Glucose (C6H12O6) + Oxygen (O2)', bgColor: '#dcfce7', textColor: '#15803d', x: 450, y: 220 }
        ]
      },
      {
        id: 2,
        title: 'The Chemical Equation',
        duration: 22,
        narration: 'Let us look at the balanced chemical equation. Six molecules of carbon dioxide react with six molecules of water, powered by light energy, yielding one molecule of glucose and six molecules of oxygen gas.',
        keyConcept: '6 CO2 + 6 H2O + Light Energy -> C6H12O6 + 6 O2',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Balanced Equation', fontSize: 24, color: '#0f766e', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: '6 CO₂  +  6 H₂O  +  Light  ⟶  C₆H₁₂O₆  +  6 O₂',
            subtext: 'Carbon Dioxide + Water + Photons ⟶ Glucose + Oxygen',
            x: 80,
            y: 110
          },
          { type: 'box', timeOffset: 7, x: 80, y: 190, width: 230, height: 90, stroke: '#0284c7', fill: '#f0f9ff', label: 'Reactants (Inputs)' },
          { type: 'text', timeOffset: 9, text: '• CO2 enters via Stomata', fontSize: 14, color: '#0369a1', x: 95, y: 230 },
          { type: 'text', timeOffset: 11, text: '• H2O pulled up via Xylem', fontSize: 14, color: '#0369a1', x: 95, y: 255 },
          { type: 'box', timeOffset: 13, x: 360, y: 190, width: 230, height: 90, stroke: '#16a34a', fill: '#f0fdf4', label: 'Products (Outputs)' },
          { type: 'text', timeOffset: 15, text: '• Glucose: Sugar energy store', fontSize: 14, color: '#15803d', x: 375, y: 230 },
          { type: 'text', timeOffset: 17, text: '• O2: Released into atmosphere', fontSize: 14, color: '#15803d', x: 375, y: 255 }
        ]
      },
      {
        id: 3,
        title: 'Inside the Chloroplast: Two Stages',
        duration: 25,
        narration: 'Inside the plant cell lies the chloroplast. Photosynthesis occurs in two main stages: First, the Light-Dependent Reactions in the thylakoid membranes split water and create ATP. Second, the Light-Independent Calvin Cycle in the stroma uses that ATP to assemble sugar.',
        keyConcept: 'Stage 1: Light Reactions (Thylakoids). Stage 2: Calvin Cycle (Stroma).',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Inside the Chloroplast: 2 Stages', fontSize: 24, color: '#15803d', y: 40 },
          { type: 'circle', timeOffset: 2, x: 180, y: 180, radius: 70, fill: '#ecfdf5', stroke: '#10b981', label: 'Light Reactions' },
          { type: 'text', timeOffset: 4, text: 'In Thylakoids', fontSize: 13, color: '#047857', x: 140, y: 200 },
          { type: 'text', timeOffset: 6, text: 'H2O ⟶ O2', fontSize: 14, bold: true, color: '#047857', x: 145, y: 220 },
          { type: 'arrow', timeOffset: 9, fromX: 260, fromY: 170, toX: 370, toY: 170, label: 'ATP & NADPH', color: '#eab308' },
          { type: 'circle', timeOffset: 11, x: 450, y: 180, radius: 70, fill: '#fefce8', stroke: '#ca8a04', label: 'Calvin Cycle' },
          { type: 'text', timeOffset: 13, text: 'In Stroma', fontSize: 13, color: '#a16207', x: 420, y: 200 },
          { type: 'text', timeOffset: 15, text: 'CO2 ⟶ Sugar', fontSize: 14, bold: true, color: '#a16207', x: 410, y: 220 },
          { type: 'arrow', timeOffset: 18, fromX: 370, fromY: 200, toX: 260, toY: 200, label: 'ADP + NADP+', color: '#94a3b8' }
        ]
      },
      {
        id: 4,
        title: 'Summary & Environmental Significance',
        duration: 22,
        narration: 'To wrap up, photosynthesis is the foundation of virtually all terrestrial ecosystems. It purifies our air by sequestering carbon dioxide, generates atmospheric oxygen, and builds the food base for herbivores and humans alike.',
        keyConcept: 'Without photosynthesis, aerobic life on Earth would cease to exist.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Key Takeaways & Ecological Impact', fontSize: 24, color: '#0f172a', y: 40 },
          { type: 'badge', timeOffset: 2, text: 'Carbon Capture: Regulates Global Climate', bgColor: '#dbeafe', textColor: '#1e40af', x: 80, y: 100 },
          { type: 'badge', timeOffset: 5, text: 'Oxygen Generation: Powers Aerobic Respiration', bgColor: '#dcfce7', textColor: '#15803d', x: 80, y: 150 },
          { type: 'badge', timeOffset: 8, text: 'Trophic Base: Sustains Food Webs Globally', bgColor: '#fef3c7', textColor: '#b45309', x: 80, y: 200 },
          { type: 'text', timeOffset: 12, text: 'Ready for follow-ups! Ask how temperature affects photosynthesis.', fontSize: 15, color: '#475569', x: 80, y: 270 }
        ]
      }
    ],
    suggestedQuestions: [
      'What is the difference between light-dependent and light-independent reactions?',
      'Why do plant leaves look green under sunlight?',
      'How do drought conditions affect photosynthesis in C3 vs C4 plants?'
    ]
  },

  'pythagorean-theorem': {
    id: 'sample-pythagorean-theorem',
    topic: 'Pythagorean Theorem',
    title: 'The Pythagorean Theorem: Geometry in Action',
    overview: 'Understand the fundamental geometric relationship a² + b² = c² in right-angled triangles with visual proofs and real-world calculation.',
    totalDuration: 105,
    scenes: [
      {
        id: 1,
        title: 'Right Triangles and the Hypotenuse',
        duration: 20,
        narration: 'Welcome to this visual demonstration of the Pythagorean Theorem. This theorem applies exclusively to right-angled triangles, which have one 90 degree angle. The side opposite the 90 degree angle is the hypotenuse, labeled c.',
        keyConcept: 'A right triangle has two perpendicular legs (a and b) and one hypotenuse (c).',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Right Triangles: Anatomy', fontSize: 26, color: '#6366f1', y: 40 },
          { type: 'line', timeOffset: 2, fromX: 180, fromY: 120, toX: 180, toY: 260, stroke: '#3b82f6', strokeWidth: 4 },
          { type: 'text', timeOffset: 3, text: 'Leg a', fontSize: 16, bold: true, color: '#2563eb', x: 130, y: 180 },
          { type: 'line', timeOffset: 5, fromX: 180, fromY: 260, toX: 360, toY: 260, stroke: '#10b981', strokeWidth: 4 },
          { type: 'text', timeOffset: 6, text: 'Leg b', fontSize: 16, bold: true, color: '#059669', x: 260, y: 290 },
          { type: 'line', timeOffset: 8, fromX: 180, fromY: 120, toX: 360, toY: 260, stroke: '#f59e0b', strokeWidth: 4 },
          { type: 'text', timeOffset: 9, text: 'Hypotenuse c', fontSize: 16, bold: true, color: '#d97706', x: 290, y: 170 },
          { type: 'box', timeOffset: 12, x: 180, y: 240, width: 20, height: 20, stroke: '#64748b', strokeWidth: 2 }
        ]
      },
      {
        id: 2,
        title: 'The Famous Equation: a² + b² = c²',
        duration: 22,
        narration: 'Pythagoras proved that if you draw a square on side a, and a square on side b, their combined areas equal the square drawn on side c. Algebraically: a squared plus b squared equals c squared.',
        keyConcept: 'Sum of the areas of the two smaller squares equals the area of the hypotenuse square.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Theorem Statement', fontSize: 24, color: '#4f46e5', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'a²  +  b²  =  c²',
            subtext: '(Leg 1)² + (Leg 2)² = (Hypotenuse)²',
            x: 80,
            y: 90
          },
          { type: 'box', timeOffset: 6, x: 100, y: 170, width: 70, height: 70, fill: '#dbeafe', stroke: '#2563eb', label: 'a² area' },
          { type: 'text', timeOffset: 8, text: '+', fontSize: 24, bold: true, color: '#64748b', x: 195, y: 210 },
          { type: 'box', timeOffset: 10, x: 230, y: 160, width: 90, height: 90, fill: '#d1fae5', stroke: '#059669', label: 'b² area' },
          { type: 'text', timeOffset: 12, text: '=', fontSize: 24, bold: true, color: '#64748b', x: 345, y: 210 },
          { type: 'box', timeOffset: 14, x: 380, y: 145, width: 120, height: 120, fill: '#fef3c7', stroke: '#d97706', label: 'c² area' }
        ]
      },
      {
        id: 3,
        title: 'Step-by-Step Example: 3-4-5 Triangle',
        duration: 24,
        narration: 'Let us solve a classic example where leg a equals 3 and leg b equals 4. 3 squared is 9, and 4 squared is 16. 9 plus 16 equals 25. Taking the square root of 25 gives c equals 5. This 3, 4, 5 ratio is the most famous Pythagorean Triple.',
        keyConcept: '3² (9) + 4² (16) = 25. The square root of 25 is exactly 5.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Example: Leg a=3, Leg b=4', fontSize: 24, color: '#0284c7', y: 40 },
          { type: 'text', timeOffset: 2, text: 'Step 1: 3² = 9', fontSize: 18, color: '#2563eb', x: 80, y: 100 },
          { type: 'text', timeOffset: 5, text: 'Step 2: 4² = 16', fontSize: 18, color: '#059669', x: 80, y: 140 },
          { type: 'text', timeOffset: 8, text: 'Step 3: 9 + 16 = 25 = c²', fontSize: 18, bold: true, color: '#d97706', x: 80, y: 180 },
          { type: 'text', timeOffset: 12, text: 'Step 4: c = √25 = 5', fontSize: 22, bold: true, color: '#16a34a', x: 80, y: 230 },
          { type: 'badge', timeOffset: 15, text: 'Pythagorean Triple: (3, 4, 5)', bgColor: '#dcfce7', textColor: '#15803d', x: 80, y: 280 }
        ]
      }
    ],
    suggestedQuestions: [
      'What are some other integer Pythagorean triples besides 3, 4, 5?',
      'Can the Pythagorean theorem be used for triangles that are not right-angled?',
      'How does the distance formula in coordinate geometry derive from this theorem?'
    ]
  }
};
