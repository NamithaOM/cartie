// 🔹 Grid Function
function grid() {
  const dfs = function (grid, k, i, counter) {
    if (grid?.[k]?.[i] !== '1') return;
    grid[k][i] = counter.toString();
    dfs(grid, k + 1, i, counter);
    dfs(grid, k - 1, i, counter);
    dfs(grid, k, i + 1, counter);
    dfs(grid, k, i - 1, counter);
  };

  const numIslands = function (grid) {
    let counter = 0;
    for (let k = 0; k < grid.length; k++) {
      for (let i = 0; i < grid[k].length; i++) {
        if (grid[k][i] === '1') {
          dfs(grid, k, i, counter);
          counter++;
        }
      }
    }
    return counter;
  };

  const gridData = [
    ["0", "0", "0", "0", "0"],
    ["0", "1", "1", "1", "0"],
    ["0", "1", "1", "1", "0"],
    ["0", "0", "0", "0", "0"]
  ];

  const result = numIslands(gridData);
  document.getElementById('gridOutput').innerText = `Number of islands: ${result}`;
}

// 🔹 Points Function
function points() {
  const minTimeToVisitAllPoints = (points) => {
    let times = 0;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      times += Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    }
    return times;
  };

  const pointsData = [[1, 1], [3, 4], [-1, 0]];
  const result = minTimeToVisitAllPoints(pointsData);
  document.getElementById("pointsOutput").innerText = `Minimum time: ${result}`;
}

// 🔹 Call both on page load
document.addEventListener("DOMContentLoaded", () => {
  grid();
  points();
});
