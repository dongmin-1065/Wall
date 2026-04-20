'use client';
import { useState, useEffect, useTransition } from "react";
import PostItem from "./PostItem";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, TouchSensor } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { updatePostOrder } from "@/lib/supabase/actions";

export default function PostList({ posts }: { posts: any[] }) {
  const [items, setItems] = useState(posts);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Sync external sorted data
    setItems(posts);
  }, [posts]);

  // Support mobile dragging via TouchSensor along with Pointer
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((p) => p.id === active.id);
      const newIndex = items.findIndex((p) => p.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      setItems(newItems);
      
      // Background DB Sync
      const updates = newItems.map((item, index) => ({
        id: item.id,
        sort_order: newItems.length - index // Re-assign sort_orders dynamically descending
      }));
      
      startTransition(() => {
        updatePostOrder(updates);
      });
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur rounded-2xl border border-yellow-200/50 shadow-sm text-center">
        <span className="text-5xl mb-4 opacity-50">📭</span>
        <h3 className="text-lg font-bold text-slate-800">아직 메모가 없습니다.</h3>
        <p className="text-slate-500 mt-1">첫 번째 메모를 남겨주세요!</p>
      </div>
    );
  }

  return (
    <DndContext id="dnd-board" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
