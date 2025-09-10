const pastelColors = [
  "#A3D8F4", // bleu clair
  "#F7C5CC", // rose pastel
  "#C3FBD8", // vert pastel
  "#FDE2A2", // jaune pastel
  "#D6C1F5", // violet pastel
];

export function getRandomPastelColor() {
  const index = Math.floor(Math.random() * pastelColors.length);
  return pastelColors[index];
}
