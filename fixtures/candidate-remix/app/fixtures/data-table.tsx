import type { RemixNode } from 'remix/ui'
import type { FixtureScenario } from '../../../scenarios/types.ts'
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'radcn'

const rows = [
  { id: 'radcn-101', owner: 'Ada', status: 'Done', task: 'Port chart' },
  { id: 'radcn-102', owner: 'Grace', status: 'Review', task: 'Document block' },
  { id: 'radcn-103', owner: 'Katherine', status: 'Todo', task: 'Verify recipe' },
]

function DataTableShell({ children, custom = false }: { children: RemixNode; custom?: boolean }) {
  return (
    <section class={custom ? 'radcn-data-table-recipe radcn-fixture-custom-data-table' : 'radcn-data-table-recipe'} data-radcn-data-table-recipe>
      {children}
    </section>
  )
}

function TaskTable({ selected = false, sort = false }: { selected?: boolean; sort?: boolean }) {
  return (
    <Table dense>
      <TableCaption>Dashboard tasks recipe block.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead ariaSort={sort ? 'ascending' : undefined}>
            {sort ? <a data-radcn-data-table-sort href="/fixtures/data-table/sort-filter?sort=task">Task ↑</a> : 'Task'}
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow class={selected && index === 0 ? 'radcn-data-table-row--selected' : undefined}>
            <TableCell>
              <Checkbox checked={selected && index === 0} name="rows" value={row.id} />
            </TableCell>
            <TableCell>{row.task}</TableCell>
            <TableCell><Badge variant={row.status === 'Done' ? 'secondary' : 'outline'}>{row.status}</Badge></TableCell>
            <TableCell>{row.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function renderDataTableFixture(fixture: FixtureScenario) {
  if (fixture.id === 'sort-filter') {
    return DataTableShell({
      children: (
        <>
          <form action="/fixtures/data-table/sort-filter" method="get" style="display:flex;gap:12px;align-items:end;flex-wrap:wrap">
            <label style="display:grid;gap:6px">
              <span>Filter tasks</span>
              <Input name="q" value="port" />
            </label>
            <Button name="intent" type="submit" value="filter">Apply</Button>
          </form>
          {TaskTable({ sort: true })}
        </>
      ),
    })
  }

  if (fixture.id === 'selection') {
    return DataTableShell({
      children: (
        <>
          <p data-radcn-data-table-selection-summary>1 row selected</p>
          {TaskTable({ selected: true })}
        </>
      ),
    })
  }

  if (fixture.id === 'pagination') {
    return DataTableShell({
      children: (
        <>
          {TaskTable({})}
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationLink href="/fixtures/data-table/pagination?page=1" isActive>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="/fixtures/data-table/pagination?page=2">2</PaginationLink></PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ),
    })
  }

  if (fixture.id === 'row-actions') {
    return DataTableShell({
      children: (
        <>
          {TaskTable({})}
          <div data-radcn-data-table-row-actions style="display:flex;gap:12px">
            <Button variant="outline">Open row</Button>
            <Button variant="ghost">Duplicate</Button>
          </div>
        </>
      ),
    })
  }

  if (fixture.id === 'responsive-detail') {
    return DataTableShell({
      children: (
        <>
          {TaskTable({ selected: true })}
          <aside data-radcn-data-table-detail style="border:1px solid var(--radcn-border);border-radius:var(--radcn-radius);padding:12px">
            <strong>Port chart</strong>
            <p style="margin:6px 0 0;color:var(--radcn-muted-foreground)">Responsive detail panels are recipe code composed beside the table.</p>
          </aside>
        </>
      ),
    })
  }

  if (fixture.id === 'custom-token') {
    return DataTableShell({ children: TaskTable({}), custom: true })
  }

  return DataTableShell({
    children: (
      <>
        <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
          <strong>Dashboard tasks</strong>
          <Select value="all">
            <SelectTrigger ariaLabel="Status filter"><SelectValue placeholder="All statuses">All statuses</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {TaskTable({})}
      </>
    ),
  })
}
