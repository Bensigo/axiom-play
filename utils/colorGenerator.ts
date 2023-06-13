const colorNames: string[] = [
  'green', 'blue', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'black',
  'cyan', 'magenta', 'lime', 'teal', 'olive', 'navy', 'maroon', 'silver', 'gold', 'indigo'
];

export function getRandomColors(): string[] {
  const colors: string[] = [];

  while (colors.length < 20) {
    const color = getRandomColorName();

    if (!colors.includes(color)) {
      colors.push(color);
    }
  }

  return colors;
}

function getRandomColorName(): string {
  const randomIndex = Math.floor(Math.random() * colorNames.length);
  return colorNames[randomIndex];
}
