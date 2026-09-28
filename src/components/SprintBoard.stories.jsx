import { sprint } from '../agile/sprint'
import { SprintBoard } from './SprintBoard'

export default {
  title: 'Lab/SprintBoard',
  component: SprintBoard,
}

export const CurrentSprint = {
  args: { sprint },
}
