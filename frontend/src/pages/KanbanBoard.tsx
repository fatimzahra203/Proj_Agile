import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useDroppable
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Link } from 'react-router-dom';

// Types
interface TaskItem {
  id: string;
  content: string;
  column: string;
  assignee?: string;
}

interface TeamMember {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  sector: string;
  date: string;
  team: TeamMember[];
}

// Column component
const Column: React.FC<{
  title: string;
  color: string;
  tasks: TaskItem[];
  onDragEnd: (taskId: string, newColumn: string) => void;
  id: string; // Add ID prop to identify columns
}> = ({ title, color, tasks, onDragEnd, id }) => {
  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: `${id}-column`,
    data: {
      type: 'column',
      columnId: id
    }
  });
  
  // Color mapping
  const getColorClass = () => {
    switch (color) {
      case 'grey': return 'bg-gray-100 border-gray-300';
      case 'orange': return 'bg-amber-100 border-amber-300';
      case 'blue': return 'bg-blue-100 border-blue-300';
      case 'red': return 'bg-red-100 border-red-300';
      case 'green': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getHeaderColorClass = () => {
    switch (color) {
      case 'grey': return 'bg-gray-200 text-gray-800';
      case 'orange': return 'bg-amber-200 text-amber-800';
      case 'blue': return 'bg-blue-200 text-blue-800';
      case 'red': return 'bg-red-200 text-red-800';
      case 'green': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div 
      className={`flex flex-col rounded-lg ${getColorClass()} border shadow-sm h-full`}
      data-column-id={id} // Add data attribute to identify column during drag operations
    >
      <div className={`p-3 ${getHeaderColorClass()} rounded-t-lg font-medium`}>
        {title} ({tasks.length})
      </div>
      <div 
        ref={setNodeRef}
        className={`flex-1 p-2 overflow-y-auto max-h-[calc(100vh-240px)] ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset' : ''
        } transition-colors duration-200`}
        data-column-id={id}
      >
        <div className="space-y-2 min-h-[100px]">
          <SortableContext 
            items={tasks.map(task => task.id)} 
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <SortableTask 
                key={task.id} 
                task={task} 
                onDragEnd={(taskId) => onDragEnd(taskId, id)} 
              />
            ))}
          </SortableContext>
          {isOver && tasks.length === 0 && (
            <div className="h-20 border-2 border-dashed border-blue-300 rounded-md flex items-center justify-center">
              <p className="text-blue-400 text-sm">Drop here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Task Card Component (Used for both Sortable task and Drag Overlay)
const TaskCard: React.FC<{ 
  task: TaskItem; 
  isDragging?: boolean;
}> = ({ task, isDragging = false }) => {
  return (
    <div className={`bg-white p-3 rounded shadow-sm border ${
      isDragging 
        ? 'border-blue-400 ring-1 ring-blue-300 ring-opacity-50 bg-blue-50' 
        : 'border-gray-200'
    } cursor-grab active:cursor-grabbing transition-colors duration-200`}>
      <div className="font-medium text-gray-800">{task.content}</div>
      {task.assignee && (
        <div className="mt-2 flex items-center">
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium mr-1">
            {task.assignee.charAt(0)}
          </div>
          <span className="text-xs text-gray-500">{task.assignee}</span>
        </div>
      )}
    </div>
  );
};

// Draggable Task Component
const SortableTask: React.FC<{ 
  task: TaskItem;
  onDragEnd: (id: string) => void;
  isDragging?: boolean;
}> = ({ task, onDragEnd, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1, // Make the original item semi-transparent when dragging
    zIndex: isSortableDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-shadow duration-200 ${isSortableDragging || isDragging ? 'shadow-md' : ''}`}
    >
      <TaskCard task={task} isDragging={isDragging || isSortableDragging} />
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const location = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Column definitions
  const columns = [
    { id: 'tasks', title: 'Tasks', color: 'grey' },
    { id: 'ready', title: 'Ready', color: 'orange' },
    { id: 'ongoing', title: 'On Going', color: 'blue' },
    { id: 'onhold', title: 'On Hold', color: 'red' },
    { id: 'done', title: 'Done', color: 'green' }
  ];
  
  // Mock tasks data - this would typically come from an API
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'task-1', content: 'Design login page', column: 'tasks', assignee: 'John Doe' },
    { id: 'task-2', content: 'Implement authentication', column: 'ready', assignee: 'Jane Smith' },
    { id: 'task-3', content: 'Create dashboard layout', column: 'ongoing', assignee: 'Mike Johnson' },
    { id: 'task-4', content: 'Fix responsive issues', column: 'onhold', assignee: 'Sarah Williams' },
    { id: 'task-5', content: 'Unit testing', column: 'done', assignee: 'Chris Martin' },
    { id: 'task-6', content: 'API integration', column: 'tasks', assignee: 'Emily Brown' },
    { id: 'task-7', content: 'Documentation', column: 'ready', assignee: 'Alex Wilson' },
    { id: 'task-8', content: 'Deployment setup', column: 'ongoing', assignee: 'David Miller' },
    { id: 'task-9', content: 'Performance optimization', column: 'tasks', assignee: 'Linda Garcia' },
  ]);

  // Find active task when dragging
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  // Set up sensors for drag detection with improved touch sensitivity
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation (in pixels)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Custom drop animation
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  useEffect(() => {
    // Check if we have project data in the location state
    if (location.state?.projectData) {
      setProject(location.state.projectData);
      
      // If we had actual API, we would fetch project-specific tasks here
      // For now, just simulate project-specific tasks
      if (location.state.projectData.id) {
        // This would be an API call in a real app
        // setTasks(fetchedTasks);
      }
    }
  }, [location]);
  
  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    setActiveId(activeId);
    
    // Find the task that's being dragged
    const activeTask = tasks.find(task => task.id === activeId);
    // We don't need to set activeTask as a state since we find it directly from the tasks array
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear active id
    setActiveId(null);
    
    if (!over) return;
    
    const activeId = String(active.id);
    const overId = String(over.id);
    
    // Find the source task
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;
    
    // Determine the target column based on the over.id
    // Format of over.id is either a task id or columnId-column
    let targetColumnId = '';
    
    if (overId.includes('-column')) {
      // Dropped directly on a column
      targetColumnId = overId.split('-column')[0];
    } else {
      // Dropped on another task, find that task's column
      const overTask = tasks.find(t => t.id === overId);
      targetColumnId = overTask ? overTask.column : '';
    }
    
    // If we have a valid target column and it's different from the current column
    if (targetColumnId && targetColumnId !== activeTask.column) {
      console.log(`Moving task ${activeId} from ${activeTask.column} to ${targetColumnId}`);
      setTasks(tasks.map(task => 
        task.id === activeId ? { ...task, column: targetColumnId } : task
      ));
    }
  };

  // Function to handle moving a task between columns
  const moveTask = (taskId: string, newColumn: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, column: newColumn } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo2.png" alt="AgileFlow Logo" className="h-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgileFlow</h1>
              {project && (
                <p className="text-sm text-blue-600">
                  Project: <span className="font-medium">{project.name}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/dashboard" 
              state={{ selectedProject: project }} 
              className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-3 py-1.5 text-sm rounded-lg shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Kanban Board</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {columns.map(column => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={tasks.filter(task => task.column === column.id)}
                onDragEnd={moveTask}
              />
            ))}

            {/* Drag Overlay - what appears when dragging */}
            <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
              {activeId && activeTask ? (
                <div>
                  <TaskCard task={activeTask} isDragging={true} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
};

export default KanbanBoard;