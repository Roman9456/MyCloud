import { 
  registerUser, 
  loginUser, 
  fetchFiles, 
  uploadFile, 
  deleteFile, 
  fetchUsers, 
  fetchUserData, 
  updateComment, 
  updateFileName 
} from '../api';  // Ensure the path is correct

// Action creators for user and file management
export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user,
});

export const setFiles = (files) => ({
  type: 'SET_FILES',
  payload: files,
});

export const addFile = (file) => ({
  type: 'ADD_FILE',
  payload: file,
});

export const removeFile = (fileId) => ({
  type: 'REMOVE_FILE',
  payload: fileId,
});

export const setUsers = (users) => ({
  type: 'SET_USERS',
  payload: users,
});

// Utility function to handle token saving and setting user
const handleTokenAndSetUser = (response, dispatch) => {
  const token = response.data?.token;
  if (token) {
    localStorage.setItem('token', token); // Store token in localStorage
    dispatch(setUser(response.data)); // Dispatch user data
  }
  return token;
};

// User authentication actions
export const register = (userData) => async (dispatch) => {
  try {
    const response = await registerUser(userData);
    handleTokenAndSetUser(response, dispatch); // Handle token and set user
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error(error?.response?.data?.detail || error.message);
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await loginUser(credentials);
    handleTokenAndSetUser(response, dispatch); // Handle token and set user
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(error?.response?.data?.detail || error.message);
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(setUser(null)); // Clear user data from Redux
};

// File management actions
export const loadFiles = (token) => async (dispatch) => {
  try {
    const response = await fetchFiles(token);
    dispatch(setFiles(response.data));
  } catch (error) {
    console.error("Failed to load files:", error);
  }
};

export const upload = (file, comment, token) => async (dispatch) => {
  try {
    const response = await uploadFile(file, comment, token);
    dispatch(addFile(response.data));
    dispatch({ type: 'UPLOAD_FILE_SUCCESS', payload: response.data });
  } catch (error) {
    console.error("File upload failed:", error);
    dispatch({ type: 'UPLOAD_FILE_FAILURE', payload: error });
    throw new Error(error?.response?.data?.detail || "File upload failed");
  }
};

export const updateCommentAction = (fileId, comment, token) => async (dispatch) => {
  try {
    const response = await updateComment(fileId, comment, token);
    dispatch({ type: 'UPDATE_COMMENT_SUCCESS', payload: response.data });
  } catch (error) {
    console.error("Failed to update comment:", error);
    dispatch({ type: 'UPDATE_COMMENT_FAILURE', payload: error?.response?.data || error.message });
    throw new Error(error?.response?.data?.detail || "Failed to update comment");
  }
};

export const updateFileNameAction = (fileId, newName, token) => async (dispatch) => {
  try {
    const response = await updateFileName(fileId, newName, token);
    dispatch({ type: 'UPDATE_FILE_NAME_SUCCESS', payload: response.data });
  } catch (error) {
    console.error("Failed to update file name:", error);
    dispatch({ type: 'UPDATE_FILE_NAME_FAILURE', payload: error?.response?.data || error.message });
    throw new Error(error?.response?.data?.detail || "Failed to update file name");
  }
};

export const deleteFileAction = (fileId, token) => async (dispatch) => {
  try {
    await deleteFile(fileId, token);
    dispatch(removeFile(fileId));
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};

// User management actions
export const loadUsers = (token) => async (dispatch) => {
  try {
    const response = await fetchUsers(token);
    dispatch(setUsers(response.data));
  } catch (error) {
    if (error?.response?.status === 403) {
      console.error("Access denied: You are not an admin.");
    } else {
      console.error("Failed to load users:", error);
    }
  }
};

export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const userResponse = await fetchUserData(token);
      dispatch(setUser(userResponse.data)); // Set user data if token is valid
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      dispatch(setUser(null)); // Clear user if fetching fails
    }
  } else {
    dispatch(setUser(null)); // Clear user if no token exists
  }
};
