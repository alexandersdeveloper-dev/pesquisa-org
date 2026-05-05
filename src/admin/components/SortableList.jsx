import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
    <circle cx="9"  cy="5"  r="1.5" /><circle cx="15" cy="5"  r="1.5" />
    <circle cx="9"  cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
    <circle cx="9"  cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
  </svg>
)

export function SortableTr({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        background: isDragging ? 'var(--bg-soft)' : undefined,
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      <td className="adm-drag-cell">
        <button className="adm-drag-handle" tabIndex={-1} {...attributes} {...listeners}>
          <GripIcon />
        </button>
      </td>
      {children}
    </tr>
  )
}

export function SortableTableBody({ items, onReorder, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(items, oldIdx, newIdx).map((i) => i.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <tbody>{children}</tbody>
      </SortableContext>
    </DndContext>
  )
}
