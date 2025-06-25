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

export const MuiRowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    <Mui.IconButton {...attributes} {...listeners} size="small">
      🟰
    </Mui.IconButton>
  );
};

const MuiDraggableRow = ({ row, columns }: any) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id
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
      {columns.map((col: any) => (
        <Mui.TableCell key={col.id}>{col.cell(row)}</Mui.TableCell>
      ))}
    </Mui.TableRow>
  );
};

export const MuiSortableTable = ({ columns, data, setData, getRowId }: any) => {
  const ids = React.useMemo(
    () => data.map((row: any) => getRowId(row)),
    [data, getRowId]
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      const reordered = arrayMove(data, oldIndex, newIndex);
      setData(reordered);
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
          {data.map((row: any) => (
            <MuiDraggableRow key={getRowId(row)} row={row} columns={columns} />
          ))}
        </Mui.TableBody>
      </SortableContext>
    </DndContext>
  );
};
