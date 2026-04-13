'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import IssueDetailsModal from './issue-details-modal'

interface Issue {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done' | 'To Do' | 'In Progress' | 'Done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  createdAt: string
}

interface KanbanBoardProps {
  issues: Issue[]
  projectId: string
  onIssueUpdated: () => void
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-50 dark:bg-slate-900' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'done', title: 'Done', color: 'bg-green-50 dark:bg-green-900/20' },
]

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function KanbanBoard({
  issues,
  projectId,
  onIssueUpdated,
}: KanbanBoardProps) {
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const groupedIssues = {
    todo: issues.filter((i) => i.status === 'todo' || i.status === 'To Do'),
    'in-progress': issues.filter((i) => i.status === 'in-progress' || i.status === 'In Progress'),
    done: issues.filter((i) => i.status === 'done' || i.status === 'Done'),
  }

  const handleDragStart = (issue: Issue) => {
    console.log("=== DRAG START ===");
    console.log("Dragging issue:", issue);
    setDraggedIssue(issue)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (status: 'todo' | 'in-progress' | 'done') => {
    if (!draggedIssue) return

    if (draggedIssue.status === status) {
      setDraggedIssue(null)
      return
    }

    try {
      // Convert frontend status to MongoDB format
      const statusMap = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done'
      };
      
      // Update in backend with correct status
      await api.updateIssue(draggedIssue.id, { status: statusMap[status] })
      
      // Trigger parent refresh to update UI
      onIssueUpdated()
      toast.success('Issue updated')
    } catch (error: any) {
      console.error('Drop error:', error)
      toast.error(error.message || 'Failed to update issue')
    } finally {
      setDraggedIssue(null)
    }
  }

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id as 'todo' | 'in-progress' | 'done')}
            className={`rounded-lg p-4 min-h-screen ${column.color} transition-colors`}
          >
            <div className="mb-4">
              <h2 className="font-semibold text-foreground text-lg">
                {column.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {groupedIssues[column.id as keyof typeof groupedIssues].length} issues
              </p>
            </div>

            <div className="space-y-3">
              {groupedIssues[column.id as keyof typeof groupedIssues].map((issue) => (
                <div
                  key={issue.id}
                  draggable
                  onDragStart={() => handleDragStart(issue)}
                  onClick={() => handleIssueClick(issue)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card className="p-4 hover:shadow-md transition-all duration-300 ease-in-out hover:border-primary/50 border cursor-pointer group">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        className={priorityColors[issue.priority]}
                        variant="outline"
                      >
                        {issue.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedIssue && (
        <IssueDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          issue={selectedIssue}
          projectId={projectId}
          onIssueUpdated={() => {
            onIssueUpdated()
            setShowDetailsModal(false)
          }}
        />
      )}
    </>
  )
}
