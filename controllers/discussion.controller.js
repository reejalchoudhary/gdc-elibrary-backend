import Discussion from '../models/Discussion.model.js';

export const getAllDiscussions = async (req, res, next) => {
  try {
    const discussions = await Discussion.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: discussions.length,
      data: discussions
    });
  } catch (error) {
    next(error);
  }
};

export const createDiscussion = async (req, res, next) => {
  try {
    const { text } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    const discussion = await Discussion.create({
      text: text.trim(),
      name: user.name,
      from: user.role === 'admin' ? 'Admin' : 'Student',
      userId: user._id,
      highlight: false
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Message posted successfully',
      data: populatedDiscussion
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDiscussion = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Discussion.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await Discussion.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: 'Discussion message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};





