export function ActionButton({ children, onClick, disabled = false }) {
  return (
    <button className="action-button" type="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
