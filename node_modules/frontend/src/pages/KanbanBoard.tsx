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
          {tasks.map(task => (
            <SortableTask 
              key={task.id} 
              task={task} 
              onDragEnd={(taskId) => onDragEnd(taskId, id)} 
            />
          ))}
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
        ? 'border-blue-400 shadow-md border-2 border-blue-300' 
        : 'border-gray-200'
    } cursor-grab active:cursor-grabbing transition-colors duration-100`}>
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
      className={`transition-all duration-200 ease-in-out ${isSortableDragging || isDragging ? 'shadow-md' : ''}`}
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
  
  // Fetch tasks and team members from backend
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Fetch tasks
    fetch('http://localhost:3001/api/tasks')
      .then(res => res.json())
      .then(data => {
        // Map backend tasks to Kanban columns
        const mappedTasks = data.map((task: any) => {
          let column = 'tasks';
          switch (task.status) {
            case 'todo': column = 'tasks'; break;
            case 'ready': column = 'ready'; break;
            case 'ongoing': column = 'ongoing'; break;
            case 'onhold': column = 'onhold'; break;
            case 'done': column = 'done'; break;
            default: column = 'tasks';
          }
          return {
            id: String(task.id),
            content: task.title,
            column,
            assignee: task.assignee ? (task.assignee.username || task.assignee.email || String(task.assignee.id)) : undefined
          };
        });
        setTasks(mappedTasks);
      });
    // Fetch team members
    fetch('http://localhost:3001/api/users')
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
      });
  }, []);

  // Find active task when dragging
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  // Set up sensors for drag detection with improved touch sensitivity
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation (in pixels)
        delay: 150, // Small delay to avoid accidental drags
        tolerance: 5, // How much movement is allowed during delay
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
    // Optionally, set activeId for drag overlay
    setActiveId(activeId);
    // No backend update on drag start
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
    
    // Determine the target column
    let targetColumnId = '';
    
    // Check if the over.id contains "column" which means we're directly over a column
    if (overId.includes('-column')) {
      // Extract column id from "columnId-column" format
      targetColumnId = overId.replace('-column', '');
    } else {
      // If dropped on a task, get that task's column
      const overTask = tasks.find(t => t.id === overId);
      targetColumnId = overTask ? overTask.column : '';
      
      // If we still don't have a target column, try to get it from DOM
      if (!targetColumnId) {
        // Check if dropped on a column element directly
        let clientX = 0;
        let clientY = 0;
        const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent;
        if ('clientX' in activatorEvent && 'clientY' in activatorEvent) {
          clientX = activatorEvent.clientX;
          clientY = activatorEvent.clientY;
        } else if ('touches' in activatorEvent && activatorEvent.touches.length > 0) {
          clientX = activatorEvent.touches[0].clientX;
          clientY = activatorEvent.touches[0].clientY;
        }
        const overElement = document.elementFromPoint(clientX, clientY);
        if (overElement) {
          // Find the nearest column
          const column = overElement.closest('[data-column-id]');
          if (column) {
            const columnId = column.getAttribute('data-column-id');
            if (columnId) {
              targetColumnId = columnId;
            }
          }
        }
      }
    }
    
    // If we still don't have a target column, use the first column from our columns list
    if (!targetColumnId && columns.length > 0) {
      targetColumnId = columns[0].id;
    }
    
    console.log(`Moving task ${activeId} from ${activeTask.column} to ${targetColumnId}`);
    
    // If we have a valid target column, update the task and backend
    if (targetColumnId && targetColumnId !== activeTask.column) {
      moveTask(activeId, targetColumnId);
    }
  };

  // Function to handle moving a task between columns
  const moveTask = (taskId: string, newColumn: string) => {
    // Map column to backend status value
    let newStatus: 'todo' | 'ready' | 'ongoing' | 'onhold' | 'done';
    switch (newColumn) {
      case 'tasks':
        newStatus = 'todo';
        break;
      case 'ready':
        newStatus = 'ready';
        break;
      case 'ongoing':
        newStatus = 'ongoing';
        break;
      case 'onhold':
        newStatus = 'onhold';
        break;
      case 'done':
        newStatus = 'done';
        break;
      default:
        newStatus = 'todo'; // fallback
    }

    // Update frontend state immediately (also update status field)
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, column: newColumn, status: newStatus } : task
    ));

    // Send update to backend
    fetch(`http://localhost:3001/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        // Optionally update local state with backend response
        setTasks(prev => prev.map(task =>
          task.id === taskId ? { ...task, column: newColumn, status: data.status } : task
        ));
      });
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