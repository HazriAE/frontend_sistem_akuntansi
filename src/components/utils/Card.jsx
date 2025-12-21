
const Card = ({ item }) => {
  return (
    <div className="stats shadow bg-base-100">
      <div className="stat">
        <div className="stat-title">{item.title}</div>
        <div className="stat-value text-primary">{item.count}</div>
      </div>
    </div>
  )
}

export default Card