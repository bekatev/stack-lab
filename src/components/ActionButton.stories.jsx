import { ActionButton } from './ActionButton'

export default {
  title: 'Lab/ActionButton',
  component: ActionButton,
}

export const Ready = {
  args: { children: 'Grab', disabled: false },
}

export const Disabled = {
  args: { children: 'Grab', disabled: true },
}
