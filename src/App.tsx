import './App.css'
import { useCallback } from 'react'
import { createStore } from 'tinybase'
import { createCrSqliteWasmPersister } from 'tinybase/persisters/persister-cr-sqlite-wasm'
import type {
  CellProps,
  RowProps,
} from 'tinybase/ui-react'
import {
  SortedTableView,
  useCell,
  useCreatePersister,
  useCreateStore,
  useDelTableCallback,
  useSetCellCallback,
} from 'tinybase/ui-react'
import type { DB } from '@vlcn.io/crsqlite-wasm'
import { useDB, useSync } from '@vlcn.io/react'
import reactLogo from './assets/react.svg'
import tinybaseLogo from './assets/tinybase.svg'
import vlcnLogo from './assets/vlcn.png'
import randomWords from './support/randomWords.js'
import SyncWorker from './sync-worker.js?worker'

const wordOptions = { exactly: 3, join: ' ' }

function getEndpoint() {
  let proto = 'ws:'
  const host = window.location.host
  if (window.location.protocol === 'https:') {
    proto = 'wss:'
  }

  return `${proto}//${host}/sync`
}

const worker = new SyncWorker()

function App({ dbname }: { dbname: string }) {
  const ctx = useDB(dbname)
  useSync({
    dbname,
    endpoint: getEndpoint(),
    room: dbname,
    worker,
  })

  const store = useCreateStore(createStore)
  useCreatePersister(
    store,
    store =>
      createCrSqliteWasmPersister(store, ctx.db as DB, {
        mode: 'tabular',
        tables: {
          load: { test: { tableId: 'test', rowIdColumnName: 'id' } },
          save: { test: { tableName: 'test', rowIdColumnName: 'id' } },
        },
      }),
    [ctx.db],
    async (persister) => {
      await persister.startAutoLoad()
      await persister.startAutoSave()
    },
  )

  const addData = useCallback(
    () =>
      store.setCell(
        'test',
        nanoid(10),
        'name',
        randomWords(wordOptions) as string,
      ),
    [store],
  )

  const dropData = useDelTableCallback('test', store)

  return (
    <>
      <div>
        <a href="https://vlcn.io" target="_blank" rel="noreferrer noopener">
          <img src={vlcnLogo} className="logo vlcn" alt="Vulcan logo" />
        </a>
        <a href="https://tinybase.org" target="_blank" rel="noreferrer noopener">
          <img src={tinybaseLogo} className="logo" alt="TinyBase logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>CR-SQLite + TinyBase + React</h1>
      <div className="card">
        <button type="button" onClick={addData} style={{ marginRight: '1em' }}>
          Add Data
        </button>
        <button type="button" onClick={dropData}>Drop Data</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <SortedTableView
              store={store}
              tableId="test"
              descending={false}
              rowComponent={DataRow}
            />
          </tbody>
        </table>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
        <p>
          Open another browser and navigate to
          {' '}
          <a href={window.location.href} target="_blank">
            this window's url
          </a>
          {' '}
          to test sync.
        </p>
      </div>
      <p className="read-the-docs">Click on the logos to learn more</p>
    </>
  )
}

function DataRow({ store, tableId, rowId }: RowProps) {
  return (
    <tr key={rowId}>
      <td>{rowId}</td>
      <td>
        <EditableItem
          store={store}
          tableId={tableId}
          rowId={rowId}
          cellId="name"
        />
      </td>
    </tr>
  )
}

function EditableItem({ store, tableId, rowId, cellId }: CellProps) {
  const handleChange = useSetCellCallback(
    tableId,
    rowId,
    cellId,
    (event: React.FormEvent<HTMLInputElement>) => event.currentTarget.value,
    [],
    store,
  )

  return (
    <input
      type="text"
      value={`${useCell(tableId, rowId, cellId, store)}`}
      onChange={handleChange}
    />
  )
}

export default App

function nanoid(t = 21) {
  return crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t
          // eslint-disable-next-line no-cond-assign
          += (e &= 63) < 36
            ? e.toString(36)
            : e < 62
              ? (e - 26).toString(36).toUpperCase()
              : e > 62
                ? '-'
                : '_'),
      '',
    )
}
