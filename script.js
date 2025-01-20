// Notes and chords mapping
const NOTES_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

let useFlats = false; // Default to sharps

// Helper function to validate notes or chords
function isValidNoteOrChord(note) {
  const NOTES = useFlats ? NOTES_FLATS : NOTES_SHARPS;
  const regex = new RegExp(`^(${NOTES.join('|')})(m|maj|min|dim|aug|7|6|9|11|13)?$`);
  return regex.test(note);
}

// Function to transpose a single note or chord
function transposeNoteOrChord(note, semitoneShift) {
  const NOTES = useFlats ? NOTES_FLATS : NOTES_SHARPS;
  const match = note.match(/^([A-Ga-g#b]+)(.*)$/); // Match root and chord extensions
  if (!match) return note; // If invalid, return as is

  const [_, root, extension] = match; // Split into root and extension
  const rootIndex = NOTES.indexOf(root);
  if (rootIndex === -1) return note; // If root is invalid, return as is

  const newIndex = (rootIndex + semitoneShift + NOTES.length) % NOTES.length;
  return NOTES[newIndex] + extension; // Combine transposed root and original extension
}

// Live validation of user input
document.getElementById("notes").addEventListener("input", () => {
  const notesInput = document.getElementById("notes").value;
  const notes = notesInput.split(" ").map(note => note.trim());
  const invalidNotes = notes.filter(note => !isValidNoteOrChord(note));

  const validationMessage = document.getElementById("validation-message");
  if (invalidNotes.length > 0) {
    validationMessage.textContent = `Invalid notes or chords: ${invalidNotes.join(", ")}`;
  } else {
    validationMessage.textContent = "";
  }
});

// Toggle notation between sharps and flats
document.getElementById("notation-toggle").addEventListener("click", () => {
  useFlats = !useFlats;
  const button = document.getElementById("notation-toggle");
  button.textContent = useFlats ? "Use Sharps (♯)" : "Use Flats (♭)";
  button.style.backgroundColor = useFlats ? "#ffc107" : "#28a745";
});

// Transpose button functionality
document.getElementById("transpose-btn").addEventListener("click", () => {
  const originalKey = document.getElementById("original-key").value;
  const targetKey = document.getElementById("target-key").value;
  const notesInput = document.getElementById("notes").value;

  const NOTES = useFlats ? NOTES_FLATS : NOTES_SHARPS;
  const originalIndex = NOTES.indexOf(originalKey);
  const targetIndex = NOTES.indexOf(targetKey);
  const semitoneShift = targetIndex - originalIndex;

  const notes = notesInput.split(" ").map(note => note.trim());
  const invalidNotes = notes.filter(note => !isValidNoteOrChord(note));

  const validationMessage = document.getElementById("validation-message");
  if (invalidNotes.length > 0) {
    validationMessage.textContent = `Cannot transpose due to invalid notes: ${invalidNotes.join(", ")}`;
    return;
  }

  validationMessage.textContent = ""; // Clear validation message
  const transposedNotes = notes.map(note => transposeNoteOrChord(note, semitoneShift));
  document.getElementById("transposed-notes").textContent = transposedNotes.join(" ");
});
