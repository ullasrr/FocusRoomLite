import Note from '../models/notesModel.js';
import User from '../models/userModel.js';

export const getNotes = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const notes = await Note.find({ email }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch notes error:", err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};


export const createNote = async (req, res) => {
  const { email, title, content, tags } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'User not found' });
  if (user.plan !== 'pro') return res.status(403).json({ error: 'Only Pro users can create notes' });

  try {
    const note = await Note.create({ email, title, content, tags });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  if (!id || !update || Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'Invalid update request' });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, update, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
