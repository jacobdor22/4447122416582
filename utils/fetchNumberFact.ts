export async function fetchStreakFact(streak: number): Promise<string> {
  try {
    if (streak === 0) return 'Start logging today to build your streak!';
    const response = await fetch('https://api.adviceslip.com/advice');
    if (!response.ok) throw new Error('Failed');
    const json = await response.json();
    return `"${json.slip.advice}"`;
  } catch (error) {
    return `${streak} days and counting — keep it up!`;
  }
}

export async function fetchDateFact(): Promise<string> {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    if (!response.ok) throw new Error('Failed');
    const json = await response.json();
    return `"${json.slip.advice}"`;
  } catch (error) {
    const now = new Date();
    return `Today is ${now.toLocaleDateString('en-IE', { weekday: 'long', month: 'long', day: 'numeric' })} — make it count!`;
  }
}