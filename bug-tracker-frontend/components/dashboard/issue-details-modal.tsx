'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Trash2, Send } from 'lucide-react'

interface Issue {
  id?: string
  _id?: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  createdAt: string
}

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
}

interface IssueDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  issue: Issue
  projectId: string
  onIssueUpdated: () => void
}

export default function IssueDetailsModal({
  isOpen,
  onClose,
  issue,
  projectId,
  onIssueUpdated,
}: IssueDetailsModalProps) {
  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(issue.description)
  const [status, setStatus] = useState(issue.status)
  const [priority, setPriority] = useState(issue.priority)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, issue.id])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      console.log("=== Fetch Comments ===");
      console.log("Issue object:", issue);
      console.log("Issue ID:", issue.id);
      console.log("Issue _id:", issue._id);
      
      // Use same ID fallback logic
      const issueId = issue.id || issue._id;
      console.log("Using issue ID for fetch:", issueId);
      
      if (!issueId) {
        console.error("Both issue.id and issue._id are undefined in fetchComments!");
        return;
      }
      
      console.log("Fetching comments for issue:", issueId);
      const data = await api.getComments(issueId)
      console.log("Comments response:", data);
      setComments(Array.isArray(data) ? data : data.comments || [])
    } catch (error: any) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      console.log("=== Handle Save ===");
      console.log("Issue object:", issue);
      console.log("Issue ID:", issue.id);
      console.log("Issue _id:", issue._id);
      console.log("All issue keys:", Object.keys(issue));
      
      // Try both id and _id fields
      const issueId = issue.id || issue._id;
      console.log("Using issue ID:", issueId);
      
      if (!issueId) {
        console.error("Both issue.id and issue._id are undefined!");
        console.error("Complete issue object:", JSON.stringify(issue, null, 2));
        toast.error('Issue ID is missing')
        return;
      }
      
      // Convert frontend status to MongoDB format
      const statusMap = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done'
      };
      
      await api.updateIssue(issueId, {
        title,
        description,
        status: statusMap[status] || status,
        priority,
      })
      toast.success('Issue updated')
      onIssueUpdated()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update issue')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      console.log("=== Add Comment ===");
      console.log("Issue object:", issue);
      console.log("Issue ID:", issue.id);
      console.log("Issue _id:", issue._id);
      
      // Use same ID fallback logic as handleSave
      const issueId = issue.id || issue._id;
      console.log("Using issue ID for comment:", issueId);
      
      if (!issueId) {
        console.error("Both issue.id and issue._id are undefined in handleAddComment!");
        toast.error('Issue ID is missing')
        return;
      }
      
      setIsSaving(true)
      console.log("Creating comment with data:", {
        content: newComment,
        issueId: issueId,
        projectId: projectId
      });
      
      await api.createComment({
        content: newComment,
        issueId: issueId,
        projectId: projectId
      })
      
      console.log("Comment created, fetching comments...");
      setNewComment('')
      await fetchComments()
      toast.success('Comment added')
    } catch (error: any) {
      console.error("Add comment error:", error);
      toast.error(error.message || 'Failed to add comment')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this issue?')) return

    try {
      // Delete functionality not implemented yet
      toast.error('Delete functionality not available')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete issue')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Issue Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSaving}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={4}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Status
              </label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Priority
              </label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Comments</h3>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      {comment.author}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {comment.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSaving}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment()
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleAddComment}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Close
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
