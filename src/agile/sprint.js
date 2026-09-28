export const sprint = {
  name: 'Sprint 1',
  goal: 'One running lab, with a real job for every layer of the stack.',
  stories: [
    {
      id: 'US-1',
      points: 2,
      status: 'Done',
      title: 'Serve the app with Vite',
      acceptance: 'npm run dev opens the lab from source modules.',
    },
    {
      id: 'US-2',
      points: 3,
      status: 'Done',
      title: 'Keep credits in Redux',
      acceptance: 'A round updates credits, the bet, and the history.',
    },
    {
      id: 'US-3',
      points: 2,
      status: 'Done',
      title: 'Keep view toggles in Context',
      acceptance: 'Spine playback and the guide toggle do not enter the store.',
    },
    {
      id: 'US-4',
      points: 5,
      status: 'Done',
      title: 'Draw the stage with Pixi on WebGL',
      acceptance: 'A coin moves every frame on a canvas.',
    },
    {
      id: 'US-5',
      points: 5,
      status: 'Done',
      title: 'Play a Spine skeleton on that stage',
      acceptance: 'The arm loops an animation from mascot.json.',
    },
    {
      id: 'US-6',
      points: 2,
      status: 'Done',
      title: 'Plot credit history on a 2D canvas',
      acceptance: 'The line redraws after each round.',
    },
    {
      id: 'US-7',
      points: 3,
      status: 'Done',
      title: 'Bundle a standalone widget with Webpack',
      acceptance: 'npm run build:webpack writes dist-webpack.',
    },
    {
      id: 'US-8',
      points: 3,
      status: 'Done',
      title: 'Open components in Storybook',
      acceptance: 'Stories render without the Redux store.',
    },
    {
      id: 'US-9',
      points: 2,
      status: 'In progress',
      title: 'Walk the stack with a teammate',
      acceptance: 'Each technology can be pointed at in the running lab.',
    },
    {
      id: 'US-10',
      points: 3,
      status: 'Backlog',
      title: 'Add a second Spine animation',
      acceptance: 'A win pose plays when a round pays.',
    },
  ],
}

export const columns = ['Backlog', 'In progress', 'Done']
