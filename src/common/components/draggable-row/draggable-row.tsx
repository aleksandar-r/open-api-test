/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import * as Mui from '@mui/material';

type Column<T> = {
  id: string;
  cell: (row: T) => React.ReactNode;
};

type MuiSortableTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  setData: (rows: T[]) => void;
  getRowId: (row: T) => string;
};

// Row Drag Handle
export const MuiRowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    <Mui.IconButton {...attributes} {...listeners} size="small">
      🟰
    </Mui.IconButton>
  );
};

// Draggable Row
const MuiDraggableRow = <T,>({
  row,
  columns
}: {
  row: T;
  columns: Column<T>[];
}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: (row as any).id // optionally improve this if `id` is typed
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  };

  return (
    <Mui.TableRow ref={setNodeRef} style={style} hover>
      {columns.map((col) => (
        <Mui.TableCell key={col.id}>{col.cell(row)}</Mui.TableCell>
      ))}
    </Mui.TableRow>
  );
};

// Sortable Table
export const MuiSortableTable = <T,>({
  columns,
  data,
  setData,
  getRowId
}: MuiSortableTableProps<T>) => {
  const ids = React.useMemo(() => data.map(getRowId), [data, getRowId]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id as string);
      const newIndex = ids.indexOf(over.id as string);
      setData(arrayMove(data, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Mui.TableBody>
          {data.map((row) => (
            <MuiDraggableRow key={getRowId(row)} row={row} columns={columns} />
          ))}
        </Mui.TableBody>
      </SortableContext>
    </DndContext>
  );
};
