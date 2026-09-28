import { columns } from '../agile/sprint'

export function SprintBoard({ sprint }) {
  return (
    <section className="sprint">
      <header className="sprint-head">
        <h2>{sprint.name}</h2>
        <p>{sprint.goal}</p>
      </header>
      <div className="sprint-columns">
        {columns.map((column) => (
          <div key={column} className="sprint-column">
            <h3>{column}</h3>
            {sprint.stories
              .filter((story) => story.status === column)
              .map((story) => (
                <article key={story.id} className="story-card">
                  <p className="story-id">
                    {story.id}
                    <span>{story.points} pts</span>
                  </p>
                  <h4>{story.title}</h4>
                  <p>{story.acceptance}</p>
                </article>
              ))}
          </div>
        ))}
      </div>
    </section>
  )
}
