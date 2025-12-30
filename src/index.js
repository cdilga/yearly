/**
 * Yearly - Visualize how many days you have in a year
 * A beautiful dot grid showing your year's progress with minute-level accuracy
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return handleHome(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleHome(request) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yearly - Your Year in Dots</title>
        <meta name="description" content="Visualize how many days you have in a year">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes dotPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          body {
            background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
            min-height: 100vh;
            overflow-x: hidden;
          }

          .dot {
            border-radius: 50%;
            transition: all 0.3s ease;
            animation: dotPop 0.5s ease-out backwards;
          }

          .dot:hover {
            transform: scale(1.3);
          }

          .dot-filled {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
          }

          .dot-half {
            background: linear-gradient(90deg, #667eea 50%, rgba(255, 255, 255, 0.1) 50%);
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
          }

          .dot-empty {
            background: rgba(255, 255, 255, 0.1);
          }

          .container {
            animation: fadeIn 0.8s ease-out;
          }

          .year-title {
            background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }

          .stats {
            animation: fadeIn 1s ease-out 0.3s backwards;
          }

          .current-dot {
            animation: pulse 2s ease-in-out infinite;
          }
        </style>
      </head>
      <body class="flex items-center justify-center p-4 md:p-8">
        <div class="container max-w-4xl w-full">
          <!-- Year Title -->
          <div class="text-center mb-8 md:mb-12">
            <h1 class="year-title text-5xl md:text-7xl font-bold mb-2" id="yearTitle">2025</h1>
            <p class="text-gray-400 text-sm md:text-base">Your year in dots</p>
          </div>

          <!-- Dot Grid -->
          <div class="flex justify-center mb-8 md:mb-12">
            <div id="dotGrid" class="grid gap-2 md:gap-3" style="grid-template-columns: repeat(auto-fit, minmax(8px, 1fr)); max-width: 600px;">
              <!-- Dots will be generated here -->
            </div>
          </div>

          <!-- Stats -->
          <div class="stats text-center space-y-2">
            <div class="text-xl md:text-2xl">
              <span id="daysLeft" class="text-red-400 font-bold">0d</span>
              <span class="text-gray-400 mx-2">left</span>
              <span class="text-gray-400">•</span>
              <span id="percentage" class="text-purple-400 font-bold ml-2">0%</span>
            </div>
            <div class="text-gray-500 text-sm md:text-base" id="detail">
              <!-- Minute-level detail will appear here -->
            </div>
          </div>

          <!-- Footer -->
          <div class="text-center mt-12 text-gray-600 text-xs md:text-sm">
            <p>Time is precious. Make every dot count.</p>
          </div>
        </div>

        <script>
          // Calculate year progress with minute-level accuracy
          function calculateYearProgress() {
            const now = new Date();
            const year = now.getFullYear();
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year + 1, 0, 1);

            const totalDays = Math.floor((endOfYear - startOfYear) / (1000 * 60 * 60 * 24));
            const totalMinutes = totalDays * 24 * 60;

            const elapsedMs = now - startOfYear;
            const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
            const elapsedDays = elapsedMinutes / (24 * 60);

            const percentage = (elapsedDays / totalDays) * 100;
            const daysLeft = totalDays - Math.floor(elapsedDays);

            // Calculate the current dot index (0-based)
            const currentDotIndex = Math.floor(elapsedDays);

            // Calculate if we need a half dot (based on time of day)
            const minutesIntoCurrentDay = (elapsedMinutes % (24 * 60));
            const halfDay = 12 * 60; // noon
            const needsHalfDot = minutesIntoCurrentDay >= halfDay && minutesIntoCurrentDay < (24 * 60);

            return {
              year,
              totalDays,
              elapsedDays: Math.floor(elapsedDays),
              currentDotIndex,
              needsHalfDot,
              percentage: percentage.toFixed(1),
              daysLeft,
              hoursLeft: Math.floor((daysLeft * 24) - (minutesIntoCurrentDay / 60)),
              minutesLeft: (24 * 60) - minutesIntoCurrentDay
            };
          }

          // Track if initial animation has played
          let initialAnimationPlayed = false;

          // Render the dot grid
          function renderDotGrid(skipAnimation = false) {
            const progress = calculateYearProgress();
            const dotGrid = document.getElementById('dotGrid');

            // Set grid columns based on screen size
            const isMobile = window.innerWidth < 640;
            const columns = isMobile ? 15 : 20;
            dotGrid.style.gridTemplateColumns = \`repeat(\${columns}, 1fr)\`;

            // Clear existing dots
            dotGrid.innerHTML = '';

            // Create dots
            for (let i = 0; i < progress.totalDays; i++) {
              const dot = document.createElement('div');
              dot.className = 'dot';

              // Size based on screen
              const size = isMobile ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4';
              dot.classList.add(...size.split(' '));

              if (i < progress.currentDotIndex) {
                // Fully elapsed day
                dot.classList.add('dot-filled');
              } else if (i === progress.currentDotIndex && progress.needsHalfDot) {
                // Current day with half dot (past noon)
                dot.classList.add('dot-half', 'current-dot');
              } else if (i === progress.currentDotIndex) {
                // Current day (before noon)
                dot.classList.add('dot-filled', 'current-dot');
              } else {
                // Future day
                dot.classList.add('dot-empty');
              }

              // Only animate on initial load, not on resize
              if (!skipAnimation && !initialAnimationPlayed) {
                dot.style.animationDelay = \`\${i * 2}ms\`;
              } else {
                // Skip animation by setting it to none
                dot.style.animation = 'none';
              }

              // Tooltip
              const dayNumber = i + 1;
              const date = new Date(progress.year, 0, dayNumber);
              dot.title = \`Day \${dayNumber} - \${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\`;

              dotGrid.appendChild(dot);
            }

            // Mark that initial animation has played
            if (!skipAnimation) {
              initialAnimationPlayed = true;
            }
          }

          // Update stats
          function updateStats() {
            const progress = calculateYearProgress();

            document.getElementById('yearTitle').textContent = progress.year;
            document.getElementById('daysLeft').textContent = \`\${progress.daysLeft}d\`;
            document.getElementById('percentage').textContent = \`\${progress.percentage}%\`;

            // Detailed time remaining
            const hoursInDay = Math.floor(progress.minutesLeft / 60);
            const minutesInHour = progress.minutesLeft % 60;
            document.getElementById('detail').textContent =
              \`\${hoursInDay}h \${minutesInHour}m until the next day\`;
          }

          // Initialize
          function init() {
            renderDotGrid();
            updateStats();

            // Update every minute (skip animation on updates)
            setInterval(() => {
              renderDotGrid(true);
              updateStats();
            }, 60000);

            // Update stats every second for smoother countdown
            setInterval(updateStats, 1000);

            // Re-render on resize (skip animation to prevent retrigger on mobile browser chrome changes)
            let resizeTimeout;
            window.addEventListener('resize', () => {
              clearTimeout(resizeTimeout);
              resizeTimeout = setTimeout(() => {
                renderDotGrid(true);
              }, 250);
            });
          }

          // Start when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
          } else {
            init();
          }
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
