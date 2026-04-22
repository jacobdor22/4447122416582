// fetches a motivational tip from the Advice Slip API based on current streak
export async function fetchStreakFact(streak: number): Promise<string> {
  try {
    if (streak === 0) return 'Start logging today to build your streak!';
    const response = await fetch('https://api.adviceslip.com/advice');
    if (!response.ok) throw new Error('Failed');
    const json = await response.json();
    return `"${json.slip.advice}"`;
  } catch (error) {
    // fallback if API is unavailable
    return `${streak} days and counting — keep it up!`;
  }
}

// fetches a second motivational tip for the daily motivation card
export async function fetchDateFact(): Promise<string> {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    if (!response.ok) throw new Error('Failed');
    const json = await response.json();
    return `"${json.slip.advice}"`;
  } catch (error) {
    // fallback shows today's date if the API call fails
    const now = new Date();
    return `Today is ${now.toLocaleDateString('en-IE', { weekday: 'long', month: 'long', day: 'numeric' })} — make it count!`;
  }
}