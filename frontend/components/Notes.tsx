"use client"
import { useEffect, useState } from "react"
import { useSession,signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StickyNote, Plus, Save, X, Edit3, Trash2, Search, Calendar, Tag, LogIn } from "lucide-react"
import FreeNotes from './FreeNotes'

interface Note {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}



export default function Notes() {
  const { data: session, status } = useSession()
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: "", content: "", tags: "" })
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    if (!session?.user?.email) return
    try {
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes?email=${encodeURIComponent(session.user.email)}`,
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(`Error: ${err.error || "Failed to fetch notes"}`)
      }
      const data = await res.json()
      setNotes(data)
    } catch (e) {
      console.error("Fetch error:", e)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    if (!session?.user?.email || !newNote.title.trim() || !newNote.content.trim()) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          title: newNote.title.trim(),
          content: newNote.content.trim(),
          tags: newNote.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error("Failed to create note")
      const data = await res.json()
      setNotes([data, ...notes])
      setNewNote({ title: "", content: "", tags: "" })
      setIsCreating(false)
    } catch (err) {
      console.error("Create note error:", err)
    }
  }

  const updateNote = async (id: string, updated: Partial<Note>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData?.error || "Update failed")
      }
      const data = await res.json()
      setNotes(notes.map((n) => (n._id === id ? data : n)))
      setEditingId(null)
    } catch (err) {
      if (err instanceof Error) {
        console.log("failerd to update", err.message)
      } else {
        console.log("failerd to update", err)
      }
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${id}`, { method: "DELETE" })
      setNotes(notes.filter((n) => n._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotes()
    } else if (status !== "loading") {
      setLoading(false)
    }
  }, [session, status])

  const filtered = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
  )

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <div className="fixed top-20 right-4 w-96 max-h-[80vh] bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 backdrop-blur-sm rounded-2xl shadow-2xl z-50 border border-amber-200/50 overflow-hidden">
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-3 text-amber-700">Loading...</span>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
if (!session || session?.user?.plan!=='pro') {
  return (
    <div>
      {/* <p>Please sign in to access your notes</p> */}
      <FreeNotes session={session} signIn={signIn}  />
      {/* <button onClick={() => signIn()}>Sign In</button> */}
    </div>
  );
}

  return (
    <div className="fixed top-20 right-4 w-96 max-h-[80vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-md rounded-2xl shadow-2xl z-50 border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-500/60 bg-gradient-to-r from-gray-900 to-black backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <StickyNote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                My Notes
              </h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
                {notes.length} notes
              </Badge>
            </div>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
          <Input
            className="pl-12 bg-gray-800/90 border-gray-700 focus:border-purple-500 focus:ring-purple-500/50 text-gray-200 placeholder:text-gray-500 shadow-sm rounded-xl"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isCreating && (
        <Card className="m-4 border-gray-700/60 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md shadow-lg rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Create New Note
              </CardTitle>
              <Button
                onClick={() => setIsCreating(false)}
                variant="ghost"
                size="sm"
                className="hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Enter note title..."
              className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg"
            />
            <Textarea
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Write your thoughts..."
              className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg min-h-[100px] resize-none"
            />
            <Input
              value={newNote.tags}
              onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              placeholder="Add tags (comma separated)..."
              className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg"
            />
            <Button
              onClick={createNote}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 rounded-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notes List with Custom Scrollbar */}
      <div
        className="max-h-[350px] overflow-y-auto p-4 custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#8b5cf6 #1f2937',
        }}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937;
            border-radius: 10px;
            margin: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #8b5cf6;
            border-radius: 10px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a78bfa;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          .custom-scrollbar {
            scroll-behavior: smooth;
          }
          .custom-scrollbar::-webkit-scrollbar {
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          .custom-scrollbar:hover::-webkit-scrollbar {
            opacity: 1;
          }
        `}</style>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-400">Loading notes...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <p className="text-gray-500">
                {search ? "No notes match your search" : "No notes yet. Create your first note!"}
              </p>
            </div>
          ) : (
            filtered.map((note) => {
              const isEditing = editingId === note._id;
              return (
                <Card
                  key={note._id}
                  className="border-gray-700/60 bg-gray-800/90 backdrop-blur-md shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 rounded-xl overflow-hidden"
                >
                  <CardContent className="p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          placeholder="Title"
                          className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg font-medium"
                        />
                        <Textarea
                          value={editData.content}
                          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                          placeholder="Content"
                          rows={3}
                          className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg resize-none"
                        />
                        <Input
                          value={editData.tags}
                          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                          placeholder="Tags (comma separated)"
                          className="bg-gray-700/90 border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 text-gray-200 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              updateNote(note._id, {
                                title: editData.title,
                                content: editData.content,
                                tags: editData.tags
                                  .split(",")
                                  .map((tag) => tag.trim())
                                  .filter(Boolean),
                              })
                            }
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex-1 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg cursor-pointer" 
                          >
                            <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                          <Button
                            onClick={() => setEditingId(null)}
                            variant="outline"
                            className="flex-1 border-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-100 leading-tight flex-1 mr-3">{note.title}</h3>
                          <div className="flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(note._id);
                                setEditData({
                                  title: note.title,
                                  content: note.content,
                                  tags: note.tags.join(", "),
                                });
                              }}
                              className="hover:bg-blue-900/50 hover:text-blue-400 rounded-lg p-2 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-white" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNote(note._id)}
                              className="hover:bg-red-900/50 hover:text-red-400 rounded-lg p-2 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-gray-200 leading-relaxed text-sm bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 whitespace-pre-wrap">
                          {note.content}
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/40 hover:from-blue-500/30 hover:to-purple-500/30 transition-colors rounded-full px-3 py-1"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-gray-400 bg-gray-700/60 px-3 py-2 rounded-lg border border-gray-600/50">
                          <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                          <span>Updated {new Date(note.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
