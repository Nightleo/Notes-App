import notesSchema from "./schema.js";

export const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title){
      throw new Error('Title Not Found');
    } else if (!content) {
      throw new Error('Content Not Found');
    } 
    
    let dbResponse = await notesSchema.create({
      title,
      content,
    });

    if (!!dbResponse._id) {
      res.status(200).json({
        success: true,
        message: `Notes created successfully! ${dbResponse.id}`,
      });
    } else {
      throw new Error(dbResponse.message);
    }
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req, res, next) => {
  try {
    const notes = await notesSchema.find({});
    if (notes) {
      res.status(200).json({
        success: true,
        message: "Notes fetched successfully!",
        data: notes,
      });
    } else {
      throw new Error('Notes not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id, title, content } = req.body;
    if (!id) {
      throw new Error('ID Not Found')
    } else if(!title){
      throw new Error('Title Not Found');
    } else if (!content) {
      throw new Error('Content Not Found');
    } 
    const note = await notesSchema.findByIdAndUpdate(id, {
      title: title, content: content
    });
    if (note) {
      note.title = title || note.title;
      note.content = content || note.content;
      await note.save();
      res.status(200).json({
        success: true,
        message: "Note Updated successfully!",
      });
    } else {
      throw new Error("Note Updation Failed!")
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async(req, res, next) => {
  try {
    const deleted = await notesSchema.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(200).json({
        success: true,
        message: "Note Deleted successfully!",
        deleted
      });
    } else {
      throw new Error("Valid ID not found!")
    }
  } catch (error) {
    next(error);
  }
};
export const getSingleNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await notesSchema.findById(id);

    if (note) {
      res.status(200).json({
        success: true,
        message: "Note fetched successfully!",
        note,
      });
    } else {
      throw new Error("Given ID Not Matching!")
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

