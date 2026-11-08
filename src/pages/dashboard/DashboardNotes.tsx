import React, { useState } from 'react';
import { BookOpen, Plus, Tag, Calendar, User } from 'lucide-react';
import { INITIAL_NOTES } from '../../data/initialData';
import { WorkspaceNote } from '../../types';
import { soundFx } from '../../components/ui/AudioSynthesizer';

export const DashboardNotes: React.FC = () => {
  const [notes, setNotes] = useState<WorkspaceNote[]>(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<WorkspaceNote>(INITIAL_NOTES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedNote.content);

  const handleSelectNote = (note: WorkspaceNote) => {
    soundFx.playClick();
    setSelectedNote(note);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleSaveNote = () => {
    soundFx.playChime();
    const updated = notes.map((n) =>
      n.id === selectedNote.id ? { ...n, content: editContent, updatedAt: 'Just now' } : n
    );
    setNotes(updated);
    setSelectedNote({ ...selectedNote, content: editContent, updatedAt: 'Just now' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-bold text-content-primary">Markdown Knowledge Base</h1>
          <p className="text-xs text-content-secondary">
            Technical specifications, research notes, and studio guidelines
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            const newNote: WorkspaceNote = {
              id: `note-${Date.now()}`,
              title: 'Untitled Note',
              author: 'sreesh',
              content: '# New Studio Note\n\nWrite your thoughts or architecture details here...',
              tags: ['Idea'],
              updatedAt: 'Just now',
            };
            setNotes([newNote, ...notes]);
            setSelectedNote(newNote);
            setEditContent(newNote.content);
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-burgundy hover:bg-burgundy-soft text-white text-xs font-semibold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes List Column */}
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-colors space-y-2 ${
                selectedNote.id === note.id
                  ? 'border-burgundy-soft bg-surface-card shadow-sm'
                  : 'border-border-subtle bg-surface-card/50 hover:bg-surface-elevated/40'
              }`}
            >
              <h4 className="font-semibold text-content-primary truncate">{note.title}</h4>
              <div className="flex items-center justify-between text-[10px] font-mono text-content-muted">
                <span>By {note.author === 'sreesh' ? 'Sreesh' : 'Mrithula'}</span>
                <span>{note.updatedAt}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-content-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note Reader / Editor Column */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl border border-border-subtle bg-surface-card space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-content-primary">{selectedNote.title}</h3>
              <p className="text-[10px] font-mono text-content-muted">
                Last modified: {selectedNote.updatedAt} • Author: {selectedNote.author === 'sreesh' ? 'Sreesh M' : 'Mrithula'}
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                if (isEditing) {
                  handleSaveNote();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-border-strong bg-surface-elevated text-xs font-semibold text-content-primary hover:bg-burgundy-soft/20 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Edit Note'}
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={16}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full font-mono text-xs text-content-primary bg-surface-elevated/60 p-4 rounded-xl border border-border-subtle outline-none focus:border-burgundy-soft resize-none leading-relaxed"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-content-secondary leading-relaxed whitespace-pre-wrap font-sans">
              {selectedNote.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
