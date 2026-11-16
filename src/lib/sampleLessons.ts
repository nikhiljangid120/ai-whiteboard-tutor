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
        duration: 20,
        narration: 'Welcome to this whiteboard session on Binary Search. Imagine we are looking for the number 23 inside a sorted array of eight numbers. Linear search would check one by one, taking up to eight steps. Binary search does it in just three.',
        keyConcept: 'Binary search requires a sorted array to eliminate half the remaining elements at each step.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Binary Search: Finding 23', fontSize: 26, color: '#38bdf8', y: 40 },
          { type: 'text', timeOffset: 1, text: 'Target value: 23 in a sorted array of 8 elements', fontSize: 16, color: '#94a3b8', y: 75 },
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
          { type: 'badge', timeOffset: 7, text: 'Sorted: Ascending Order', bgColor: 'rgba(56, 189, 248, 0.15)', textColor: '#38bdf8', x: 80, y: 250 },
          { type: 'text', timeOffset: 10, text: 'Linear Search: O(N) worst case (8 steps)', fontSize: 14, color: '#94a3b8', x: 80, y: 290 },
          { type: 'text', timeOffset: 12, text: 'Binary Search: O(log N) worst case (3 steps)', fontSize: 14, color: '#34d399', bold: true, x: 80, y: 315 }
        ]
      },
      {
        id: 2,
        title: 'Step 1: Calculate the Midpoint',
        duration: 24,
        narration: 'We maintain two pointers: Left at index 0 and Right at index 7. We calculate Mid as Left plus Right divided by 2, which gives index 3. The value at index 3 is 12. Since our target 23 is greater than 12, the target cannot be in the left half!',
        keyConcept: 'Compare target with array[mid]. Since 23 > 12, discard the entire left half.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 1: Find Midpoint & Compare', fontSize: 24, color: '#60a5fa', y: 40 },
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
          { type: 'badge', timeOffset: 12, text: '23 > 12: Discard Left Half!', bgColor: 'rgba(239, 68, 68, 0.15)', textColor: '#f87171', x: 80, y: 275 },
          { type: 'arrow', timeOffset: 15, fromX: 250, fromY: 310, toX: 380, toY: 310, label: 'Move L -> mid + 1 (index 4)', color: '#38bdf8' }
        ]
      },
      {
        id: 3,
        title: 'Step 2: Narrow Search to Right Half',
        duration: 24,
        narration: 'Now Left moves to mid plus one, which is index 4. The active search space is now indices 4 through 7. We compute the new Mid: 4 plus 7 divided by 2 is index 5. Look at index 5: the value is 23! We have directly matched our target.',
        keyConcept: 'L is now 4, R is 7. New mid is 5. array[5] equals 23 — TARGET FOUND!',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 2: Narrow to Indices 4-7', fontSize: 24, color: '#34d399', y: 40 },
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
              { index: 5, label: 'MID: 23 = TARGET!', color: '#34d399', position: 'top' },
              { index: 7, label: 'R (7)', color: '#ef4444', position: 'bottom' }
            ]
          },
          { type: 'highlight', timeOffset: 11, x: 380, y: 160, width: 70, height: 70, color: '#10b981' },
          { type: 'icon', timeOffset: 14, iconType: 'check', x: 415, y: 130, color: '#10b981' },
          { type: 'badge', timeOffset: 16, text: 'Match Found at Index 5 in just 2 comparisons!', bgColor: 'rgba(52, 211, 153, 0.15)', textColor: '#34d399', x: 80, y: 275 }
        ]
      },
      {
        id: 4,
        title: 'Time & Space Complexity Summary',
        duration: 24,
        narration: 'Notice how powerful this is. Even if we had one million sorted elements, binary search would find any element in at most 20 comparisons, because 2 to the power of 20 is over a million! The time complexity is O of log N, and space complexity is O of 1.',
        keyConcept: 'Logarithmic growth means doubling the input size only adds 1 extra step.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Complexity & Key Takeaways', fontSize: 24, color: '#818cf8', y: 40 },
          {
            type: 'box',
            timeOffset: 2,
            x: 80,
            y: 90,
            width: 250,
            height: 120,
            stroke: '#38bdf8',
            fill: 'rgba(56, 189, 248, 0.05)',
            label: 'Time Complexity'
          },
          { type: 'text', timeOffset: 4, text: 'Worst Case: O(log N)', fontSize: 18, bold: true, color: '#38bdf8', x: 105, y: 140 },
          { type: 'text', timeOffset: 6, text: 'Best Case: O(1)', fontSize: 14, color: '#94a3b8', x: 105, y: 175 },
          {
            type: 'box',
            timeOffset: 8,
            x: 360,
            y: 90,
            width: 250,
            height: 120,
            stroke: '#34d399',
            fill: 'rgba(52, 211, 153, 0.05)',
            label: 'Space Complexity'
          },
          { type: 'text', timeOffset: 10, text: 'Iterative: O(1)', fontSize: 18, bold: true, color: '#34d399', x: 385, y: 140 },
          { type: 'text', timeOffset: 12, text: 'Recursive: O(log N)', fontSize: 14, color: '#94a3b8', x: 385, y: 175 },
          { type: 'badge', timeOffset: 15, text: '1,000,000 items -> Max 20 steps!', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 250 },
          { type: 'text', timeOffset: 18, text: 'Condition: The collection MUST be sorted before binary search.', fontSize: 15, bold: true, color: '#e2e8f0', x: 80, y: 300 }
        ]
      },
      {
        id: 5,
        title: 'Review and Follow-up Questions',
        duration: 18,
        narration: 'Great job! You now understand binary search: initialize Left and Right, check the midpoint, and halve the space until found. You can now use the chat box on the right to ask any follow-up questions, such as handling duplicates or comparing with ternary search.',
        keyConcept: 'Binary search is the cornerstone of efficient data retrieval and indexing.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Lesson Complete! Try Asking a Question', fontSize: 24, color: '#f8fafc', y: 40 },
          { type: 'icon', timeOffset: 2, iconType: 'sparkle', x: 340, y: 100, color: '#f59e0b' },
          { type: 'badge', timeOffset: 4, text: 'Ask Follow-up Questions in the Chat ->', bgColor: 'rgba(129, 140, 248, 0.15)', textColor: '#818cf8', x: 170, y: 150 },
          { type: 'text', timeOffset: 7, text: '• "What happens if the target is not in the array?"', fontSize: 15, color: '#94a3b8', x: 140, y: 210 },
          { type: 'text', timeOffset: 10, text: '• "Why does integer overflow happen in (L + R) / 2?"', fontSize: 15, color: '#94a3b8', x: 140, y: 245 },
          { type: 'text', timeOffset: 13, text: '• "Can we do binary search on an answer space?"', fontSize: 15, color: '#94a3b8', x: 140, y: 280 }
        ]
      }
    ],
    suggestedQuestions: [
      'What happens when the target is not present in the array?',
      'Why can (left + right) / 2 overflow, and how do we prevent it?',
      'How does binary search compare to hash table lookups?'
    ]
  },

  'neural-networks': {
    id: 'sample-neural-networks',
    topic: 'How Neural Networks Learn',
    title: 'Inside Deep Learning: Neurons, Weights & Backprop',
    overview: 'Visualize how artificial neurons multiply inputs by weights, add bias, activate, and iteratively minimize loss via gradient descent.',
    totalDuration: 115,
    scenes: [
      {
        id: 1,
        title: 'The Biological Analogy & Artificial Neuron',
        duration: 22,
        narration: 'Welcome to this visual walkthrough on neural networks. At the heart of modern AI is the artificial neuron. It takes multiple numeric inputs, multiplies each by a learnable weight, adds a bias term, and passes the sum through an activation function.',
        keyConcept: 'Neuron equation: y = Activation( (Input1 * Weight1) + (Input2 * Weight2) + Bias )',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Perceptron: Single Neuron Model', fontSize: 26, color: '#a855f7', y: 40 },
          { type: 'circle', timeOffset: 2, x: 120, y: 140, radius: 24, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'x₁' },
          { type: 'circle', timeOffset: 3, x: 120, y: 240, radius: 24, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'x₂' },
          { type: 'circle', timeOffset: 5, x: 340, y: 190, radius: 45, stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)', label: 'Σ + Bias' },
          { type: 'arrow', timeOffset: 7, fromX: 148, fromY: 140, toX: 295, toY: 175, label: 'w₁ = 0.8', color: '#38bdf8' },
          { type: 'arrow', timeOffset: 8, fromX: 148, fromY: 240, toX: 295, toY: 205, label: 'w₂ = -0.4', color: '#38bdf8' },
          { type: 'arrow', timeOffset: 12, fromX: 390, fromY: 190, toX: 490, toY: 190, label: 'f(z)', color: '#a855f7' },
          { type: 'box', timeOffset: 14, x: 500, y: 155, width: 140, height: 70, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'ReLU / Sigmoid' },
          { type: 'badge', timeOffset: 18, text: 'Output: Final Prediction ŷ', bgColor: 'rgba(16, 185, 129, 0.2)', textColor: '#34d399', x: 500, y: 260 }
        ]
      },
      {
        id: 2,
        title: 'The Multi-Layer Architecture',
        duration: 25,
        narration: 'Single neurons are combined into layers: an Input Layer, multiple Hidden Layers that extract abstract features, and an Output Layer. In computer vision, early layers detect edges, middle layers recognize textures and shapes, and deep layers identify full objects.',
        keyConcept: 'Deep networks build hierarchical representations through layered transformations.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Deep Architecture: Hidden Layers', fontSize: 24, color: '#38bdf8', y: 40 },
          { type: 'box', timeOffset: 2, x: 80, y: 100, width: 120, height: 180, stroke: '#64748b', fill: 'rgba(100, 116, 139, 0.1)', label: 'Input Layer' },
          { type: 'text', timeOffset: 4, text: 'Pixels / Raw Data', fontSize: 13, color: '#94a3b8', x: 92, y: 190 },
          { type: 'arrow', timeOffset: 6, fromX: 205, fromY: 190, toX: 265, toY: 190, label: 'W¹', color: '#818cf8' },
          { type: 'box', timeOffset: 8, x: 270, y: 80, width: 150, height: 220, stroke: '#818cf8', fill: 'rgba(129, 140, 248, 0.1)', label: 'Hidden Layers' },
          { type: 'text', timeOffset: 10, text: 'Edges ⟶ Shapes', fontSize: 13, color: '#c7d2fe', x: 295, y: 180 },
          { type: 'text', timeOffset: 12, text: 'Feature Abstraction', fontSize: 13, color: '#818cf8', x: 288, y: 210 },
          { type: 'arrow', timeOffset: 15, fromX: 425, fromY: 190, toX: 485, toY: 190, label: 'W²', color: '#10b981' },
          { type: 'box', timeOffset: 17, x: 490, y: 110, width: 130, height: 160, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'Output Layer' },
          { type: 'text', timeOffset: 19, text: 'Probabilities [0..1]', fontSize: 13, color: '#34d399', x: 500, y: 190 }
        ]
      },
      {
        id: 3,
        title: 'Loss Functions and Gradient Descent',
        duration: 25,
        narration: 'How does the network actually learn? We compare its output with the true label using a Loss Function. The gradient of the loss tells us which direction to nudge every single weight to reduce error. We take small steps down the error hill: Gradient Descent.',
        keyConcept: 'Weight update formula: W_new = W_old - (LearningRate * dLoss/dW)',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Optimization: Gradient Descent', fontSize: 24, color: '#f59e0b', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'Loss = ½ (Prediction - Actual)²',
            subtext: 'Mean Squared Error / Cross Entropy',
            x: 80,
            y: 90
          },
          {
            type: 'equation',
            timeOffset: 7,
            text: 'W_new = W_old - η · (∂Loss / ∂W)',
            subtext: 'η (eta) = Learning Rate (e.g. 0.001)',
            x: 80,
            y: 180
          },
          { type: 'badge', timeOffset: 12, text: 'Backpropagation: The Chain Rule of Calculus', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 280 },
          { type: 'arrow', timeOffset: 16, fromX: 520, fromY: 280, toX: 350, toY: 280, label: 'Gradients flow backward ⟵', color: '#f87171' }
        ]
      },
      {
        id: 4,
        title: 'Summary: Forward Pass vs Backprop',
        duration: 20,
        narration: 'In summary, learning consists of two repeating cycles: First, the forward pass computes predictions. Second, backpropagation calculates gradients and updates weights. Repeated over millions of examples, the network converges on superhuman accuracy.',
        keyConcept: 'Forward Pass computes predictions; Backward Pass updates weights.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Training Loop Summary', fontSize: 24, color: '#f8fafc', y: 40 },
          { type: 'badge', timeOffset: 2, text: '1. Forward Pass: Input ⟶ Activation ⟶ Output', bgColor: 'rgba(56, 189, 248, 0.15)', textColor: '#38bdf8', x: 80, y: 100 },
          { type: 'badge', timeOffset: 6, text: '2. Compute Loss: Measure prediction mistake', bgColor: 'rgba(239, 68, 68, 0.15)', textColor: '#f87171', x: 80, y: 150 },
          { type: 'badge', timeOffset: 10, text: '3. Backprop: Propagate error via calculus chain rule', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 200 },
          { type: 'badge', timeOffset: 14, text: '4. Update Weights: Repeat for thousands of epochs', bgColor: 'rgba(52, 211, 153, 0.15)', textColor: '#34d399', x: 80, y: 250 }
        ]
      }
    ],
    suggestedQuestions: [
      'What is the vanishing gradient problem and how does ReLU fix it?',
      'How does Adam optimizer improve over standard gradient descent?',
      'Why is overfitting dangerous and how do we prevent it with dropout?'
    ]
  },

  'tcp-handshake': {
    id: 'sample-tcp-handshake',
    topic: 'TCP Three-Way Handshake',
    title: 'Networking 101: The TCP 3-Way Handshake',
    overview: 'Explore how clients and servers establish reliable, connection-oriented communication using SYN, SYN-ACK, and ACK packet sequences.',
    totalDuration: 105,
    scenes: [
      {
        id: 1,
        title: 'The Need for a Reliable Handshake',
        duration: 22,
        narration: 'Every time you open a webpage or make an API call over HTTPS, your device establishes a connection using TCP. Unlike UDP which just sprays packets into the void, TCP guarantees reliable, ordered packet delivery through the Three-Way Handshake.',
        keyConcept: 'TCP establishes sequence numbers so lost or out-of-order packets can be retransmitted.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'TCP 3-Way Handshake: Setup', fontSize: 26, color: '#38bdf8', y: 40 },
          { type: 'box', timeOffset: 2, x: 100, y: 110, width: 140, height: 180, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'Client (Browser)' },
          { type: 'box', timeOffset: 4, x: 480, y: 110, width: 140, height: 180, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'Server (Cloud)' },
          { type: 'text', timeOffset: 8, text: 'Client Port: 54321', fontSize: 13, color: '#94a3b8', x: 115, y: 180 },
          { type: 'text', timeOffset: 10, text: 'Server Port: 443 (HTTPS)', fontSize: 13, color: '#94a3b8', x: 488, y: 180 },
          { type: 'badge', timeOffset: 14, text: 'Goal: Synchronize Initial Sequence Numbers (ISN)', bgColor: 'rgba(56, 189, 248, 0.15)', textColor: '#38bdf8', x: 180, y: 310 }
        ]
      },
      {
        id: 2,
        title: 'Step 1: SYN (Synchronize)',
        duration: 22,
        narration: 'Step one: The client sends a SYN packet to the server. SYN stands for synchronize. The client generates a random Initial Sequence Number, let us say Sequence equals 100. The client enters the SYN-SENT state.',
        keyConcept: 'Packet 1: Client -> Server | Flag: SYN | Seq = X',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 1: Client Sends SYN', fontSize: 24, color: '#60a5fa', y: 40 },
          { type: 'box', timeOffset: 1, x: 100, y: 100, width: 130, height: 90, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'Client' },
          { type: 'box', timeOffset: 1, x: 490, y: 100, width: 130, height: 90, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'Server' },
          { type: 'arrow', timeOffset: 3, fromX: 235, fromY: 135, toX: 485, toY: 135, label: 'SYN: Seq = 100', color: '#60a5fa' },
          { type: 'badge', timeOffset: 7, text: 'Client State: SYN-SENT', bgColor: 'rgba(96, 165, 250, 0.2)', textColor: '#93c5fd', x: 100, y: 220 },
          { type: 'text', timeOffset: 11, text: '• Client proposes initial sequence number = 100', fontSize: 14, color: '#cbd5e1', x: 100, y: 270 },
          { type: 'text', timeOffset: 14, text: '• Server receives packet and validates port 443', fontSize: 14, color: '#94a3b8', x: 100, y: 300 }
        ]
      },
      {
        id: 3,
        title: 'Step 2: SYN-ACK (Synchronize-Acknowledge)',
        duration: 25,
        narration: 'Step two: The server receives the SYN. It acknowledges the client sequence number by setting ACK equal to 101. At the same time, the server generates its own random sequence number, say 300, and sends both in a SYN-ACK packet.',
        keyConcept: 'Packet 2: Server -> Client | Flags: SYN + ACK | Seq = Y, Ack = X + 1',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 2: Server Responds SYN-ACK', fontSize: 24, color: '#34d399', y: 40 },
          { type: 'arrow', timeOffset: 3, fromX: 485, fromY: 155, toX: 235, toY: 155, label: 'SYN-ACK: Seq = 300, Ack = 101', color: '#34d399' },
          { type: 'badge', timeOffset: 7, text: 'Server State: SYN-RECEIVED', bgColor: 'rgba(52, 211, 153, 0.2)', textColor: '#34d399', x: 440, y: 220 },
          { type: 'text', timeOffset: 11, text: '• Ack = 101 confirms receipt of client Seq 100', fontSize: 14, color: '#cbd5e1', x: 100, y: 270 },
          { type: 'text', timeOffset: 15, text: '• Seq = 300 introduces server sequence stream', fontSize: 14, color: '#34d399', x: 100, y: 300 }
        ]
      },
      {
        id: 4,
        title: 'Step 3: ACK & Connection Established',
        duration: 22,
        narration: 'Step three: The client receives the SYN-ACK, increments the server sequence to Ack equals 301, and sends back a final ACK packet. Both sides are now in the ESTABLISHED state, and HTTP data can begin streaming immediately!',
        keyConcept: 'Packet 3: Client -> Server | Flag: ACK | Ack = Y + 1 ⟶ ESTABLISHED',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Step 3: Final ACK ⟶ ESTABLISHED', fontSize: 24, color: '#10b981', y: 40 },
          { type: 'arrow', timeOffset: 3, fromX: 235, fromY: 180, toX: 485, toY: 180, label: 'ACK: Ack = 301', color: '#10b981' },
          { type: 'badge', timeOffset: 7, text: 'BOTH SIDES: ESTABLISHED', bgColor: 'rgba(16, 185, 129, 0.3)', textColor: '#34d399', x: 260, y: 240 },
          { type: 'icon', timeOffset: 10, iconType: 'check', x: 360, y: 290, color: '#10b981' },
          { type: 'text', timeOffset: 13, text: 'TLS / HTTPS Handshake & Data Transfer can now begin!', fontSize: 15, bold: true, color: '#f8fafc', x: 140, y: 340 }
        ]
      }
    ],
    suggestedQuestions: [
      'Why are sequence numbers randomized instead of starting at zero?',
      'How does a SYN flood attack work and how do SYN cookies mitigate it?',
      'How does QUIC / HTTP/3 eliminate the TCP 3-way handshake latency?'
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
          { type: 'title', timeOffset: 0, text: 'Photosynthesis: Chemical Engine of Earth', fontSize: 26, color: '#10b981', y: 40 },
          { type: 'icon', timeOffset: 1, iconType: 'sun', x: 120, y: 110, color: '#eab308' },
          { type: 'text', timeOffset: 2, text: 'Sunlight', fontSize: 16, bold: true, color: '#facc15', x: 100, y: 150 },
          { type: 'box', timeOffset: 4, x: 250, y: 100, width: 180, height: 100, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'Plant Leaf Cell' },
          { type: 'arrow', timeOffset: 6, fromX: 160, fromY: 130, toX: 240, toY: 130, label: 'Energy', color: '#eab308' },
          { type: 'text', timeOffset: 8, text: '+ Water (H2O) from Roots', fontSize: 14, color: '#38bdf8', x: 260, y: 140 },
          { type: 'text', timeOffset: 10, text: '+ Carbon Dioxide (CO2)', fontSize: 14, color: '#cbd5e1', x: 260, y: 165 },
          { type: 'arrow', timeOffset: 13, fromX: 440, fromY: 140, toX: 540, toY: 140, label: 'Produces', color: '#10b981' },
          { type: 'badge', timeOffset: 15, text: 'Glucose (C6H12O6) + Oxygen (O2)', bgColor: 'rgba(16, 185, 129, 0.2)', textColor: '#34d399', x: 450, y: 220 }
        ]
      },
      {
        id: 2,
        title: 'The Chemical Equation',
        duration: 22,
        narration: 'Let us look at the balanced chemical equation. Six molecules of carbon dioxide react with six molecules of water, powered by light energy, yielding one molecule of glucose and six molecules of oxygen gas.',
        keyConcept: '6 CO2 + 6 H2O + Light Energy -> C6H12O6 + 6 O2',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Balanced Equation', fontSize: 24, color: '#2dd4bf', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: '6 CO₂  +  6 H₂O  +  Light  ⟶  C₆H₁₂O₆  +  6 O₂',
            subtext: 'Carbon Dioxide + Water + Photons ⟶ Glucose + Oxygen',
            x: 80,
            y: 110
          },
          { type: 'box', timeOffset: 7, x: 80, y: 190, width: 230, height: 90, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'Reactants (Inputs)' },
          { type: 'text', timeOffset: 9, text: '• CO2 enters via Stomata', fontSize: 14, color: '#7dd3fc', x: 95, y: 230 },
          { type: 'text', timeOffset: 11, text: '• H2O pulled up via Xylem', fontSize: 14, color: '#7dd3fc', x: 95, y: 255 },
          { type: 'box', timeOffset: 13, x: 360, y: 190, width: 230, height: 90, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', label: 'Products (Outputs)' },
          { type: 'text', timeOffset: 15, text: '• Glucose: Sugar energy store', fontSize: 14, color: '#34d399', x: 375, y: 230 },
          { type: 'text', timeOffset: 17, text: '• O2: Released into atmosphere', fontSize: 14, color: '#34d399', x: 375, y: 255 }
        ]
      },
      {
        id: 3,
        title: 'Inside the Chloroplast: Two Stages',
        duration: 25,
        narration: 'Inside the plant cell lies the chloroplast. Photosynthesis occurs in two main stages: First, the Light-Dependent Reactions in the thylakoid membranes split water and create ATP. Second, the Light-Independent Calvin Cycle in the stroma uses that ATP to assemble sugar.',
        keyConcept: 'Stage 1: Light Reactions (Thylakoids). Stage 2: Calvin Cycle (Stroma).',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Inside the Chloroplast: 2 Stages', fontSize: 24, color: '#34d399', y: 40 },
          { type: 'circle', timeOffset: 2, x: 180, y: 180, radius: 70, fill: 'rgba(16, 185, 129, 0.1)', stroke: '#10b981', label: 'Light Reactions' },
          { type: 'text', timeOffset: 4, text: 'In Thylakoids', fontSize: 13, color: '#34d399', x: 140, y: 200 },
          { type: 'text', timeOffset: 6, text: 'H2O ⟶ O2', fontSize: 14, bold: true, color: '#34d399', x: 145, y: 220 },
          { type: 'arrow', timeOffset: 9, fromX: 260, fromY: 170, toX: 370, toY: 170, label: 'ATP & NADPH', color: '#eab308' },
          { type: 'circle', timeOffset: 11, x: 450, y: 180, radius: 70, fill: 'rgba(234, 179, 8, 0.1)', stroke: '#eab308', label: 'Calvin Cycle' },
          { type: 'text', timeOffset: 13, text: 'In Stroma', fontSize: 13, color: '#facc15', x: 420, y: 200 },
          { type: 'text', timeOffset: 15, text: 'CO2 ⟶ Sugar', fontSize: 14, bold: true, color: '#facc15', x: 410, y: 220 },
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
          { type: 'title', timeOffset: 0, text: 'Key Takeaways & Ecological Impact', fontSize: 24, color: '#f8fafc', y: 40 },
          { type: 'badge', timeOffset: 2, text: 'Carbon Capture: Regulates Global Climate', bgColor: 'rgba(56, 189, 248, 0.15)', textColor: '#38bdf8', x: 80, y: 100 },
          { type: 'badge', timeOffset: 5, text: 'Oxygen Generation: Powers Aerobic Respiration', bgColor: 'rgba(16, 185, 129, 0.15)', textColor: '#34d399', x: 80, y: 150 },
          { type: 'badge', timeOffset: 8, text: 'Trophic Base: Sustains Food Webs Globally', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 200 },
          { type: 'text', timeOffset: 12, text: 'Ready for follow-ups! Ask how temperature affects photosynthesis.', fontSize: 15, color: '#94a3b8', x: 80, y: 270 }
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
          { type: 'title', timeOffset: 0, text: 'Right Triangles: Anatomy', fontSize: 26, color: '#818cf8', y: 40 },
          { type: 'line', timeOffset: 2, fromX: 180, fromY: 120, toX: 180, toY: 260, stroke: '#38bdf8', strokeWidth: 4 },
          { type: 'text', timeOffset: 3, text: 'Leg a', fontSize: 16, bold: true, color: '#38bdf8', x: 130, y: 180 },
          { type: 'line', timeOffset: 5, fromX: 180, fromY: 260, toX: 360, toY: 260, stroke: '#34d399', strokeWidth: 4 },
          { type: 'text', timeOffset: 6, text: 'Leg b', fontSize: 16, bold: true, color: '#34d399', x: 260, y: 290 },
          { type: 'line', timeOffset: 8, fromX: 180, fromY: 120, toX: 360, toY: 260, stroke: '#f59e0b', strokeWidth: 4 },
          { type: 'text', timeOffset: 9, text: 'Hypotenuse c', fontSize: 16, bold: true, color: '#fbbf24', x: 290, y: 170 },
          { type: 'box', timeOffset: 12, x: 180, y: 240, width: 20, height: 20, stroke: '#94a3b8', strokeWidth: 2 }
        ]
      },
      {
        id: 2,
        title: 'The Famous Equation: a² + b² = c²',
        duration: 22,
        narration: 'Pythagoras proved that if you draw a square on side a, and a square on side b, their combined areas equal the square drawn on side c. Algebraically: a squared plus b squared equals c squared.',
        keyConcept: 'Sum of the areas of the two smaller squares equals the area of the hypotenuse square.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Theorem Statement', fontSize: 24, color: '#a78bfa', y: 40 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'a²  +  b²  =  c²',
            subtext: '(Leg 1)² + (Leg 2)² = (Hypotenuse)²',
            x: 80,
            y: 90
          },
          { type: 'box', timeOffset: 6, x: 100, y: 170, width: 70, height: 70, fill: 'rgba(56, 189, 248, 0.15)', stroke: '#38bdf8', label: 'a² area' },
          { type: 'text', timeOffset: 8, text: '+', fontSize: 24, bold: true, color: '#94a3b8', x: 195, y: 210 },
          { type: 'box', timeOffset: 10, x: 230, y: 160, width: 90, height: 90, fill: 'rgba(52, 211, 153, 0.15)', stroke: '#34d399', label: 'b² area' },
          { type: 'text', timeOffset: 12, text: '=', fontSize: 24, bold: true, color: '#94a3b8', x: 345, y: 210 },
          { type: 'box', timeOffset: 14, x: 380, y: 145, width: 120, height: 120, fill: 'rgba(245, 158, 11, 0.15)', stroke: '#fbbf24', label: 'c² area' }
        ]
      },
      {
        id: 3,
        title: 'Step-by-Step Example: 3-4-5 Triangle',
        duration: 24,
        narration: 'Let us solve a classic example where leg a equals 3 and leg b equals 4. 3 squared is 9, and 4 squared is 16. 9 plus 16 equals 25. Taking the square root of 25 gives c equals 5. This 3, 4, 5 ratio is the most famous Pythagorean Triple.',
        keyConcept: '3² (9) + 4² (16) = 25. The square root of 25 is exactly 5.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Example: Leg a=3, Leg b=4', fontSize: 24, color: '#38bdf8', y: 40 },
          { type: 'text', timeOffset: 2, text: 'Step 1: 3² = 9', fontSize: 18, color: '#38bdf8', x: 80, y: 100 },
          { type: 'text', timeOffset: 5, text: 'Step 2: 4² = 16', fontSize: 18, color: '#34d399', x: 80, y: 140 },
          { type: 'text', timeOffset: 8, text: 'Step 3: 9 + 16 = 25 = c²', fontSize: 18, bold: true, color: '#fbbf24', x: 80, y: 180 },
          { type: 'text', timeOffset: 12, text: 'Step 4: c = √25 = 5', fontSize: 22, bold: true, color: '#10b981', x: 80, y: 230 },
          { type: 'badge', timeOffset: 15, text: 'Pythagorean Triple: (3, 4, 5)', bgColor: 'rgba(16, 185, 129, 0.2)', textColor: '#34d399', x: 80, y: 280 }
        ]
      }
    ],
    suggestedQuestions: [
      'What are some other integer Pythagorean triples besides 3, 4, 5?',
      'Can the Pythagorean theorem be used for triangles that are not right-angled?',
      'How does the distance formula in coordinate geometry derive from this theorem?'
    ]
  },

  'typescript': {
    id: 'sample-typescript',
    topic: 'TypeScript',
    title: 'TypeScript: JavaScript with Superpowers',
    overview: 'Learn how TypeScript brings compile-time safety, interfaces, and self-documenting types to modern JavaScript development.',
    totalDuration: 110,
    scenes: [
      {
        id: 1,
        title: 'Dynamic JS Bugs vs Static Typing',
        duration: 20,
        narration: 'Welcome to this visual deep dive into TypeScript. Plain JavaScript is dynamically typed, meaning errors like TypeError: Cannot read property of undefined only explode at runtime in front of your users. TypeScript catches those bugs right inside your editor.',
        keyConcept: 'TypeScript catches errors at compile time before your code ever runs in production.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'JavaScript vs TypeScript', fontSize: 26, color: '#38bdf8', y: 80 },
          { type: 'box', timeOffset: 2, x: 80, y: 130, width: 280, height: 160, stroke: '#f87171', fill: 'rgba(239, 68, 68, 0.1)', label: 'Plain JavaScript (Dynamic)' },
          { type: 'text', timeOffset: 4, text: '• Types checked at Runtime', fontSize: 13, color: '#fca5a5', x: 95, y: 190 },
          { type: 'text', timeOffset: 6, text: '• "undefined is not a function"', fontSize: 13, color: '#f87171', bold: true, x: 95, y: 220 },
          { type: 'text', timeOffset: 8, text: '• Bugs escape into Production', fontSize: 13, color: '#fca5a5', x: 95, y: 250 },
          { type: 'box', timeOffset: 10, x: 420, y: 130, width: 280, height: 160, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'TypeScript (Static)' },
          { type: 'text', timeOffset: 12, text: '• Types checked at Compile time', fontSize: 13, color: '#7dd3fc', x: 435, y: 190 },
          { type: 'text', timeOffset: 14, text: '• Red squiggly line in VS Code', fontSize: 13, color: '#38bdf8', bold: true, x: 435, y: 220 },
          { type: 'text', timeOffset: 16, text: '• Self-documenting Autocomplete', fontSize: 13, color: '#7dd3fc', x: 435, y: 250 },
          { type: 'badge', timeOffset: 18, text: 'TypeScript = JavaScript + Type System', bgColor: 'rgba(56, 189, 248, 0.2)', textColor: '#38bdf8', x: 240, y: 320 }
        ]
      },
      {
        id: 2,
        title: 'Type Annotations & Inference',
        duration: 22,
        narration: 'Adding types is simple. You can explicitly annotate variables using a colon, or let TypeScript automatically infer the type based on the initial value assigned.',
        keyConcept: 'Explicit typing uses colons (name: string), while inference deduces types automatically.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Type Annotations & Inference', fontSize: 24, color: '#60a5fa', y: 80 },
          {
            type: 'equation',
            timeOffset: 2,
            text: 'let username: string = "Nikhil";',
            subtext: 'Explicit type annotation enforces string values only',
            x: 80,
            y: 130
          },
          {
            type: 'equation',
            timeOffset: 6,
            text: 'let score = 95;  // inferred as number',
            subtext: 'Type Inference automatically prevents score = "A+"',
            x: 80,
            y: 220
          },
          { type: 'badge', timeOffset: 12, text: 'Primitives: string | number | boolean | symbol', bgColor: 'rgba(96, 165, 250, 0.15)', textColor: '#93c5fd', x: 80, y: 310 }
        ]
      },
      {
        id: 3,
        title: 'Interfaces and Contracts',
        duration: 24,
        narration: 'For complex objects, TypeScript provides Interfaces. An interface defines the exact shape of an object: which fields are required, which are optional, and their respective types.',
        keyConcept: 'Interfaces define data contracts that objects and function arguments must satisfy.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'Interfaces: Shaping Objects', fontSize: 24, color: '#34d399', y: 80 },
          {
            type: 'box',
            timeOffset: 2,
            x: 80,
            y: 130,
            width: 320,
            height: 170,
            stroke: '#34d399',
            fill: 'rgba(52, 211, 153, 0.1)',
            label: 'interface UserContract'
          },
          { type: 'text', timeOffset: 4, text: 'id: number;', fontSize: 14, color: '#a7f3d0', x: 105, y: 190 },
          { type: 'text', timeOffset: 6, text: 'name: string;', fontSize: 14, color: '#a7f3d0', x: 105, y: 220 },
          { type: 'text', timeOffset: 8, text: 'role: "admin" | "member";', fontSize: 14, color: '#f59e0b', bold: true, x: 105, y: 250 },
          { type: 'arrow', timeOffset: 12, fromX: 410, fromY: 215, toX: 490, toY: 215, label: 'implements', color: '#34d399' },
          { type: 'box', timeOffset: 14, x: 500, y: 170, width: 220, height: 90, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.1)', label: 'const adminUser: User' },
          { type: 'badge', timeOffset: 17, text: 'Union types like "admin" | "member" eliminate invalid states', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 320 }
        ]
      },
      {
        id: 4,
        title: 'The TypeScript Compiler (TSC) Pipeline',
        duration: 24,
        narration: 'Browsers cannot execute TypeScript directly. The TypeScript compiler, TSC, performs a two-step process: First, it runs comprehensive type checks. Second, it erases the types and emits clean, standard JavaScript that runs in any browser or Node runtime.',
        keyConcept: 'TSC checks types, strips them away, and emits universal JavaScript.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'The Compilation Pipeline', fontSize: 24, color: '#818cf8', y: 80 },
          { type: 'box', timeOffset: 2, x: 80, y: 150, width: 150, height: 100, stroke: '#38bdf8', fill: 'rgba(56, 189, 248, 0.15)', label: 'app.ts (TypeScript)' },
          { type: 'arrow', timeOffset: 5, fromX: 240, fromY: 200, toX: 340, toY: 200, label: 'tsc', color: '#818cf8' },
          { type: 'circle', timeOffset: 7, x: 410, y: 200, radius: 55, stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', label: 'Type Checker' },
          { type: 'arrow', timeOffset: 11, fromX: 475, fromY: 200, toX: 575, toY: 200, label: 'emit JS', color: '#10b981' },
          { type: 'box', timeOffset: 13, x: 585, y: 150, width: 150, height: 100, stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', label: 'bundle.js (Browser)' },
          { type: 'badge', timeOffset: 17, text: 'Zero Runtime Overhead: Types disappear during build!', bgColor: 'rgba(16, 185, 129, 0.2)', textColor: '#34d399', x: 180, y: 310 }
        ]
      },
      {
        id: 5,
        title: 'Summary & Best Practices',
        duration: 20,
        narration: 'To wrap up: TypeScript gives you the speed of JavaScript with the safety of a compiled language. Enable strict mode in your tsconfig, leverage generics for reusable code, and let types supercharge your workflow.',
        keyConcept: 'Always enable "strict": true in tsconfig.json for maximum reliability.',
        actions: [
          { type: 'title', timeOffset: 0, text: 'TypeScript Master Checklist', fontSize: 24, color: '#f8fafc', y: 80 },
          { type: 'badge', timeOffset: 2, text: '1. "strict": true — Catch null and undefined issues', bgColor: 'rgba(56, 189, 248, 0.15)', textColor: '#38bdf8', x: 80, y: 140 },
          { type: 'badge', timeOffset: 6, text: '2. Avoid "any" — Use "unknown" when input is untrusted', bgColor: 'rgba(239, 68, 68, 0.15)', textColor: '#f87171', x: 80, y: 190 },
          { type: 'badge', timeOffset: 10, text: '3. Generics <T> — Build flexible, reusable data structures', bgColor: 'rgba(245, 158, 11, 0.15)', textColor: '#fbbf24', x: 80, y: 240 },
          { type: 'badge', timeOffset: 14, text: '4. Full Next.js & React support out of the box!', bgColor: 'rgba(52, 211, 153, 0.15)', textColor: '#34d399', x: 80, y: 290 }
        ]
      }
    ],
    suggestedQuestions: [
      'What is the difference between an Interface and a Type Alias in TypeScript?',
      'Why is "unknown" safer to use than "any"?',
      'How does TypeScript handle generic constraints like <T extends object>?'
    ]
  }
};
