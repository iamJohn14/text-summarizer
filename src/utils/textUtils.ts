// Function to calculate word count
export const countWords = (text: string): number => {
  return text.split(/\s+/).filter(Boolean).length;
};

// Function to calculate character count
export const countChars = (text: string): number => {
  return text.length;
};
