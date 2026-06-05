const rows = [
  { id: "radcn-101", owner: "Ada", status: "Done", task: "Port chart" },
  { id: "radcn-102", owner: "Grace", status: "Review", task: "Document block" },
  { id: "radcn-103", owner: "Katherine", status: "Todo", task: "Verify recipe" },
]

function TaskTable({ selected = false, sort = false }: { selected?: boolean; sort?: boolean }) {
  return (
    <table className="reference-data-table-table">
      <caption>Dashboard tasks recipe block.</caption>
      <thead>
        <tr>
          <th>Select</th>
          <th>{sort ? <a aria-sort="ascending" href="/fixtures/data-table/sort-filter?sort=task">Task ↑</a> : "Task"}</th>
          <th>Status</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr className={selected && index === 0 ? "reference-data-table-row-selected" : undefined} key={row.id}>
            <td><input checked={selected && index === 0} name="rows" readOnly type="checkbox" value={row.id} /></td>
            <td>{row.task}</td>
            <td><span className="reference-data-table-badge">{row.status}</span></td>
            <td>{row.owner}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Shell({ children, custom = false }: { children: React.ReactNode; custom?: boolean }) {
  return <section className={`reference-data-table ${custom ? "reference-fixture-custom-data-table" : ""}`}>{children}</section>
}

export function renderDataTableFixture(scenario: string) {
  if (scenario === "sort-filter") {
    return (
      <Shell>
        <form className="reference-data-table-toolbar" action="/fixtures/data-table/sort-filter" method="get">
          <label>Filter tasks <input className="reference-input" name="q" defaultValue="port" /></label>
          <button className="reference-button" name="intent" type="submit" value="filter">Apply</button>
        </form>
        <TaskTable sort />
      </Shell>
    )
  }
  if (scenario === "selection") {
    return <Shell><p>1 row selected</p><TaskTable selected /></Shell>
  }
  if (scenario === "pagination") {
    return <Shell><TaskTable /><nav className="reference-data-table-pagination"><a aria-current="page" href="?page=1">1</a><a href="?page=2">2</a></nav></Shell>
  }
  if (scenario === "row-actions") {
    return <Shell><TaskTable /><div className="reference-actions"><button className="reference-button reference-button-outline">Open row</button><button className="reference-button reference-button-outline">Duplicate</button></div></Shell>
  }
  if (scenario === "responsive-detail") {
    return <Shell><TaskTable selected /><aside className="reference-data-table-detail"><strong>Port chart</strong><p>Responsive detail panels are recipe code composed beside the table.</p></aside></Shell>
  }
  if (scenario === "custom-token") {
    return <Shell custom><TaskTable /></Shell>
  }
  return <Shell><div className="reference-data-table-toolbar"><strong>Dashboard tasks</strong><button className="reference-button reference-button-outline">All statuses</button></div><TaskTable /></Shell>
}
