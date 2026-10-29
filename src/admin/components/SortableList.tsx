import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface SortableListProps<T extends { id: string; order: number }> {
  items: T[];
  onReorder: (newOrderedIds: string[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T) => string;
}

export function SortableList<T extends { id: string; order: number }>({
  items,
  onReorder,
  renderItem,
  keyExtractor = (item) => item.id,
}: SortableListProps<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = items.findIndex((i) => i.id === sourceId);
    const targetIndex = items.findIndex((i) => i.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    const [moved] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    setDraggedId(null);
    onReorder(newItems.map((i) => i.id));
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    onReorder(newItems.map((i) => i.id));
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    onReorder(newItems.map((i) => i.id));
  };

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => {
        const isDragging = draggedId === item.id;
        return (
          <div
            key={keyExtractor(item)}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            onDragEnd={() => setDraggedId(null)}
            className={`group relative flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-3 transition-all duration-200 hover:border-[var(--border-strong)] overflow-hidden ${
              isDragging ? 'opacity-40 scale-[0.99] border-dashed border-[color:var(--color-brand-blue)]' : ''
            }`}
          >
            {/* Reorder Grip & Controls */}
            <div className="flex flex-col items-center justify-center gap-0.5 text-dim">
              <button
                type="button"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                className="p-0.5 hover:text-app disabled:opacity-20 transition-colors"
                title="Move up"
                aria-label="Move item up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <span
                className="cursor-grab active:cursor-grabbing p-0.5 text-dim group-hover:text-muted transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="p-0.5 hover:text-app disabled:opacity-20 transition-colors"
                title="Move down"
                aria-label="Move item down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Order index badge */}
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[var(--surface)] text-xs font-semibold text-dim border border-[var(--border)]">
              #{index + 1}
            </div>

            {/* Rendered Item Content */}
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
