function money(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function CreditReadout({ credits, bet, streak }) {
  return (
    <dl className="readout">
      <div>
        <dt>Credits</dt>
        <dd>{money(credits)}</dd>
      </div>
      <div>
        <dt>Bet</dt>
        <dd>{money(bet)}</dd>
      </div>
      <div>
        <dt>Streak</dt>
        <dd>{streak}</dd>
      </div>
    </dl>
  )
}
