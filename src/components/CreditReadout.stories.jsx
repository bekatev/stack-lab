import { CreditReadout } from './CreditReadout'

export default {
  title: 'Lab/CreditReadout',
  component: CreditReadout,
}

export const Starting = {
  args: { credits: 1000, bet: 10, streak: 0 },
}

export const AfterWin = {
  args: { credits: 1250, bet: 25, streak: 4 },
}

export const Short = {
  args: { credits: 5, bet: 10, streak: 0 },
}
